import { motion } from 'framer-motion'

export const MonthsSquare = ({ months }) => (
  <motion.div
    className="square months-wrapper"
    layout
    transition={{ layout: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
  >
    <div className="months">
      {months.map((month) => (
        <div key={month.title} className={`month ${month.status}`}>
          {month.title}
        </div>
      ))}
    </div>
  </motion.div>
)