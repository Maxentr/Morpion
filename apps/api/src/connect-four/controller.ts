import { Socket } from "socket.io"
import { GameController } from "../class/GameController"
import {
  CreatePlayer,
  GetClientEvents,
  Player,
  ServerGameEvents,
  ConnectFour,
  ConnectFourToJSON,
} from "shared-utils"

export type ConnectFourSocket = Socket<
  GetClientEvents<"connect-four">,
  ServerGameEvents<ConnectFourToJSON>
>
export default class ConnectFourController extends GameController<
  ConnectFour,
  ConnectFourSocket
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

  async create(
    socket: ConnectFourSocket,
    player: CreatePlayer,
    isPrivate = true,
  ) {
    const game = new ConnectFour(isPrivate)
    this.onCreate(socket, player, game)
  }

  async play(socket: ConnectFourSocket, gameId: string, x: number) {
    const game = this.getGame(gameId)
    if (!game) return
    if (!game.checkTurn(socket.id)) return

    game.play(socket.id, x)
    const gameState = game.checkWin()

    if (gameState === "draw") this.onDraw(socket, game)
    else if (gameState instanceof Player) this.onWin(socket, game, gameState)
    else {
      game.nextTurn()

      socket.emit("game", game.toJSON())
      socket.to(gameId).emit("game", game.toJSON())
    }
  }
}
