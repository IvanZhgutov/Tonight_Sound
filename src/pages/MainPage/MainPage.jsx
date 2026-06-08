import { useMemo, useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'

import { UseCalendarButtons } from '../../hooks/UseCalendarButtons'
import { months as monthsList, MONTHS_GENITIVE, TIME_OPTIONS } from '../../general/constats'

import { Square } from '../../components/Squares/Square'
import { CollapsedSquare } from '../../components/Squares/CollapsedSquare'
import { MonthsSquare } from '../../components/Squares/MonthsSquare'
import { TimeSelection } from '../../components/Calendar/TimeSelection'

import { SvgArrowsForward } from '../../assets/icons/SvgArrow'

import './MainPage.scss'

export const MainPage = () => {
  const today = useMemo(() => new Date(), [])
  const todayYear = today.getFullYear()
  const todayMonthIndex = today.getMonth()
  const todayDay = today.getDate()
  const todayMonthGen = MONTHS_GENITIVE[todayMonthIndex]

  const calendarWeeks = UseCalendarButtons(today)

  // days: ключ → объект дня { day, monthIndex, year, hours }
  // order: упорядоченный список ключей в порядке выбора
  // activeKey: ключ дня, для которого открыт выбор времени и раскрыт квадрат
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
      const duration = 1000 // 1 секунда
      const startTime = performance.now()

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)

        // Easing функция (linear)
        const easeProgress = progress

        container.scrollTop = start + (end - start) * easeProgress

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      requestAnimationFrame(animate)
    }
  }, [order.length])

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

    // Клик по уже активному дню — закрыть time-selection
    if (activeKey === key) {
      setActiveKey(null)
      // Если у дня не выбраны часы — убираем его из списка
      if ((days[key]?.hours.length ?? 0) === 0) {
        removeKey(key)
      }
      return
    }

    // Если предыдущий активный день не имеет часов — убираем его
    if (activeKey && (days[activeKey]?.hours.length ?? 0) === 0) {
      removeKey(activeKey)
    }

    // Добавляем новый день в days/order, если его там ещё нет
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
    // Если уже активный день не имел часов — убираем его
    if (activeKey && activeKey !== key && (days[activeKey]?.hours.length ?? 0) === 0) {
      removeKey(activeKey)
    }
    setActiveKey(key)
  }

  // Индекс недели, под которой нужно показать выбор времени
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

  // TIME_OPTIONS с подсветкой выбранных часов активного дня
  const timeOptions = useMemo(() => {
    const selected = activeKey ? days[activeKey]?.hours || [] : []
    return TIME_OPTIONS.map((t) => {
      if (t.status === 'inactive') return t
      return { ...t, status: selected.includes(t.title) ? 'active' : 'default' }
    })
  }, [activeKey, days])

  // Статус кнопки дня
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

  // Стек квадратов для правой колонки
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
        />
      )
    }

    // Если >1 дня → старые становятся collapsed
    const shouldCollapseInactive = order.length > 1

    return order.map((key, index) => {
      const d = days[key]
      if (!d) return null
      const monthName = MONTHS_GENITIVE[d.monthIndex]
      const isActive = key === activeKey
      const state = d.hours.length > 0 ? 'full' : 'ready'

      if (shouldCollapseInactive && !isActive) {
        return (
          <CollapsedSquare
            key={key}
            day={d.day}
            monthName={monthName}
            onClick={() => handleExpandCollapsed(key)}
          />
        )
      }

      // Стабильный key для активного квадрата — всегда "square-main"
      return (
        <Square
          key="square-main"
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
        />
      )
    })
  }

  return (
    <div className="container-form">
      <h1>Записаться на студию</h1>

      <div className="calendarContainer">
        {/* ============ календарь ============ */}
        <div className="calendar">
          <LayoutGroup>
            {calendarWeeks.map((week, weekIndex) => (
              <motion.div
                key={`week-${weekIndex}`}
                layout
                transition={{ layout: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
              >
                <div className="week">
                  {week.map((button) => {
                    const status = getButtonStatus(button)
                    return (
                      <div
                        key={button.id}
                        className={`calendar-button-wrapper wrapper-${status}`}
                        onClick={() => handleDayClick(button)}
                      >
                        <button type="button" className={`calendar-button ${status}`}>
                          {button.title}
                        </button>
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
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </LayoutGroup>
        </div>

        {/* ============ правая колонка с квадратами ============ */}
        <div className="squares">
          <LayoutGroup>
            <AnimatePresence mode="popLayout" initial={false}>
              <div className='squares-container' ref={squaresContainerRef}>
                {renderSquares()}
              </div>
            </AnimatePresence>

            <MonthsSquare months={monthsList} />

            <AnimatePresence initial={false}>
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
      </div>
    </div>
  )
}