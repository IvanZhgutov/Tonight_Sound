import { useMemo, useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'

import { UseCalendarButtons } from '../../hooks/UseCalendarButtons'
import { months as monthsList, MONTHS_GENITIVE, MONTHS_FULL, TIME_OPTIONS } from '../../general/constats'

import { Square } from '../../components/Squares/Square'
import { CollapsedSquare } from '../../components/Squares/CollapsedSquare'
import { TimeSelection } from '../../components/Calendar/TimeSelection'

import { SvgArrowsForward, SvgArrowLeft, SvgArrowRight, SvgArrowMobileLeft, SvgArrowMobileRight } from '../../assets/icons/SvgArrow'

import './MainMobilePage.scss'

export const MainMobilePage = () => {
  const today = useMemo(() => new Date(), [])
  const todayYear = today.getFullYear()
  const todayMonthIndex = today.getMonth()
  const todayDay = today.getDate()
  const todayMonthGen = MONTHS_GENITIVE[todayMonthIndex]

  const [selectedMonthIndex, setSelectedMonthIndex] = useState(todayMonthIndex)

  const calendarWeeks = UseCalendarButtons(today)

  const [days, setDays] = useState({})
  const [order, setOrder] = useState([])
  const [activeKey, setActiveKey] = useState(null)

  const squaresContainerRef = useRef(null)

  // Автоскролл вниз при добавлении новых дней
  useEffect(() => {
    if (squaresContainerRef.current && order.length > 0) {
      const container = squaresContainerRef.current
      const start = container.scrollTop
      const end = container.scrollHeight
      const duration = 1000
      const startTime = performance.now()

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)

        const easeProgress = progress

        container.scrollTop = start + (end - start) * easeProgress

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      requestAnimationFrame(animate)
    }
  }, [order.length])

  // Автоскролл при раскрытии collapsed квадрата
  useEffect(() => {
    if (!activeKey || !squaresContainerRef.current) return

    const container = squaresContainerRef.current

    setTimeout(() => {
      if (!squaresContainerRef.current) return

      const activeElement = container.querySelector(`[data-square-key="${activeKey}"]`)
      if (!activeElement) return

      const containerRect = container.getBoundingClientRect()
      const elementRect = activeElement.getBoundingClientRect()

      const elementTop = elementRect.top - containerRect.top + container.scrollTop
      const elementBottom = elementTop + elementRect.height

      const containerHeight = container.clientHeight
      const currentScroll = container.scrollTop

      let targetScroll = currentScroll

      if (elementTop < currentScroll) {
        targetScroll = elementTop
      } else if (elementBottom > currentScroll + containerHeight) {
        targetScroll = elementBottom - containerHeight
      }

      if (targetScroll !== currentScroll) {
        const start = currentScroll
        const distance = targetScroll - start
        const duration = 400
        const startTime = performance.now()

        const animate = (currentTime) => {
          const elapsed = currentTime - startTime
          const progress = Math.min(elapsed / duration, 1)

          const easeProgress = 1 - Math.pow(1 - progress, 3)

          container.scrollTop = start + distance * easeProgress

          if (progress < 1) {
            requestAnimationFrame(animate)
          }
        }

        requestAnimationFrame(animate)
      }
    }, 100)
  }, [activeKey, order])

  const dayKey = (d, m, y) => `${y}-${m}-${d}`

  const removeKey = (key) => {
    setDays((prev) => {
      const { [key]: _, ...rest } = prev
      return rest
    })
    setOrder((prev) => prev.filter((k) => k !== key))
  }

  const handleDayClick = (button) => {
    if (button.status === 'inactive' || button.status === 'weekTitle') return
    if (!button.inCurrentMonth) return

    const key = dayKey(button.title, todayMonthIndex, todayYear)

    if (activeKey === key) {
      setActiveKey(null)
      if ((days[key]?.hours.length ?? 0) === 0) {
        removeKey(key)
      }
      return
    }

    if (activeKey && (days[activeKey]?.hours.length ?? 0) === 0) {
      removeKey(activeKey)
    }

    setDays((prev) => {
      if (prev[key]) return prev
      return {
        ...prev,
        [key]: {
          day: button.title,
          monthIndex: todayMonthIndex,
          year: todayYear,
          hours: [],
        },
      }
    })
    setOrder((prev) => (prev.includes(key) ? prev : [...prev, key]))
    setActiveKey(key)
  }

  const handleTimeClick = (time) => {
    if (time.status === 'inactive') return
    if (!activeKey) return

    setDays((prev) => {
      const cur = prev[activeKey]
      if (!cur) return prev
      const has = cur.hours.includes(time.title)
      const hours = has
        ? cur.hours.filter((h) => h !== time.title)
        : [...cur.hours, time.title].sort()
      return { ...prev, [activeKey]: { ...cur, hours } }
    })
  }

  const handleRemoveHour = (key, hour) => {
    setDays((prev) => {
      const cur = prev[key]
      if (!cur) return prev
      return { ...prev, [key]: { ...cur, hours: cur.hours.filter((h) => h !== hour) } }
    })
  }

  const handleCancelDay = (key) => {
    if (activeKey === key) setActiveKey(null)
    removeKey(key)
  }

  const handleCloseTimeSelection = () => {
    if (activeKey && (days[activeKey]?.hours.length ?? 0) === 0) {
      removeKey(activeKey)
    }
    setActiveKey(null)
  }

  const handleExpandCollapsed = (key) => {
    if (activeKey && activeKey !== key && (days[activeKey]?.hours.length ?? 0) === 0) {
      removeKey(activeKey)
    }
    setActiveKey(key)
  }

  const activeWeekIndex = useMemo(() => {
    if (!activeKey) return -1
    const parts = activeKey.split('-')
    const d = Number(parts[2])
    for (let i = 1; i < calendarWeeks.length; i++) {
      const week = calendarWeeks[i]
      const found = week.some((btn) => btn.inCurrentMonth && btn.title === d)
      if (found) return i
    }
    return -1
  }, [activeKey, calendarWeeks])

  const timeOptions = useMemo(() => {
    const selected = activeKey ? days[activeKey]?.hours || [] : []
    return TIME_OPTIONS.map((t) => {
      if (t.status === 'inactive') return t
      return { ...t, status: selected.includes(t.title) ? 'active' : 'default' }
    })
  }, [activeKey, days])

  const getButtonStatus = (button) => {
    if (button.status === 'inactive' || button.status === 'weekTitle') return button.status
    if (!button.inCurrentMonth) return 'inactive'

    const key = dayKey(button.title, todayMonthIndex, todayYear)
    if (key === activeKey) return 'active'
    if (days[key]) return 'marked'
    if (button.status === 'today') return 'today'
    return 'default'
  }

  const hasAnyHours = useMemo(
    () => order.some((k) => (days[k]?.hours.length ?? 0) > 0),
    [order, days]
  )

  const handlePrevMonth = () => {
    setSelectedMonthIndex((prev) => (prev === 0 ? 11 : prev - 1))
  }

  const handleNextMonth = () => {
    setSelectedMonthIndex((prev) => (prev === 11 ? 0 : prev + 1))
  }

  const renderSquares = () => {
    if (order.length === 0) {
      return (
        <Square
          key="square-main"
          state="noday"
          day={todayDay}
          monthName={todayMonthGen}
          isToday
          hasFreeHours={false}
          isMobile={true}
        />
      )
    }

    const shouldCollapseInactive = order.length > 1

    return order.map((key, index) => {
      const d = days[key]
      if (!d) return null
      const monthName = MONTHS_GENITIVE[d.monthIndex]
      const isActive = key === activeKey
      const state = d.hours.length > 0 ? 'full' : 'ready'

      if (shouldCollapseInactive && !isActive) {
        return (
          <div key={key} data-square-key={key}>
            <CollapsedSquare
              day={d.day}
              monthName={monthName}
              onClick={() => handleExpandCollapsed(key)}
            />
          </div>
        )
      }

      return (
        <div key="square-main" data-square-key={key}>
          <Square
            state={state}
            day={d.day}
            monthName={monthName}
            hours={d.hours}
            isToday={false}
            hasFreeHours
            showCollapseToggle={shouldCollapseInactive && isActive}
            onRemoveHour={(h) => handleRemoveHour(key, h)}
            onCancel={() => handleCancelDay(key)}
            onCollapse={() => setActiveKey(null)}
            isMobile={true}
          />
        </div>
      )
    })
  }

  return (
    <div className="container-form-mobile">
      <h1>Записаться на студию</h1>

      <div className="calendarContainer-mobile">
        <LayoutGroup>
        {/* ============ квадраты сверху ============ */}
        <div className="squares-mobile">
          <LayoutGroup>
            <AnimatePresence mode="popLayout" initial={false}>
              <div className='squares-container-mobile' ref={squaresContainerRef}>
                {renderSquares()}
              </div>
            </AnimatePresence>

            <AnimatePresence mode="sync" initial={false}>
              {hasAnyHours && (
                <motion.button
                  key="next-btn"
                  type="button"
                  className="button primary"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  layout
                >
                  Далее <SvgArrowsForward />
                </motion.button>
              )}
            </AnimatePresence>
          </LayoutGroup>
        </div>

        {/* ============ календарь ============ */}
        <div className="calendar-mobile">
          <LayoutGroup>
            {calendarWeeks.map((week, weekIndex) => (
              <motion.div
                key={`week-${weekIndex}`}
                layout
                initial={false}
                transition={{ layout: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
              >
                <div className="week-mobile">
                  {week.map((button) => {
                    const status = getButtonStatus(button)
                    const isWeekTitle = status === 'weekTitle'

                    // Скрываем weekTitle когда открыт TimeSelection
                    if (isWeekTitle && activeKey !== null) {
                      return null
                    }

                    return (
                      <div
                        key={button.id}
                        className={`calendar-button-wrapper-mobile wrapper-${status}`}
                        onClick={() => handleDayClick(button)}
                      >
                        <motion.button
                          type="button"
                          className={`calendar-button-mobile ${status}`}
                          initial={false}
                          animate={{
                            height: isWeekTitle ? '32px' : (activeKey !== null ? '40px' : '40px'),
                          }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        >
                          {button.title}
                        </motion.button>
                      </div>
                    )
                  })}
                </div>

                <AnimatePresence initial={false}>
                  {weekIndex === activeWeekIndex && (
                    <TimeSelection
                      key="time-selection"
                      timeOptions={timeOptions}
                      onTimeClick={handleTimeClick}
                      onClose={handleCloseTimeSelection}
                      isMobile={true}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </LayoutGroup>

          {/* ============ переключатель месяцев ============ */}
          <div className="month-switcher">
            <button
              type="button"
              className="month-arrow"
              onClick={handlePrevMonth}
              aria-label="Предыдущий месяц"
            >
              <SvgArrowMobileLeft />
            </button>
            <span className="current-month">{MONTHS_FULL[selectedMonthIndex]}</span>
            <button
              type="button"
              className="month-arrow"
              onClick={handleNextMonth}
              aria-label="Следующий месяц"
            >
              <SvgArrowMobileRight />
            </button>
          </div>
        </div>
        </LayoutGroup>
      </div>
    </div>
  )
}
