"use client"

import React, { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Shantell_Sans } from "next/font/google"
import Circle from "../../../components/Circle"
import { XMarkIcon } from "@heroicons/react/24/outline"
import UserAvatar from "../../../components/UserAvatar"
import { useSocket } from "../../../contexts/SocketContext"
import { useUser } from "../../../contexts/UserContext"

const shantell = Shantell_Sans({ subsets: ["latin"], weight: "700" })

type Props = { params: { id: string } }

const Page = ({ params }: Props) => {
  const { socket } = useSocket()
  const { name } = useUser()
  const [board, setBoard] = useState<string[][]>([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ])
  const [turn, setTurn] = useState(false)
  const [players, setPlayers] = useState<any[]>([])

  const [information, setInformation] = useState("")

  useEffect(() => {
    socketListenersInit()
    getGame()
  }, [socket])

  const getGame = async () => {
    socket?.emit("get", params.id)
  }

  const socketListenersInit = async () => {
    socket?.on("game", onGameUpdate)
    socket?.on("winner", onGameEnd)
    socket?.on("draw", onGameDraw)
  }

  const socketListenersDestroy = async () => {
    socket?.off("game", onGameUpdate)
    socket?.off("winner", onGameEnd)
    socket?.off("draw", onGameDraw)
  }

  const updateGame = async (game: any) => {
    setBoard(game._board)
    setTurn(game._players[game._turn]._name === name)
    setPlayers(game._players)
  }

  const onGameUpdate = async (game: any) => {
    updateGame(game)

    if (game._status === "lobby") {
      setInformation("En attente d'un adversaire")
    } else if (game._status === "playing") {
      setInformation(
        `Au tour de ${game._players[game._turn]._name} (${
          game._players[game._turn]._avatar
        })`,
      )
    }
  }

  const onGameEnd = async (winner: any, game: any) => {
    updateGame(game)

    setInformation(`${winner._name} (${winner._avatar}) a gagné !`)

    socketListenersDestroy()
  }

  const onGameDraw = async (game: any) => {
    updateGame(game)

    setInformation("Match nul !")

    socketListenersDestroy()
  }

  const handleSelection = (x: number, y: number) => {
    if (board[x][y] || !turn) return

    socket?.emit("play", {
      gameId: params.id,
      x,
      y,
    })
  }

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
        <UserAvatar
          avatar={players?.[0]?._avatar}
          pseudo={players?.[0]?._name}
        />
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-3 gap-0.5 bg-gray-200 rounded-xl overflow-hidden shadow">
            {board.map((row, rowIndex) =>
              row.map((box, colIndex) => (
                <div
                  key={rowIndex + ", " + colIndex}
                  onClick={() => handleSelection(rowIndex, colIndex)}
                  className={`bg-white flex items-center justify-center w-24 h-24 md:w-36 md:h-36 ${
                    box ? "cursor-default" : turn && "cursor-pointer"
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
              )),
            )}
          </div>
          <p className="text-center">{information}</p>
        </div>
        <UserAvatar
          avatar={players?.[1]?._avatar || "octopus"}
          pseudo={players?.[1]?._name || "..."}
        />
      </div>
    </div>
  )
}

export default Page
