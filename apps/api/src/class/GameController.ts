import { Game } from "./Game"

export class GameController<T extends Game> {
  private _name: string
  private _games: T[]

  constructor(name: string) {
    this._name = name
    this._games = []

    return this
  }

  get name(): string {
    return this._name
  }

  get games(): T[] {
    return this._games
  }

  addGame(game: T): void {
    this._games.push(game)
  }

  removeGame(gameId: string): void {
    this._games = this._games.filter((game) => {
      return game.id !== gameId
    })
  }

  getGame(gameId: string): T | undefined {
    return this._games.find((game) => {
      return game.id === gameId
    })
  }

  getGameNotFull(): T | undefined {
    return this._games.find((game) => {
      return !game.isFull() && game.status === "lobby" && !game.private
    })
  }
}

