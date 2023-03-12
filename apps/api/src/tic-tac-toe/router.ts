import { Socket } from "socket.io"
import ticTacToeController, { TicTacToeSocket } from "./controller"
import {
  createPlayer,
  CreatePlayer,
  joinGame,
  JoinGame,
  playTicTacToe,
  PlayTicTacToe,
} from "shared-utils"

const instance = ticTacToeController.getInstance()

const gamesRouter = (socket: TicTacToeSocket) => {
  socket.on("createPrivate", (player: CreatePlayer) => {
    try {
      // Check if the player is valid
      createPlayer.parse(player)

      instance.create(socket, player)
    } catch (error) {
      console.error(`Error while creating a game : ${error}`)
    }
  })

  socket.on("find", (player: CreatePlayer) => {
    try {
      // Check if the player is valid
      createPlayer.parse(player)

      const game = instance.getGameNotFull()
      if (game) instance.onJoin(socket, game.id, player)
      else instance.create(socket, player, false)
    } catch (error) {
      console.error(`Error while finding a game : ${error}`)
    }
  })

  socket.on("join", (data: JoinGame) => {
    try {
      // Check if the data is valid
      const { gameId, player } = joinGame.parse(data)

      instance.onJoin(socket, gameId, player)
    } catch (error) {
      console.error(`Error while joining a game : ${error}`)
    }
  })

  socket.on("get", (gameId: string) => {
    try {
      instance.onGet(socket, gameId)
    } catch (error) {
      console.error(`Error while getting a game : ${error}`)
    }
  })

  socket.on("play", (data: PlayTicTacToe) => {
    try {
      // Check if the player is valid
      const { gameId, x, y } = playTicTacToe.parse(data)

      instance.play(socket, gameId, x, y)
    } catch (error) {
      console.error(`Error while playing a game : ${error}`)
    }
  })

  socket.on("replay", (gameId: string) => {
    try {
      instance.onReplay(socket, gameId)
    } catch (error) {
      console.error(`Error while replaying a game : ${error}`)
    }
  })

  socket.on("leave", (gameId: string) => {
    try {
      instance.onLeave(socket, gameId)
    } catch (error) {
      console.error(`Error while leaving a game : ${error}`)
    }
  })
}

export default gamesRouter
