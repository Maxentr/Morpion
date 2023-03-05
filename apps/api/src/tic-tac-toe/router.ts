import { Socket } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import ticTacToeController from "./controller"
import createPlayer, { CreatePlayer } from "../common/validations/createPlayer"
import playTicTacToe, { PlayTicTacToe } from "./validations/play"
import joinGame, { JoinGame } from "../common/validations/joinGame"

const instance = ticTacToeController.getInstance()

const gamesRouter = (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
) => {
  socket.on("create", (player: CreatePlayer) => {
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
      if (game) instance.join(socket, game.id, player)
      else instance.create(socket, player)
    } catch (error) {
      console.error(`Error while creating a game : ${error}`)
    }
  })

  socket.on("join", (data: JoinGame) => {
    try {
      // Check if the player is valid
      const { gameID, player } = joinGame.parse(data)

      instance.join(socket, gameID, player)
    } catch (error) {
      console.error(`Error while joining a game : ${error}`)
    }
  })

  socket.on("play", (data: PlayTicTacToe) => {
    try {
      // Check if the player is valid
      const { gameID, x, y } = playTicTacToe.parse(data)

      instance.play(socket, gameID, x, y)
    } catch (error) {
      console.error(`Error while playing a game : ${error}`)
    }
  })
}

export default gamesRouter
