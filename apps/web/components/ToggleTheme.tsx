import { useTheme } from "next-themes"
import React from "react"
import ThemeSelect from "ui/src/ThemeSelect"

type Props = {}

const ToggleTheme = ({}: Props) => {
  const { theme, setTheme } = useTheme()

  return (
    <ThemeSelect value={theme || "light"} onChange={(value) => setTheme(value)} />
  )
}

export default ToggleTheme
