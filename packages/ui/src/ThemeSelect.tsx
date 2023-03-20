import React, { useState } from "react"
import {
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/solid"
import { AnimatePresence, motion } from "framer-motion"

type Props = {
  value: string
  onChange: (value: string) => void
}
type Theme = "light" | "dark" | "system"
const ThemeSelect = ({ value, onChange }: Props) => {
  const [isOpened, setIsOpened] = useState(false)

  const toggleOpen = () => setIsOpened(!isOpened)

  const Themes = {
    light: {
      name: "Light",
      icon: <SunIcon className="w-6 h-6" />,
      value: "light",
    },
    dark: {
      name: "Dark",
      icon: <MoonIcon className="w-6 h-6" />,
      value: "dark",
    },
    system: {
      name: "System",
      icon: <ComputerDesktopIcon className="w-6 h-6" />,
      value: "system",
    },
  }

  return (
    <div className="relative w-8 h-8">
      <div
        className={`w-8 h-8 flex items-center justify-center text-gray-400`}
        onClick={toggleOpen}
      >
        {Themes[value as Theme]?.icon}
      </div>
      <AnimatePresence>
        {isOpened && (
          <motion.div
            initial={{ opacity: 0, translateY: -5 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: -5 }}
            className="absolute top-full -right-0 mt-4 bg-primary dark:bg-dark-black border border-gray-300 dark:border-dark-black rounded-md shadow-sm cursor-pointer py-1"
          >
            {Object.keys(Themes).map((key: string) => (
              <div
                key={key}
                className={`flex flex-row items-center gap-2 px-4 py-1 hover:bg-gray-100 dark:hover:bg-dark-gray ${
                  value === Themes[key as Theme].value
                    ? "text-customBlack dark:text-primary"
                    : "text-gray-400"
                }`}
                onClick={() => {
                  onChange(Themes[key as Theme].value)
                  toggleOpen()
                }}
              >
                {Themes[key as Theme].icon}
                <span className={`text-sm mr-4 select-none`}>
                  {Themes[key as Theme].name}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ThemeSelect
