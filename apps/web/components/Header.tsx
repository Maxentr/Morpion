import { useTheme } from "next-themes"
import { Shantell_Sans } from "next/font/google"
import React from "react"
import ToggleTheme from "~/components/ToggleTheme"

const shantell = Shantell_Sans({ subsets: ["latin"], weight: "700" })

type Props = {}

const Header = ({}: Props) => {
  const { theme, setTheme } = useTheme()

  return (
    <div className="w-full bg-transparent px-4 py-2 flex flex-row justify-between">
      <h1
        className={`text-2xl text-customBlack dark:text-primary ${shantell.className}`}
      >
        GAMING
      </h1>
      <div className="flex flex-row gap-4">
        <ToggleTheme />
      </div>
    </div>
  )
}

export default Header
