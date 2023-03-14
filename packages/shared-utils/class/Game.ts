import { Player } from "./Player"

export type GAME_STATUS = "lobby" | "playing" | "finished"

export abstract class Game<T extends Player = Player> {
  id: string
  status: GAME_STATUS
  maxPlayers: number
  players: T[]
  turn: number
  private: boolean

  constructor(maxPlayers: number, privateGame: boolean) {
    // generate a random game id with 8 characters (a-z, A-Z, 0-9)
    this.id = Math.random().toString(36).substring(2, 10)
    this.maxPlayers = maxPlayers
    this.status = "lobby"
    this.players = []
    this.turn = 0
    this.private = privateGame

    return this
  }

  getPlayer(playerSocketID: string): T | undefined {
    return this.players.find((player) => {
      return player.socketID === playerSocketID
    })
  }

  addPlayer(player: T): void {
    if (this.isFull()) return
    this.players.push(player)
  }

  removePlayer(playerSocketID: string): void {
    this.players = this.players.filter((player) => {
      return player.socketID !== playerSocketID
    })
  }

  isFull(): boolean {
    return this.players.length === this.maxPlayers
  }

  start(): void {
    if (!this.isFull()) return
    this.status = "playing"
    this.turn = Math.floor(Math.random() * this.players.length)

    console.log(`Game ${this.id} started`)
  }

  checkTurn(playerSocketID: string): boolean {
    return this.players[this.turn].socketID === playerSocketID
  }

  nextTurn(): void {
    this.turn = (this.turn + 1) % this.players.length
  }

  reset(): void {
    this.status = "lobby"
    this.turn = 0
  }
}
