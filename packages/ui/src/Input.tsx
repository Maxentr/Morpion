import React from "react"

const getSizeStyle = {
  small: "px-2 py-1 rounded text-sm",
  normal: "px-4 py-2 rounded-lg text-base",
  large: "px-6 py-4 rounded-xl text-lg",
}

interface Props
  extends Omit<
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    "size"
  > {
  label?: string
  error?: string
  size?: "small" | "normal" | "large"
  className?: string
  containerClassName?: string
}

const Input = ({
  label,
  error,
  size = "normal",
  className,
  containerClassName,
  ...props
}: Props) => {
  return (
    <div className={`flex flex-col gap-1 ${containerClassName}`}>
      {label && (
        <label
          htmlFor="name"
          className={`${error ? "text-red-500" : "text-customBlack dark:text-primary"}`}
        >
          {label}
        </label>
      )}
      <div className="flex flex-col">
        <input
          className={`bg-primary dark:bg-dark-gray text-customBlack dark:text-primary border ${
            error ? "border-red-500" : "border-customBlack"
          } ${getSizeStyle[size]}} ${className}`}
          {...props}
        />
        <span className="text-red-500">{error}</span>
      </div>
    </div>
  )
}

export { Input }
