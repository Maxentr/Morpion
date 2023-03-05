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
    const game = new TicTacToe()
    this.games.push(game)

    const newPlayer = new Player(player.name, socket.id, player.avatar)

    game.addPlayer(newPlayer)
    await socket.join(game.id)

    // Send the game to the player who created it

    socket.emit("game", game)
  }

  async join(socket: Socket, gameID: string, player: CreatePlayer) {
    const game = this.getGame(gameID)
    if (!game || game.isFull()) return

    const newPlayer = new Player(player.name, socket.id, player.avatar)
    game.addPlayer(newPlayer)
    await socket.join(gameID)

    if (game.status === "lobby" && game.isFull()) game.status = "playing"

    socket.emit("game", game)

    socket.to(gameID).emit("game", game)
  }

  async play(socket: Socket, gameID: string, x: number, y: number) {
    const game = this.getGame(gameID)
    if (!game) return

    game.play(socket.id, x, y)
    const winner = game.checkWin()

    if (winner) {
      game.status = "finished"
      game.getPlayer(winner.socketID)?.addPoint()

      socket.emit("winner", winner, game)
      socket.to(gameID).emit("winner", winner, game)
    } else {
      game.changeTurn()
      
      socket.emit("game", game)
      socket.to(gameID).emit("game", game)
    }
  }

  async leave(socket: Socket, gameID: string) {
    const game = this.getGame(gameID)
    if (!game) return

    game.removePlayer(socket.id)
    socket.leave(gameID)

    if (game.players.length === 0) this.removeGame(gameID)
  }
}
