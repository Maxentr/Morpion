"use client"

import React from "react"
import { GameNames } from "shared-utils"
import ConnectFour from "./(games)/ConnectFour"
import TicTacToe from "./(games)/TicTacToe"

type Props = { params: { game: GameNames; id: string } }

const Page = ({ params }: Props) => {
  const gameURL = `${window.location.origin}/${params.game}?gameId=${params.id}`

  const HandleGame = {
    "tic-tac-toe": <TicTacToe gameId={params.id} gameURL={gameURL} />,
    "connect-four": <ConnectFour gameId={params.id} gameURL={gameURL} />,
  }

  return HandleGame[params.game]
}

export default Page
