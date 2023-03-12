import { Game } from "./Game"
import { Player } from "./Player"

export class TicTacToe extends Game {
  board: string[][]

  constructor(privateGame: boolean = false) {
    super(2, privateGame)
    this.board = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ]

    return this
  }

  isAvailable(x: number, y: number): boolean {
    return this.board[x][y] === ""
  }

  play(playerSocketID: string, x: number, y: number): void {
    const player = this.getPlayer(playerSocketID)

    if (!player || this.status !== "playing") return
    if (this.players[this.turn].socketID !== player.socketID) return

    if (this.isAvailable(x, y)) this.board[x][y] = this.turn === 0 ? "X" : "O"
  }

  checkWin(): Player | "draw" | undefined {
    const board = this.board
    const player = this.players[this.turn]
    const symbol = this.turn === 0 ? "X" : "O"

    for (let i = 0; i < 3; i++) {
      // check rows
      if (
        board[i][0] === symbol &&
        board[i][1] === symbol &&
        board[i][2] === symbol
      ) {
        return player
      }
      // check columns
      else if (
        board[0][i] === symbol &&
        board[1][i] === symbol &&
        board[2][i] === symbol
      ) {
        return player
      }
    }

    // check diagonals
    if (
      board[0][0] === symbol &&
      board[1][1] === symbol &&
      board[2][2] === symbol
    ) {
      return player
    }
    if (
      board[0][2] === symbol &&
      board[1][1] === symbol &&
      board[2][0] === symbol
    ) {
      return player
    }

    // check draw
    if (board.every((row) => row.every((cell) => cell !== ""))) {
      return "draw"
    }

    return undefined
  }

  override reset(): void {
    super.reset()
    this.board = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ]
  }
}
