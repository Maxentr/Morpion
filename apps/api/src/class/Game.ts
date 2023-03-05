import { Player } from "./Player"

type status = "lobby" | "playing" | "finished"

export class Game<T extends Player = Player> {
  private _id: string
  private _status: status
  private _maxPlayers: number
  private _players: T[]
  private _turn: number
  private _private: boolean

  constructor(maxPlayers: number, privateGame: boolean) {
    // generate a random game id with 8 characters (a-z, A-Z, 0-9)
    this._id = Math.random().toString(36).substring(2, 10)
    this._maxPlayers = maxPlayers
    this._status = "lobby"
    this._players = []
    this._turn = 0
    this._private = privateGame

    return this
  }

  get id(): string {
    return this._id
  }

  get players(): T[] {
    return this._players
  }

  get private(): boolean {
    return this._private
  }

  getPlayer(playerSocketID: string): T | undefined {
    return this._players.find((player) => {
      return player.socketID === playerSocketID
    })
  }

  addPlayer(player: T): void {
    if (this.isFull()) return
    this._players.push(player)
  }

  removePlayer(playerSocketID: string): void {
    this._players = this._players.filter((player) => {
      return player.socketID !== playerSocketID
    })
  }

  get status(): status {
    return this._status
  }

  set status(status: status) {
    this._status = status
  }

  get maxPlayers(): number {
    return this._maxPlayers
  }

  get turn(): number {
    return this._turn
  }

  set turn(turn: number) {
    this._turn = turn
  }

  isFull(): boolean {
    return this._players.length === this.maxPlayers
  }

  start(): void {
    if (!this.isFull()) return
    this.status = "playing"
    this._turn = Math.floor(Math.random() * this._players.length)

    console.log(`Game ${this.id} started`)
  }
}
