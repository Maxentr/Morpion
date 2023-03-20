import { JoinGame } from "validations/joinGame"
import { CreatePlayer } from "validations/createPlayer"
import { PlayTicTacToe } from "validations/playTicTacToe"
import { SocketNamespaces } from "./common"
import { PlayConnectFour } from "validations/playConnectFour"

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

interface ClientConnectFourEvents extends ClientEvents {
  play: ({ gameId, x }: PlayConnectFour) => void
}

//! Add new events here for new namespaces (don't use "default" under any circumstances)
//! Don't forget to add the new namespace to the SocketNamespaces type
type GetClientEvents<N extends SocketNamespaces> = N extends "tic-tac-toe"
  ? ClientTicTacToeEvents
  : N extends "connect-four"
  ? ClientConnectFourEvents
  : ClientEvents

export type { GetClientEvents }
