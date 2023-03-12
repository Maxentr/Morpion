import { Game } from "../src/class/Game"
import { Player } from "../src/class/Player"
import { JoinGame } from "../src/validations/joinGame"
import { CreatePlayer } from "../src/validations/createPlayer"
import { PlayTicTacToe } from "../src/validations/playTicTacToe"

type ServerEvents<T extends Game> = {
  joinGame: (game: T) => void
  game: (game: T) => void
  winner: (game: T, winner: Player) => void
  draw: (game: T) => void
  replay: (game: T) => void
  leaveGame: (game: T) => void
  playerLeave: (game: T) => void
}

type ClientTicTacToeEvents = {
  join: ({ gameId, player }: JoinGame) => void
  find: (player: CreatePlayer) => void
  createPrivate: (player: Player) => void
  get: (gameId: string) => void
  replay: (gameId: string) => void
  play: ({ gameId, x, y }: PlayTicTacToe) => void
  leave: (gameId: string) => void
}

interface InterServerEvents {
  ping: () => void
}

interface SocketData {
  name: string
  age: number
}

export type { ServerEvents, ClientTicTacToeEvents }
