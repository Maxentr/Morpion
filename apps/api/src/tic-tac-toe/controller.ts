import { Socket } from "socket.io"
import { GameController } from "../class/GameController"
import { Player } from "../class/Player"
import { TicTacToe } from "../class/TicTacToe"
import { CreatePlayer } from "../common/validations/createPlayer"

export default class TicTacToeController extends GameController<TicTacToe> {
  private static instance: TicTacToeController

  private constructor() {
    super("TicTacToe")
  }

  static getInstance(): TicTacToeController {
    if (!TicTacToeController.instance) {
      TicTacToeController.instance = new TicTacToeController()
    }

    return TicTacToeController.instance
  }

  async create(socket: Socket, player: CreatePlayer) {
    const game = new TicTacToe(true)
    this.games.push(game)

    const newPlayer = new Player(player.name, socket.id, player.avatar)

    game.addPlayer(newPlayer)
    await socket.join(game.id)

    console.log(`Game created : ${game.id}`)

    socket.emit("joinGame", game)
  }

  async join(socket: Socket, gameId: string, player: CreatePlayer) {
    const game = this.getGame(gameId)
    if (!game || game.isFull()) return

    const newPlayer = new Player(player.name, socket.id, player.avatar)
    game.addPlayer(newPlayer)
    await socket.join(gameId)

    if (game.status === "lobby" && game.isFull()) game.status = "playing"

    socket.emit("joinGame", game)

    socket.to(gameId).emit("game", game)
  }

  async play(socket: Socket, gameId: string, x: number, y: number) {
    const game = this.getGame(gameId)
    if (!game) return
    if (!game.checkTurn(socket.id)) return

    game.play(socket.id, x, y)
    const winner = game.checkWin()

    if (winner === "draw") {
      socket.emit("draw", game)
      socket.to(gameId).emit("draw", game)
    } else if (winner) {
      game.status = "finished"
      game.getPlayer(winner.socketID)?.addPoint()

      socket.emit("winner", winner, game)
      socket.to(gameId).emit("winner", winner, game)
    } else {
      game.changeTurn()

      socket.emit("game", game)
      socket.to(gameId).emit("game", game)
    }
  }

  async leave(socket: Socket, gameId: string) {
    const game = this.getGame(gameId)
    if (!game) return

    game.removePlayer(socket.id)
    socket.leave(gameId)

    if (game.players.length === 0) this.removeGame(gameId)
  }
}
