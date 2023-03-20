"use client"

import React, { useEffect, useState } from "react"
import Circle from "~/components/Circle"
import UserAvatar from "~/components/UserAvatar"
import { useSocket } from "~/contexts/SocketContext"
import { useUser } from "~/contexts/UserContext"
import { Button } from "ui"
import { PlayerToJSON, TicTacToeToJSON } from "shared-utils"
import Cross from "~/components/Cross"
import ClipboardInput from "~/components/ClipboardInput"

type Props = { gameId: string; gameURL: string }

const TicTacToe = ({ gameId, gameURL }: Props) => {
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
    const getGame = async () => {
      socket?.emit("get", gameId)
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

  const updateGameState = async (game: TicTacToeToJSON) => {
    setGame(game)
    setTurn(game.players[game.turn]?.name === name)
  }

  const onGameUpdate = async (game: TicTacToeToJSON) => {
    updateGameState(game)

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
    updateGameState(game)

    setInformation(`${winner.name} (${winner.avatar}) a gagné !`)
  }
  const onGameDraw = async (game: TicTacToeToJSON) => {
    updateGameState(game)

    setInformation("Match nul !")
  }
  const onPlayerLeave = async (game: TicTacToeToJSON) => {
    updateGameState(game)

    setInformation("Votre adversaire a quitté la partie !")
  }
  const onReplay = () => setInformation("Votre adversaire veut rejouer !")

  const handleReplay = async () => socket?.emit("replay", gameId)

  const handleSelection = (x: number, y: number) => {
    if (game?.board[x][y] || !turn) return

    socket?.emit("play", {
      gameId,
      x,
      y,
    })
  }

  return (
    <div className="flex flex-col gap-4 flex-1 items-center justify-center">
      <div className="flex-1 w-full flex flex-row justify-evenly items-center">
        <UserAvatar
          avatar={game?.players?.[0]?.avatar}
          pseudo={game?.players?.[0]?.name}
          score={game?.players?.[0]?.score}
        />
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-3 gap-0.5 bg-gray-200 dark:bg-gray-800 rounded-xl overflow-hidden shadow">
            {game?.board.map((row, rowIndex) =>
              row.map((box, colIndex) => (
                <div
                  key={rowIndex + ", " + colIndex}
                  onClick={() => handleSelection(rowIndex, colIndex)}
                  className={`bg-primary dark:bg-gray-700 flex items-center justify-center w-24 h-24 md:w-36 md:h-36 ${
                    box ? "cursor-default" : turn && "cursor-pointer"
                  }`}
                >
                  {box === "X" && (
                    <Cross className="w-20 h-20 md:w-28 md:h-28 stroke-highlight fill-transparent" />
                  )}
                  {box === "O" && (
                    <Circle className="w-20 h-20 md:w-28 md:h-28 stroke-secondary fill-transparent" />
                  )}
                </div>
              )),
            )}
          </div>
          <p className="text-customBlack dark:text-primary text-center">
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

export default TicTacToe
