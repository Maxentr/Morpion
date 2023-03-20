import { Game, GameToJSON, IGame } from "./Game"
import { Player } from "./Player"

export interface TicTacToeToJSON extends GameToJSON {
  board: string[][]
}

interface ITicTacToe extends IGame {
  play(playerSocketID: string, x: number, y: number): void
  checkWin(): Player | "draw" | undefined
  toJSON(): TicTacToeToJSON
}

export class TicTacToe extends Game implements ITicTacToe {
  private _board: string[][] = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]

  constructor(privateGame: boolean = false) {
    super(2, privateGame)

    return this
  }

  private get board() {
    return this._board
  }
  private set board(value: string[][]) {
    this._board = value
  }

  private isSlotAvailable(x: number, y: number) {
    return this.board[x][y] === ""
  }

  play(playerSocketID: string, x: number, y: number) {
    const player = this.getPlayer(playerSocketID)

    if (!player || this.status !== "playing") return
    if (this.players[this.turn].socketID !== player.socketID) return

    if (this.isSlotAvailable(x, y))
      this.board[x][y] = this.turn === 0 ? "X" : "O"
  }

  checkWin() {
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

  override reset() {
    super.reset()
    this.board = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ]
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      board: this.board,
    }
  }
}
