import { Game, GameToJSON, IGame } from "./Game"
import { Player } from "./Player"

export interface ConnectFourToJSON extends GameToJSON {
  board: string[][]
}

interface IConnectFour extends IGame {
  play(playerSocketID: string, x: number): void
  checkWin(): Player | "draw" | undefined
  toJSON(): ConnectFourToJSON
}
export class ConnectFour extends Game implements IConnectFour {
  private _board: string[][] = [
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
  ]

  constructor(privateGame: boolean = false) {
    super(2, privateGame)
    return this
  }

  private get board(): string[][] {
    return this._board
  }

  private set board(board: string[][]) {
    this._board = board
  }

  private getSymbol() {
    return this.turn === 0 ? "X" : "O"
  }

  private getColY(x: number) {
    for (let y = 5; y > -1; y--) {
      if (this.board[y][x] === "") return y
    }
  }

  play(playerSocketID: string, x: number): void {
    const player = this.getPlayer(playerSocketID)

    if (!player || this.status !== "playing") return
    if (this.players[this.turn].socketID !== player.socketID) return

    const y = this.getColY(x)
    if (typeof y === "number") this.board[y][x] = this.getSymbol()
  }

  checkWin(): Player | "draw" | undefined {
    const board = this.board
    const player = this.players[this.turn]
    const symbol = this.getSymbol()

    // check rows
    for (let y = 0; y < 6; y++) {
      for (let x = 0; x < 4; x++) {
        const row = board[y].slice(x, x + 4)
        if (row.every((cell) => cell === symbol)) return player
      }
    }

    // check columns
    for (let x = 0; x < 7; x++) {
      for (let y = 0; y < 3; y++) {
        const col = board.slice(y, y + 4).map((row) => row[x])
        if (col.every((cell) => cell === symbol)) return player
      }
    }

    // check diagonals
    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 3; y++) {
        const diagonal = board.slice(y, y + 4).map((row, i) => row[x + i])
        if (diagonal.every((cell) => cell === symbol)) return player
      }
    }

    for (let x = 0; x < 4; x++) {
      for (let y = 5; y > 2; y--) {
        const diagonal = board.slice(y - 3, y + 1).map((row, i) => row[x + i])
        if (diagonal.every((cell) => cell === symbol)) return player
      }
    }

    // check if there are still empty spots
    for (let y = 0; y < 6; y++) {
      for (let x = 0; x < 7; x++) {
        if (this.board[y][x] !== "") return undefined
      }
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

  override toJSON() {
    return {
      ...super.toJSON(),
      board: this.board,
    }
  }
}
