import React from "react"

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
  size: "small" | "normal" | "large"
}

const getSizeStyle = {
  small: "px-2 py-1 rounded text-sm",
  normal: "px-4 py-2 rounded-lg text-base",
  large: "px-6 py-4 rounded-xl text-lg",
}

// TODO get sizes

const Input = ({ label, error, size = "normal", ...props }: Props) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor="name"
          className={`${error ? "text-red-500" : "text-customBlack"}`}
        >
          {label}
        </label>
      )}
      <div className="flex flex-col">
        <input
          className={`border ${
            error ? "border-red-500" : "border-customBlack"
          } ${getSizeStyle[size]}}`}
          {...props}
        />
        <span className="text-red-500">{error}</span>
      </div>
    </div>
  )
}

export default Input
