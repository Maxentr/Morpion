import { Player } from "./Player"

export type GAME_STATUS = "lobby" | "playing" | "finished"

export type GameToJSON<T extends Player = Player> = Pick<
  IGame<T>,
  "id" | "status" | "maxPlayers" | "players" | "turn" | "private"
>
export interface IGame<T extends Player = Player> {
  id: string
  status: GAME_STATUS
  maxPlayers: number
  players: T[]
  turn: number
  private: boolean

  getPlayer(playerSocketID: string): T | undefined
  addPlayer(player: T): void
  removePlayer(playerSocketID: string): void
  isFull(): boolean
  start(): void
  checkTurn(playerSocketID: string): boolean
  nextTurn(): void
  reset(): void
  toJSON(): GameToJSON<T>
}

export abstract class Game<T extends Player = Player> implements IGame<T> {
  // generate a random game id with 8 characters (a-z, A-Z, 0-9)
  private _id: string = Math.random().toString(36).substring(2, 10)
  private _status: GAME_STATUS = "lobby"
  private _maxPlayers: number = 0
  private _players: T[] = []
  private _turn: number = 0
  private _private: boolean = false

  constructor(maxPlayers: number, privateGame: boolean) {
    this.maxPlayers = maxPlayers
    this.private = privateGame

    return this
  }

  public get id(): string {
    return this._id
  }

  public get status(): GAME_STATUS {
    return this._status
  }
  public set status(value: GAME_STATUS) {
    this._status = value
  }

  public get maxPlayers(): number {
    return this._maxPlayers
  }
  private set maxPlayers(value: number) {
    this._maxPlayers = value
  }

  public get players(): T[] {
    return this._players
  }
  private set players(value: T[]) {
    this._players = value
  }

  public get turn(): number {
    return this._turn
  }
  private set turn(value: number) {
    this._turn = value
  }
  
  public get private(): boolean {
    return this._private
  }
  private set private(value: boolean) {
    this._private = value
  }

  getPlayer(playerSocketID: string) {
    return this.players.find((player) => {
      return player.socketID === playerSocketID
    })
  }

  addPlayer(player: T) {
    if (this.isFull()) return
    this.players.push(player)
  }

  removePlayer(playerSocketID: string) {
    this.players = this.players.filter((player) => {
      return player.socketID !== playerSocketID
    })
  }

  isFull() {
    return this.players.length === this.maxPlayers
  }

  start() {
    if (!this.isFull()) return
    this.status = "playing"
    this.turn = Math.floor(Math.random() * this.players.length)

    console.log(`Game ${this.id} started`)
  }

  checkTurn(playerSocketID: string) {
    return this.players[this.turn].socketID === playerSocketID
  }

  nextTurn() {
    this.turn = (this.turn + 1) % this.players.length
  }

  reset() {
    this.status = "lobby"
    this.turn = 0
  }

  toJSON() {
    return {
      id: this.id,
      status: this.status,
      maxPlayers: this.maxPlayers,
      players: this.players,
      turn: this.turn,
      private: this.private,
    }
  }
}
