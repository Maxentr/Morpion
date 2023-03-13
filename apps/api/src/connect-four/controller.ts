import { Socket } from "socket.io"
import { GameController } from "../class/GameController"

import {
  CreatePlayer,
  ServerGameEvents,
  ConnectFour,
  GetClientEvents,
  Player,
} from "shared-utils"

type TicTacToeSocket = Socket<
  GetClientEvents<"connect-four">,
  ServerGameEvents<ConnectFour>
>

export default class ConnectFourController extends GameController<
  ConnectFour,
  TicTacToeSocket
> {
  private static instance: ConnectFourController

  private constructor() {
    super("connect-four")
  }

  static getInstance(): ConnectFourController {
    if (!ConnectFourController.instance) {
      ConnectFourController.instance = new ConnectFourController()
    }

    return ConnectFourController.instance
  }

  async create(socket: Socket, player: CreatePlayer, isPrivate = true) {
    const game = new ConnectFour(isPrivate)
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
