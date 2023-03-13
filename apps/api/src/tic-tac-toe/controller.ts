import { Socket } from "socket.io"
import { GameController } from "../class/GameController"
import {
  CreatePlayer,
  GetClientEvents,
  Player,
  ServerGameEvents,
  TicTacToe,
} from "shared-utils"

export type TicTacToeSocket = Socket<
  GetClientEvents<"tic-tac-toe">,
  ServerGameEvents<TicTacToe>
>
export default class TicTacToeController extends GameController<
  TicTacToe,
  TicTacToeSocket
> {
  private static instance: TicTacToeController

  private constructor() {
    super("tic-tac-toe")
  }

  static getInstance(): TicTacToeController {
    if (!TicTacToeController.instance) {
      TicTacToeController.instance = new TicTacToeController()
    }

    return TicTacToeController.instance
  }

  async create(socket: Socket, player: CreatePlayer, isPrivate = true) {
    const game = new TicTacToe(isPrivate)
    this.onCreate(socket, player, game)
  }

  async play(socket: Socket, gameId: string, x: number, y: number) {
    const game = this.getGame(gameId)
    if (!game) return
    if (!game.checkTurn(socket.id)) return

    game.play(socket.id, x, y)
    const gameState = game.checkWin()

    if (gameState === "draw") this.onDraw(socket, game)
    else if (gameState instanceof Player) this.onWin(socket, game, gameState)
    else {
      game.nextTurn()

      socket.emit("game", game)
      socket.to(gameId).emit("game", game)
    }
  }
}
