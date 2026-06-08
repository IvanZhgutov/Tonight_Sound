import { motion } from 'framer-motion'
import { SvgArrowRight } from '../../assets/icons/SvgArrow'

export const CollapsedSquare = ({ day, monthName, onClick }) => (
  <motion.div
    className="square-collapsed"
    layout
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.92 }}
    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    onClick={onClick}
  >
    <div className="collapsed-date">
      {day}
      <span className="collapsed-month">{monthName}</span>
    </div>
    <div className="collapsed-arrow">
      <SvgArrowRight />
    </div>
  </motion.div>
)