import { motion, AnimatePresence } from 'framer-motion'

/**
 * Сетка часов 00:00..23:00, раскрывается под выбранной строкой календаря.
 * Каждая кнопка появляется со scale + opacity (stagger), и весь блок
 * аккуратно раскрывает свою высоту, чтобы лэйаут календаря под ним поехал пл авно.
 */
export const TimeSelection = ({ timeOptions, onTimeClick, onClose }) => {
  return (
    <motion.div
      className="time-selection"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: '250px' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      // transition={{ duration: 0.4 }}
    >
      <div className="hr-container">
        <hr />
        <span className="gray-text">Выбери время!</span>
        <hr />
        <button type="button" onClick={onClose}>
          <u>скрыть</u>
        </button>
      </div>


      <motion.div
        className="time-content"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={{
          hidden: { transition: { staggerChildren: 0.01, staggerDirection: -1 } },
          visible: { transition: { staggerChildren: 0.02, delayChildren: 0.1 } },
        }}
      >
        <AnimatePresence>
          {timeOptions.map((time) => (
            <motion.div
              key={time.title}
              className={`time-btn-wrapper wrapper-${time.status}`}
              onClick={() => onTimeClick(time)}
              variants={{
                hidden: { opacity: 0, scale: 0.7, y: -10 },
                visible: { opacity: 1, scale: 1, y: 0 },
              }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className={`time-btn ${time.status}`}>{time.title}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <div className="hr-container hr-end">
        <hr />
      </div>
    </motion.div>
  )
}