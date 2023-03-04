"use client"

import { Button, Input } from "ui"
import { Shantell_Sans } from "next/font/google"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

const shantell = Shantell_Sans({ subsets: ["latin"], weight: "700" })

const Index = () => {
  const router = useRouter()

  const [pseudo, setPseudo] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const pseudo = window.localStorage.getItem("pseudo")
    setPseudo(pseudo || "")
  }, [])

  const handleButtons = (type: "join" | "private") => {
    if (!pseudo) return

    setLoading(true)
    window.localStorage.setItem("pseudo", pseudo)
    router.push(`/tic-tac-toe/play?gameId=${"123"}`)
    setLoading(false)
  }

  return (
    <>
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-primary border border-customBlack px-16 py-12 rounded-xl w-3/6 max-w-2xl flex flex-col items-center">
          <h1 className={"text-3xl text-center " + shantell.className}>
            Tic Tac Toe
          </h1>
          <Input
            label="Pseudo"
            containerClassName="w-full"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
          />
          <Button
            onClick={() => handleButtons("join")}
            label="Trouver une partie"
            color="secondary"
            className="mt-6 w-full"
            loading={loading}
          />
          <Button
            onClick={() => handleButtons("private")}
            label="Créer une partie privée"
            className="mt-2 w-full"
            loading={loading}
          />
        </div>
      </div>
    </>
  )
}

export default Index
