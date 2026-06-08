import { motion, AnimatePresence } from 'framer-motion'
import { SvgClose } from '../../assets/icons/SvgClose'
import { SvgNo } from '../../assets/icons/SvgNo'
import { SvgArrowDown } from '../../assets/icons/SvgArrow'
import { useSquareWidth } from '../../hooks/useSquareWidth'

/**
 * Square — карточка выбранного дня.
 *
 * state:
 *  - 'noday'  — состояние «Сегодня» (только для today, нет выбранных часов)
 *  - 'ready'  — день выбран, но часов ещё нет
 *  - 'full'   — есть выбранные часы
 *
 * Анимации (как просил пользователь):
 *  • Дата (.accent-container) плавно переезжает из центра в левый-верхний угол через layout-anim.
 *  • .hr появляется сверху-вниз (растёт height, transformOrigin top).
 *  • .right-header («Часы на студии» + список часов) — выезжает с правого края.
 *  • .info-content («Общее время / Цена») — выезжает с левого края.
 *  • .button «Отмена» — выезжает снизу.
 *  • «Сегодня» уходит вверх. «Свободного времени больше нет» / «Есть свободные часы» уходит вниз.
 */
export const Square = ({
  state,
  day,
  monthName,
  hours = [],
  isToday = false,
  hasFreeHours = true,
  showCollapseToggle = false,
  onRemoveHour,
  onCancel,
  onCollapse,
  isMobile = false,
}) => {
  const isFull = state === 'full'
  const { squareRef, width } = useSquareWidth()

  // Вычисляем смещение для центрирования: (ширина контейнера / 2) - (ширина accent / 2)
  const accentWidth = 125 // ширина .accent-container в мобильной версии
  const centerOffset = isMobile && width > 0 ? (width / 2 - accentWidth / 2) : (isMobile ? '110%' : '100%')

  return (
    <motion.div
      ref={squareRef}
      className="square"
      layout
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Кнопка свернуть, поверх — только если selectedDays > 2 */}
      {/* {showCollapseToggle && (
        <button
          type="button"
          className="collapse-btn"
          onClick={(e) => {
            e.stopPropagation()
            onCollapse?.()
          }}
          aria-label="Свернуть"
        >
          <SvgArrowDown />
        </button>
      )} */}

      <motion.div
        className="header"
        // animate={{
        //   padding: isFull ? '8px 12px' : '0px',
        // }}
        // transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* "Сегодня" — absolute, в центре */}
        <AnimatePresence>
          {!isFull && isToday && (
            <motion.span
              key="today-label"
              className="top-span gray-text"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              Сегодня
            </motion.span>
          )}
        </AnimatePresence>

        {/* Дата — сдвигается в центр через animate */}
        <motion.div
          className="accent-container"
          initial={{ opacity: 0, x: centerOffset, y: 42 }}
          animate={{
            opacity: 1,
            x: isFull ? 0 : centerOffset,
            y: isFull ? 0 : 42,
          }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="accent">{day}</span>
          
          <span className="month">{monthName}</span>
        </motion.div>

        {/* HR — растёт сверху вниз (height) */}
        <AnimatePresence>
          {isFull && (
            <motion.div
              key="hr"
              className="hr"
              initial={{ height: 0 }}
              animate={{ height: 100 }}
              exit={{ height: 0 }}
              transition={{ duration: 0.4 }}
            />
          )}
        </AnimatePresence>

        {/* Правая часть header — выезжает справа */}
        <AnimatePresence>
          {isFull && (
            <motion.div
              key="right-header"
              className="right-header"
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 28 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            >
              <span className="gray-text">Часы на студии:</span>
              <div className="time-studio-container">
                {hours.map((h) => (
                  <motion.div
                    key={h}
                    className="time-studio"
                    layout
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div>
                      {h}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onRemoveHour?.(h)
                        }}
                      >
                        <SvgClose />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Нижний статус (Свободного времени...) — уходит вниз */}
      <AnimatePresence>
        {!isFull && (
          <motion.div
            key="bottom-span"
            className="bottom-span"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {hasFreeHours ? (
              <div className="green-text">
                Есть свободные часы!
                <br />
                Записывайся!
              </div>
            ) : (
              <div className="gray-text">
                Свободного времени
                <br />
                больше нет
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Общее время / Цена — выезжает слева */}
      <AnimatePresence>
        {isFull && (
          <motion.div
            key="info-content"
            className="info-content gray-text"
            initial={{ opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -28 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          >
            Общее время: {hours.length} {pluralizeHours(hours.length)}
            <br />
            Цена: {hours.length * 500}р
          </motion.div>
        )}
      </AnimatePresence>

      {/* Отмена — выезжает снизу */}
      <AnimatePresence>
        {isFull && (
          <motion.button
            key="cancel-btn"
            className="button inactive"
            type="button"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            onClick={(e) => {
              e.stopPropagation()
              onCancel?.()
            }}
          >
            <SvgNo /> Отмена
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function pluralizeHours(n) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'час'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'часа'
  return 'часов'
}