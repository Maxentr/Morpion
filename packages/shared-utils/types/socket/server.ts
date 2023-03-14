import { GameToJSON } from "../../class/Game"
import { PlayerToJSON } from "../../class/Player"

export type ServerGameEvents<T extends GameToJSON> = {
  joinGame: (game: T) => void
  game: (game: T) => void
  winner: (game: T, winner: PlayerToJSON) => void
  draw: (game: T) => void
  replay: (game: T) => void
  leaveGame: (game: T) => void
  playerLeave: (game: T) => void
}