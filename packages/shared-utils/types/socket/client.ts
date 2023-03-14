import { JoinGame } from "../../validations/joinGame"
import { CreatePlayer } from "../../validations/createPlayer"
import { PlayTicTacToe } from "../../validations/playTicTacToe"
import { SocketNamespaces } from "./common"

type ClientEvents = {
  join: ({ gameId, player }: JoinGame) => void
  find: (player: CreatePlayer) => void
  createPrivate: (player: CreatePlayer) => void
  get: (gameId: string) => void
  replay: (gameId: string) => void
  leave: (gameId: string) => void
}

interface ClientTicTacToeEvents extends ClientEvents {
  play: ({ gameId, x, y }: PlayTicTacToe) => void
}

//! Add new events here for new namespaces (don't use "default" under any circumstances)
//! Don't forget to add the new namespace to the SocketNamespaces type
type GetClientEvents<N extends SocketNamespaces> = N extends "tic-tac-toe"
  ? ClientTicTacToeEvents
  : ClientEvents

export type { GetClientEvents }
