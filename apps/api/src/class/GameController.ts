import { Socket } from "socket.io"
import { CreatePlayer } from "shared-utils/src/validations/createPlayer"
import {
  ClientToServerTicTacToeEvents,
  Game,
  Player,
  ServerToClientEvents,
} from "shared-utils"
import { z } from "zod"

// T extends Game make socket.to(game.id).emit('game', game) bug on game type
// type CustomSocket<T extends Game> = Socket<
type CustomSocket = Socket<
  ClientToServerTicTacToeEvents,
  ServerToClientEvents<Game>
>
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

  async onCreate(socket: Socket, player: CreatePlayer, game: T) {
    this.games.push(game)

    this.onJoin(socket, game.id, player)
  }

  async onGet(socket: Socket, gameId: string) {
    const game = this.getGame(gameId)
    if (game) socket.emit("game", game)
  }

  async onJoin(socket: Socket, gameId: string, player: CreatePlayer) {
    const game = this.getGame(gameId)
    if (!game || game.isFull()) return

    const newPlayer = new Player(player.name, socket.id, player.avatar)
    game.addPlayer(newPlayer)
    await socket.join(gameId)

    if (game.status === "lobby" && game.isFull()) game.start()

    socket.emit("joinGame", game)

    socket.to(gameId).emit("game", game)
  }

  async onWin(socket: CustomSocket, game: T, winner: Player) {
    game.status = "finished"
    game.getPlayer(winner.socketID)?.addPoint()

    socket.emit("winner", game, winner)
    socket.to(game.id).emit("winner", game, winner)
  }

  async onDraw(socket: Socket, game: T) {
    game.status = "finished"
    socket.emit("draw", game)
    socket.to(game.id).emit("draw", game)
  }

  async onReplay(socket: CustomSocket, gameId: string) {
    const game = this.getGame(gameId)
    if (!game) return

    game.getPlayer(socket.id)?.toggleReplay()

    // restart game if all players want replay
    if (game.players.every((player) => player.wantReplay)) {
      game.reset()
      game.start()

      socket.emit("game", game)
      socket.to(game.id).emit("game", game)
    } else socket.to(game.id).emit("replay", game)
  }

  async onLeave(socket: CustomSocket, gameId: string) {
    const game = this.getGame(gameId)
    if (!game) return

    game.removePlayer(socket.id)
    await socket.leave(game.id)

    socket.emit("leaveGame", game)

    if (game.players.length === 0) {
      this.removeGame(game.id)
    } else {
      socket.to(game.id).emit("playerLeave", game)
    }
  }
}
