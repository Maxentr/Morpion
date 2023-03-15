import { Socket } from "socket.io"
import { CreatePlayer, Game, Player } from "shared-utils"

export abstract class GameController<G extends Game, S extends Socket> {
  readonly _name: string
  private _games: G[] = []

  constructor(name: string) {
    this._name = name

    return this
  }

  get name() {
    return this._name
  }

  get games() {
    return this._games
  }
  private set games(games: G[]) {
    this._games = games
  }

  addGame(game: G) {
    this.games.push(game)
  }

  removeGame(gameId: string) {
    this.games = this.games.filter((game) => {
      return game.id !== gameId
    })
  }

  getGame(gameId: string) {
    return this.games.find((game) => {
      return game.id === gameId
    })
  }

  private getGameByPlayerSocket(socketId: string) {
    return this.games.find((game) => {
      return game.players.find((player) => {
        return player.socketID === socketId
      })
    })
  }

  getGameNotFull() {
    return this.games.find((game) => {
      return !game.isFull() && game.status === "lobby" && !game.private
    })
  }

  async onCreate(socket: S, player: CreatePlayer, game: G) {
    this.games.push(game)

    this.onJoin(socket, game.id, player)
  }

  async onGet(socket: S, gameId: string) {
    const game = this.getGame(gameId)
    if (game) socket.emit("game", game.toJSON())
  }

  async onJoin(socket: S, gameId: string, player: CreatePlayer) {
    const game = this.getGame(gameId)
    if (!game || game.isFull()) return

    const newPlayer = new Player(player.name, socket.id, player.avatar)
    game.addPlayer(newPlayer)
    await socket.join(gameId)

    if (game.status === "lobby" && game.isFull()) game.start()

    socket.emit("joinGame", game.toJSON())

    socket.to(gameId).emit("game", game.toJSON())
  }

  async onWin(socket: S, game: G, winner: Player) {
    game.status = "finished"
    game.getPlayer(winner.socketID)?.addPoint()

    socket.emit("winner", game.toJSON(), winner.toJSON())
    socket.to(game.id).emit("winner", game.toJSON(), winner.toJSON())
  }

  async onDraw(socket: S, game: G) {
    game.status = "finished"
    socket.emit("draw", game.toJSON())
    socket.to(game.id).emit("draw", game.toJSON())
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
      socket.to(game.id).emit("game", game.toJSON())
    } else socket.to(game.id).emit("replay", game.toJSON())
  }

  async onLeave(socket: S) {
    const game = this.getGameByPlayerSocket(socket.id)
    if (!game) return

    game.removePlayer(socket.id)
    game.status = "stopped"
    await socket.leave(game.id)

    if (game.players.length === 0) {
      this.removeGame(game.id)
    } else {
      socket.to(game.id).emit("playerLeave", game.toJSON())
    }
  }
}
