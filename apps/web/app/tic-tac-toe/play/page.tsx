"use client"

import React, { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Shantell_Sans } from "next/font/google"
import Circle from "../../../components/Circle"
import { XMarkIcon } from "@heroicons/react/24/outline"
import Avatar from "../../../components/Avatar"

const shantell = Shantell_Sans({ subsets: ["latin"], weight: "700" })

type Props = {}

const Page = ({}: Props) => {
  const searchParams = useSearchParams()
  const [board, setBoard] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ])
  const [information, setInformation] = useState("")

  const handleSelection = (index: number) => {
    if (board[index]) return

    setBoard([
      ...board.slice(0, index),
      index % 2 === 0 ? "X" : "O",
      ...board.slice(index + 1),
    ])
  }

  // searchParams.get("gameId") = gameId (ex: "123")

  return (
    <div className="flex flex-col gap-4 flex-1 items-center justify-center">
      <h1
        className={
          "absolute top-2 left-2 text-2xl text-center " + shantell.className
        }
      >
        Tic Tac Toe
      </h1>
      <div className="flex-1 w-full flex flex-row justify-evenly items-center">
        <Avatar
          avatar="penguin"
          pseudo={window.localStorage.getItem("pseudo") || ""}
        />
        <div className="grid grid-cols-3 gap-0.5 bg-gray-200 rounded-xl overflow-hidden shadow">
          {board.map((box, index) => (
            <div
              key={index}
              onClick={() => handleSelection(index)}
              className={`bg-white flex items-center justify-center w-24 h-24 md:w-36 md:h-36 ${
                box ? "cursor-default" : "cursor-pointer"
              }`}
            >
              {box === "X" && (
                <>
                  <XMarkIcon className="w-20 h-20 md:w-28 md:h-28 text-highlight" />
                </>
              )}
              {box === "O" && (
                <Circle className="w-20 h-20 md:w-28 md:h-28 stroke-secondary fill-transparent" />
              )}
            </div>
          ))}
        </div>
        <Avatar avatar="koala" pseudo="Adversaire" />
      </div>
      <p>{information}</p>
    </div>
  )
}

export default Page
