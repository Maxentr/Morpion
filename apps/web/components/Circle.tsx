import React from "react"

type Props = {
  className?: string
}

const Circle = ({ className }: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
    >
      <circle cx="12" cy="12" r="7.4" strokeWidth={1.3} />
    </svg>
  )
}

export default Circle
