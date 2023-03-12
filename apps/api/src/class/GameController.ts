import { Socket } from "socket.io"
import { CreatePlayer } from "shared-utils/src/validations/createPlayer"
import { Game, Player } from "shared-utils"

export class GameController<G extends Game, S extends Socket> {
  private _name: string
  private _games: G[]

  constructor(name: string) {
    this._name = name
    this._games = []

    return this
  }

  get name(): string {
    return this._name
  }

  get games(): G[] {
    return this._games
  }

  addGame(game: G): void {
    this._games.push(game)
  }

  removeGame(gameId: string): void {
    this._games = this._games.filter((game) => {
      return game.id !== gameId
    })
  }

  getGame(gameId: string): G | undefined {
    return this._games.find((game) => {
      return game.id === gameId
    })
  }

  getGameNotFull(): G | undefined {
    return this._games.find((game) => {
      return !game.isFull() && game.status === "lobby" && !game.private
    })
  }

  async onCreate(socket: S, player: CreatePlayer, game: G) {
    this.games.push(game)

    this.onJoin(socket, game.id, player)
  }

  async onGet(socket: S, gameId: string) {
    const game = this.getGame(gameId)
    if (game) socket.emit("game", game)
  }

  async onJoin(socket: S, gameId: string, player: CreatePlayer) {
    const game = this.getGame(gameId)
    if (!game || game.isFull()) return

    const newPlayer = new Player(player.name, socket.id, player.avatar)
    game.addPlayer(newPlayer)
    await socket.join(gameId)

    if (game.status === "lobby" && game.isFull()) game.start()

    socket.emit("joinGame", game)

    socket.to(gameId).emit("game", game)
  }

  async onWin(socket: S, game: G, winner: Player) {
    game.status = "finished"
    game.getPlayer(winner.socketID)?.addPoint()

    socket.emit("winner", game, winner)
    socket.to(game.id).emit("winner", game, winner)
  }

  async onDraw(socket: Socket, game: G) {
    game.status = "finished"
    socket.emit("draw", game)
    socket.to(game.id).emit("draw", game)
  }

  async onReplay(socket: S, gameId: string) {
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

  async onLeave(socket: S, gameId: string) {
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
