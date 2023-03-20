"use client"

import { Button } from "ui"
import { Shantell_Sans } from "next/font/google"
import { GameNames, GAME_NAMES } from "shared-utils"
import { useRouter } from "next/navigation"

const shantell = Shantell_Sans({ subsets: ["latin"], weight: "700" })

const Index = () => {
  const router = useRouter()

  const handlGameSelection = (game: GameNames) => {
    router.push(`/${game}`)
  }

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="bg-primary border dark:bg-dark-black border-customBlack px-16 py-12 rounded-xl w-3/6 max-w-2xl flex flex-col items-center">
        <h1
          className={
            "text-3xl text-center mb-2 text-customBlack dark:text-primary " +
            shantell.className
          }
        >
          Jeu de société en ligne !
        </h1>
        <p className="text-center mb-8 text-customBlack dark:text-primary">
          Il faut choisir un jeu là, après on pourra faire des trucs
        </p>
        <div className="flex flex-col items-center gap-4">
          {Object.keys(GAME_NAMES).map((game) => (
            <Button
              key={game}
              className="w-full"
              onClick={() => handlGameSelection(game as GameNames)}
              label={game === "tic-tac-toe" ? "Morpion" : "Puissance 4"}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Index
