import { Game } from "../src/class/Game"
import { Player } from "../src/class/Player"
import { JoinGame } from "../src/validations/joinGame"
import { CreatePlayer } from "../src/validations/createPlayer"
import { PlayTicTacToe } from "../src/validations/playTicTacToe"

// type game<T> = T extends Game<Player> ? T : never

// TODO T n'est plus extends Game vu que T sera le infer du parse de zod
type ServerToClientEvents<T extends Game> = {
  joinGame: (game: T) => void
  game: (game: T) => void
  winner: (game: T, winner: Player) => void
  draw: (game: T) => void
  replay: (game: T) => void
  leaveGame: (game: T) => void
  playerLeave: (game: T) => void
}

type ClientToServerTicTacToeEvents = {
  join: ({ gameId, player }: JoinGame) => void
  find: (player: CreatePlayer) => void
  createPrivate: (player: Player) => void
  get: (gameId: string) => void
  replay: (gameId: string) => void
  play: ({ gameId, x, y }: PlayTicTacToe) => void
}

interface InterServerEvents {
  ping: () => void
}

interface SocketData {
  name: string
  age: number
}

export type { ServerToClientEvents, ClientToServerTicTacToeEvents }
