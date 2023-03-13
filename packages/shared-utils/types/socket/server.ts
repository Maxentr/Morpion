import { Game } from "../../class/Game"
import { Player } from "../../class/Player"

export type ServerGameEvents<T extends Game> = {
  joinGame: (game: T) => void
  game: (game: T) => void
  winner: (game: T, winner: Player) => void
  draw: (game: T) => void
  replay: (game: T) => void
  leaveGame: (game: T) => void
  playerLeave: (game: T) => void
}