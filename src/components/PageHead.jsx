import { motion } from 'motion/react'
import './PageHead.css'

const EASE = [0.22, 1, 0.36, 1]

export default function PageHead({ eyebrow, title, lede, children }) {
  return (
    <header className="page-head">
      <div className="page-head__text">
        <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          {eyebrow}
        </motion.p>
        <h1 className="page-head__title">
          <span className="reveal-line">
            <motion.span className="reveal-line__inner" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: EASE }}>
              {title}
            </motion.span>
          </span>
        </h1>
        {lede && (
          <motion.p className="page-head__lede" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15, ease: EASE }}>
            {lede}
          </motion.p>
        )}
      </div>
      {children && <div className="page-head__actions">{children}</div>}
    </header>
  )
}
