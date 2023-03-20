"use client"

import React, { useEffect, useState } from "react"
import { Shantell_Sans } from "next/font/google"
import UserAvatar from "~/components/UserAvatar"
import { useSocket } from "~/contexts/SocketContext"
import { useUser } from "~/contexts/UserContext"
import { Button } from "ui"
import { PlayerToJSON, TicTacToeToJSON } from "shared-utils"
import ClipboardInput from "~/components/ClipboardInput"
import Piece from "~/components/Piece"

const shantell = Shantell_Sans({ subsets: ["latin"], weight: "700" })

type Props = { gameId: string; gameURL: string }

const ConnectFour = ({ gameId, gameURL }: Props) => {
  const { socket } = useSocket("tic-tac-toe")

  const { name } = useUser()

  const [game, setGame] = useState<TicTacToeToJSON>()
  const [turn, setTurn] = useState(false)

  const [information, setInformation] = useState("")

  useEffect(() => {
    const gameListenersInit = async () => {
      socket?.on("game", onGameUpdate)
      socket?.on("winner", onGameEnd)
      socket?.on("draw", onGameDraw)
      socket?.on("replay", onReplay)
      socket?.on("playerLeave", onPlayerLeave)
    }

    gameListenersInit()
    getGame()

    return () => {
      const gameListenersDestroy = async () => {
        socket?.off("game", onGameUpdate)
        socket?.off("winner", onGameEnd)
        socket?.off("draw", onGameDraw)
        socket?.off("replay", onReplay)
        socket?.off("playerLeave", onPlayerLeave)
      }

      gameListenersDestroy()
    }
  }, [socket])

  const onReplay = () => {
    setInformation("Votre adversaire veut rejouer !")
  }

  const getGame = async () => {
    socket?.emit("get", gameId)
  }

  const updateGame = async (game: TicTacToeToJSON) => {
    setGame(game)
    setTurn(game.players[game.turn]?.name === name)
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

  const onPlayerLeave = async (game: TicTacToeToJSON) => {
    updateGame(game)

    setInformation("Votre adversaire a quitté la partie !")
  }

  const handleReplay = async () => {
    socket?.emit("replay", gameId)
  }

  const handleSelection = (x: number) => {
    if (!turn) return

    socket?.emit("play", {
      gameId,
      x,
    })
  }

  return (
    <div className="flex flex-col gap-4 flex-1 items-center justify-center">
      <h1
        className={
          "absolute top-2 left-2 text-2xl text-center text-customBlack dark:text-primary " + shantell.className
        }
      >
        Tic Tac Toe
      </h1>
      <div className="flex-1 w-full flex flex-row justify-evenly items-center">
        <UserAvatar
          avatar={game?.players?.[0]?.avatar}
          pseudo={game?.players?.[0]?.name}
          score={game?.players?.[0]?.score}
        />
        <div className="flex flex-col gap-2 items-center">
          <div className="flex flex-col gap-2 rounded-xl w-fit h-fit overflow-hidden bg-blue-800 dark:bg-blue-900 p-6">
            {game?.board.map((row, y) => (
              <div
                key={y}
                className="flex flex-row gap-2 bg-blue-800 dark:bg-blue-900"
              >
                {row.map((box, x) => (
                  <div
                    key={`${x}-${y}`}
                    className={`w-16 h-16 rounded-full grid-cols-1 bg-tertiary dark:bg-gray-400 flex items-center justify-center ${
                      box
                        ? "cursor-default"
                        : turn && "cursor-pointer bg-tertiary"
                    }`}
                    onClick={() => handleSelection(x)}
                  >
                    {box && (
                      <Piece
                        className={
                          box === "X" ? "fill-highlight" : "fill-secondary"
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <p className="text-customBlack dark:text-primary text-center mt-2">
            {information}
          </p>
          {game?.status === "lobby" && <ClipboardInput value={gameURL} />}
          {game?.status === "finished" && (
            <Button onClick={handleReplay} label="Rejouer" />
          )}
        </div>
        <UserAvatar
          avatar={game?.players?.[1]?.avatar}
          pseudo={game?.players?.[1]?.name || "..."}
          score={game?.players?.[1]?.score}
        />
      </div>
    </div>
  )
}

export default ConnectFour
