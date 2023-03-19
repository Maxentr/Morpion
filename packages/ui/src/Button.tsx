import * as React from "react"

const getVariantStyle = {
  filled: "border",
  outlined: "border bg-transparent",
}

const getColorStyle = {
  primary: "border-primary bg-primary",
  secondary: "border-secondary bg-secondary",
  tertiary: "border-tertiary bg-tertiary",
  highlight: "border-highlight bg-highlight",
  customBlack: "border-customBlack bg-customBlack",
}

const getTextColorStyle: Record<string, string> = {
  filledprimary: "text-black",
  filledsecondary: "text-white",
  filledtertiary: "text-white",
  filledhighlight: "text-white",
  filledcustomBlack: "text-primary",
  outlinedprimary: "text-customBlack disabled:text-opacity-50",
  outlinedsecondary: "text-secondary disabled:text-opacity-50",
  outlinedtertiary: "text-tertiary disabled:text-opacity-50",
  outlinedhighlight: "text-highlight disabled:text-opacity-50",
  outlinedcustomBlack: "text-customBlack disabled:text-opacity-50",
}

const getSizeStyle = {
  small: "px-2 py-1 rounded text-sm",
  normal: "px-4 py-2 rounded-lg text-base",
  large: "px-6 py-4 rounded-xl text-lg",
}

interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  label: string
  variant?: "filled" | "outlined"
  color?: "primary" | "secondary" | "tertiary" | "highlight" | "customBlack"
  size?: "small" | "normal" | "large"
  loading?: boolean
  className?: string
}

const Button = ({
  label,
  variant = "filled",
  color = "highlight",
  size = "normal",
  loading = false,
  className,
  ...props
}: Props) => {
  return (
    <button
      className={`relative disabled:bg-opacity-50 disabled:border-opacity-50 ${getVariantStyle[variant]} ${
        getColorStyle[color]
      } ${getSizeStyle[size]} ${getTextColorStyle[variant + color]} ${
        loading && `cursor-wait`
      } ${className}`}
      {...props}
    >
      {loading && (
        <div
          className={`absolute inset-0 flex items-center justify-center rounded-md`}
        >
          <svg
            className={`animate-spin h-2/3`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M4 12a8 8 0 018-8v1a7 7 0 00-7 7h1z"
            ></path>
          </svg>
        </div>
      )}
      <p className={loading ? `text-transparent` : ``}>{label}</p>
    </button>
  )
}

export { Button }
