import { ConnectFourToJSON, TicTacToeToJSON } from "class"
import { SocketNamespaces } from "types/socket/common"
import { GameToJSON } from "../../class/Game"
import { PlayerToJSON } from "../../class/Player"

export type ServerErrorMessage =
  | "game-not-found"
  | "game-is-full"
  | "game-is-already-started"

export type ServerGameEvents<T extends GameToJSON> = {
  error: (error: ServerErrorMessage) => void
  joinGame: (game: T) => void
  game: (game: T) => void
  winner: (game: T, winner: PlayerToJSON) => void
  draw: (game: T) => void
  replay: (game: T) => void
  leaveGame: (game: T) => void
  playerLeave: (game: T) => void
}

//! Add new events here for new namespaces (don't use "default" under any circumstances)
//! Don't forget to add the new namespace to the SocketNamespaces type
export type GetServerEvents<N extends SocketNamespaces> = ServerGameEvents<
  N extends "tic-tac-toe"
    ? TicTacToeToJSON
    : N extends "connect-four"
    ? ConnectFourToJSON
    : GameToJSON
>
