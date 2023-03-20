import React from "react"
import { motion } from "framer-motion"

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => {
    const delay = i * 0.5;
    return {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay, type: "spring", duration: 1, bounce: 0 },
        opacity: { delay, duration: 0.01 }
      }
    };
  }
};

type Props = {
  className?: string
}

const Cross = ({ className }: Props) => {
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
      <motion.line
        x1="6"
        y1="6"
        x2="18"
        y2="18"
        variants={draw}
        custom={0}
      />
      <motion.line
        x1="18"
        y1="6"
        x2="6"
        y2="18"
        variants={draw}
        custom={0.5}
      />
    </motion.svg>
  )
}

export default Cross
