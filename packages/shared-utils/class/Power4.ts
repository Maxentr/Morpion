import { Game } from "./Game"
import { Player } from "./Player"

export class Power4 extends Game {
  board: string[][]

  constructor(privateGame: boolean = false) {
    super(2, privateGame)
    this.board = [
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
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

    // check columns
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 3; j++) {
        if (
          board[j][i] === symbol &&
          board[j + 1][i] === symbol &&
          board[j + 2][i] === symbol &&
          board[j + 3][i] === symbol
        ) {
          return player
        }
      }
    }

    // check rows
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 4; j++) {
        if (
          board[i][j] === symbol &&
          board[i][j + 1] === symbol &&
          board[i][j + 2] === symbol &&
          board[i][j + 3] === symbol
        ) {
          return player
        }
      }
    }

    // check diagonals

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 4; j++) {
        if (
          board[i][j] === symbol &&
          board[i + 1][j + 1] === symbol &&
          board[i + 2][j + 2] === symbol &&
          board[i + 3][j + 3] === symbol
        ) {
          return player
        }
      }
    }
    for (let i = 0; i < 3; i++) {
      for (let j = 3; j < 7; j++) {
        if (
          board[i][j] === symbol &&
          board[i + 1][j - 1] === symbol &&
          board[i + 2][j - 2] === symbol &&
          board[i + 3][j - 3] === symbol
        ) {
          return player
        }
      }
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
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
    ]
  }
}
