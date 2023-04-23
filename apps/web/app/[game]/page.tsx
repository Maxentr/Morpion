"use client"

import { Button, Input } from "ui"
import { Shantell_Sans } from "next/font/google"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSocket } from "~/contexts/SocketContext"
import SelectAvatar from "~/components/SelectAvatar"
import { useUser } from "~/contexts/UserContext"
import {
  CreatePlayer,
  GameNames,
  ServerErrorMessage,
  TicTacToeToJSON,
} from "shared-utils"
import { getErrorMessage } from "~/utils/error-handler"
import { useToast } from "~/contexts/ToastContext"

const shantell = Shantell_Sans({ subsets: ["latin"], weight: "700" })

type Props = { params: { game: GameNames } }

const GamePage = ({ params }: Props) => {
  const { name, avatar, setName, setAvatar, saveUserInLocalStorage } = useUser()
  const { connect } = useSocket()
  const { newToast } = useToast()

  const searchParams = useSearchParams()
  const router = useRouter()

  const gameId = searchParams.get("gameId")

  const [linkWithGame, setLinkWithGame] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (gameId) setLinkWithGame(true)
  }, [params])

  const handleButtons = (type: "join" | "find" | "createPrivate") => {
    if (!name) return
    setLoading(true)
    saveUserInLocalStorage()

    const socket = connect(params.game)

    const player: CreatePlayer = {
      name,
      avatar,
    }
    if (gameId && type === "join") socket.emit("join", { gameId, player })
    else socket.emit(type, { name, avatar })

    socket.on("joinGame", (game: TicTacToeToJSON) => {
      setLoading(false)
      router.push(`/${params.game}/${game.id}`)
    })
    socket?.on("error", (error: ServerErrorMessage) => {
      newToast({
        title: "Erreur",
        description: getErrorMessage(error),
        status: "error",
      })
      router.push(`/${params.game}`)
      setLoading(false)
    })
  }

  return (
    <>
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-primary dark:bg-dark-black border border-customBlack px-16 py-12 rounded-xl w-3/6 max-w-2xl flex flex-col items-center">
          <h1
            className={
              "text-3xl text-center text-customBlack dark:text-primary mb-2 " +
              shantell.className
            }
          >
            {params.game}
          </h1>
          <SelectAvatar containerClassName="mb-2" onChange={setAvatar} />
          <Input
            label="Nom"
            containerClassName="w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex flex-col gap-2 mt-6">
            {linkWithGame ? (
              <Button
                onClick={() => handleButtons("join")}
                label="Rejoindre la partie"
                color="secondary"
                className="w-full"
                loading={loading}
              />
            ) : (
              <>
                <Button
                  onClick={() => handleButtons("find")}
                  label="Trouver une partie"
                  color="secondary"
                  className="w-full"
                  loading={loading}
                />
                <Button
                  onClick={() => handleButtons("createPrivate")}
                  label="Créer une partie privée"
                  className="w-full"
                  loading={loading}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default GamePage
