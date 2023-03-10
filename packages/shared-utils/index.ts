// class
import { Game } from "./src/class/Game"
import { Player } from "./src/class/Player"
import { TicTacToe } from "./src/class/TicTacToe"

// validations
import createPlayer, { CreatePlayer } from "./src/validations/createPlayer"
import joinGame, { JoinGame } from "./src/validations/joinGame"
import playTicTacToe, { PlayTicTacToe } from "./src/validations/playTicTacToe"

// Types
import type { GAME_STATUS } from "./src/class/Game"
import { Avatar } from "./types/avatar"
import { ServerToClientEvents, ClientToServerTicTacToeEvents } from "./types/socket"

export { Game, Player, TicTacToe, createPlayer, joinGame, playTicTacToe }

export type {
  Avatar,
  ServerToClientEvents,
  ClientToServerTicTacToeEvents,
  GAME_STATUS,
  JoinGame,
  CreatePlayer,
  PlayTicTacToe,
}
