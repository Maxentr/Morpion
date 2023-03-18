import React from "react"
import { motion } from "framer-motion"

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => {
    const delay = 1 + i * 0.5
    return {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { type: "spring", duration: 1.5, bounce: 0 },
        opacity: { duration: 0.01 },
      },
    }
  },
}

type Props = {
  className?: string
}

const Circle = ({ className }: Props) => {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      style={{
        strokeWidth: 1.5,
        strokeLinecap: "round",
      }}
      className={className}
      initial="hidden"
      animate="visible"
    >
      <motion.circle
        cx="12"
        cy="12"
        r="7.4"
        initial={{
          pathLength: 0,
          opacity: 0,
        }}
        animate={{
          pathLength: 1,
          opacity: 1,
        }}
        transition={{
          pathLength: { type: "spring", duration: 1, bounce: 0 },
          opacity: { duration: 0.01 },
        }}
        strokeDasharray={0}
      />
    </motion.svg>
  )
}

export default Circle
