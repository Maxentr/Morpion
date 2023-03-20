"use client"

import React from "react"
import { GameNames } from "shared-utils"
import TicTacToe from "./(games)/TicTacToe"

type Props = { params: { game: GameNames; id: string } }

const Page = ({ params }: Props) => {
  const gameURL = `${process.env.NEXT_PUBLIC_APP_URL}/${params.game}?gameId=${params.id}`

  const HandleGame = {
    "tic-tac-toe": <TicTacToe gameId={params.id} gameURL={gameURL} />,
    "connect-four": "Connect Four",
  }

  return HandleGame[params.game]
}

export default Page
