"use client"

import { Button, Input } from "ui"
import { Shantell_Sans } from "next/font/google"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSocket } from "../contexts/SocketContext"
import SelectAvatar from "../components/SelectAvatar"
import { useUser } from "../contexts/UserContext"
import { Player, TicTacToe } from "shared-utils"

const shantell = Shantell_Sans({ subsets: ["latin"], weight: "700" })

const Index = () => {
  const { name, avatar, setName, setAvatar, saveUserInLocalStorage } = useUser()
  const { connect } = useSocket()

  const params = useSearchParams()
  const router = useRouter()

  const gameId = params.get("gameId")

  const [linkWithGame, setLinkWithGame] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // const game = params.get("game")

    if (gameId) setLinkWithGame(true)
  }, [params])

  const handleButtons = (type: "join" | "find" | "createPrivate") => {
    if (!name) return
    setLoading(true)
    saveUserInLocalStorage()

    const socket = connect()

    const player: Pick<Player, "name" | "avatar"> = {
      name,
      avatar,
    }
    if (gameId && type === "join") socket.emit("join", { gameId, player })
    else socket.emit(type, { name, avatar })

    socket.on("joinGame", (game: TicTacToe) => {
      console.table(game.id)
      setLoading(false)
      router.push(`/tic-tac-toe/${game.id}`)
    })
  }

  return (
    <>
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-primary border border-customBlack px-16 py-12 rounded-xl w-3/6 max-w-2xl flex flex-col items-center">
          <h1 className={"text-3xl text-center mb-2 " + shantell.className}>
            Tic Tac Toe
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

export default Index
