"use client"

import React, { useEffect, useState } from "react"
import { Shantell_Sans } from "next/font/google"
import Circle from "~/components/Circle"
import { XMarkIcon } from "@heroicons/react/24/outline"
import UserAvatar from "~/components/UserAvatar"
import { useSocket } from "~/contexts/SocketContext"
import { useUser } from "~/contexts/UserContext"
import { Button } from "ui"
import { GAME_STATUS, PlayerToJSON, TicTacToeToJSON } from "shared-utils"

const shantell = Shantell_Sans({ subsets: ["latin"], weight: "700" })

type Props = { params: { id: string } }

const Page = ({ params }: Props) => {
  const { socket } = useSocket("tic-tac-toe")

  const { name } = useUser()

  const [board, setBoard] = useState<string[][]>([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ])
  const [turn, setTurn] = useState(false)
  const [players, setPlayers] = useState<PlayerToJSON[]>([])
  const [gameState, setGameState] = useState<GAME_STATUS>("lobby")

  const [information, setInformation] = useState("")

  const gameURL = `${process.env.NEXT_PUBLIC_APP_URL}/?gameId=${params.id}`

  useEffect(() => {
    gameListenersInit()
    getGame()

    return () => {
      gameListenersDestroy()
    }
  }, [socket])

  const gameListenersInit = async () => {
    socket?.on("game", onGameUpdate)
    socket?.on("winner", onGameEnd)
    socket?.on("draw", onGameDraw)
    socket?.on("replay", onReplay)
  }

  const gameListenersDestroy = async () => {
    socket?.off("game", onGameUpdate)
    socket?.off("winner", onGameEnd)
    socket?.off("draw", onGameDraw)
    socket?.off("replay", onReplay)
  }

  const onReplay = () => {
    setInformation("Votre adversaire veut rejouer !")
  }

  const getGame = async () => {
    socket?.emit("get", params.id)
  }

  const updateGame = async (game: TicTacToeToJSON) => {
    setBoard(game.board)
    setTurn(game.players[game.turn].name === name)
    setPlayers(game.players)
    setGameState(game.status)
  }

  const onGameUpdate = async (game: TicTacToeToJSON) => {
    updateGame(game)

    if (game.status === "lobby") {
      setInformation(
        game.private
          ? "Partagez ce lien avec un ami pour commencer une partie :"
          : "En attente d'un adversaire",
      )
    } else if (game.status === "playing") {
      setInformation(
        `Au tour de ${game.players[game.turn].name} (${
          game.players[game.turn].avatar
        })`,
      )
    }
  }

  const onGameEnd = async (game: TicTacToeToJSON, winner: PlayerToJSON) => {
    updateGame(game)

    setInformation(`${winner.name} (${winner.avatar}) a gagné !`)
  }

  const onGameDraw = async (game: TicTacToeToJSON) => {
    updateGame(game)

    setInformation("Match nul !")
  }

  const handleReplay = async () => {
    socket?.emit("replay", params.id)
  }

  const handleSelection = (x: number, y: number) => {
    if (board[x][y] || !turn) return

    socket?.emit("play", {
      gameId: params.id,
      x,
      y,
    })
  }

  const handleClipboard = (e: any) => {
    navigator.clipboard.writeText(gameURL)
    e.target.blur()
    e.target.value = "Copié !"

    setTimeout(() => {
      e.target.value = gameURL
    }, 2000)
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
          avatar={players?.[0]?.avatar}
          pseudo={players?.[0]?.name}
          score={players?.[0]?.score}
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
          {gameState === "lobby" && (
            <div>
              <input
                type="text"
                className="text-center w-full border outline-none rounded"
                onClick={handleClipboard}
                defaultValue={gameURL}
              />
            </div>
          )}
          {gameState === "finished" && (
            <Button onClick={handleReplay} label="Rejouer" />
          )}
        </div>
        <UserAvatar
          avatar={players?.[1]?.avatar || "octopus"}
          pseudo={players?.[1]?.name || "..."}
          score={players?.[1]?.score}
        />
      </div>
    </div>
  )
}

export default Page
