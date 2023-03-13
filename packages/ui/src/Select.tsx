import React from "react"

const getSizeStyle = {
  small: "px-2 py-[5.5px] rounded text-sm",
  normal: "px-4 py-[9.5px] rounded-lg text-base",
  large: "px-6 py-[17.5px] rounded-xl text-lg",
}

interface Props<T>
  extends Omit<
    React.DetailedHTMLProps<
      React.SelectHTMLAttributes<HTMLSelectElement>,
      HTMLSelectElement
    >,
    "size"
  > {
  options: T
  label?: string
  error?: string
  size?: "small" | "normal" | "large"
  className?: string
  containerClassName?: string
}

type Option = { name: string; value: unknown }

const Select = <T extends Option[]>({
  label,
  options,
  error,
  size = "normal",
  className,
  containerClassName,
  ...props
}: Props<T>) => {
  return (
    <div className={`flex flex-col gap-1 ${containerClassName}`}>
      {label && (
        <label
          htmlFor="name"
          className={`${error ? "text-red-500" : "text-customBlack"}`}
        >
          {label}
        </label>
      )}
      <div className="flex flex-col">
        <select
          className={`border ${
            error ? "border-red-500" : "border-customBlack"
          } ${getSizeStyle[size]}} ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option
              key={option.value as string}
              value={
                typeof option.value === "number"
                  ? +option.value
                  : option.value + ""
              }
            >
              {option.name}
            </option>
          ))}
        </select>
        <span className="text-red-500">{error}</span>
      </div>
    </div>
  )
}

export { Select }
