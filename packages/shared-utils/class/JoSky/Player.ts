import { IPlayer, Player } from "class/Player"
import { Avatar } from "../../types/avatar"
import { JoSkyCard } from "class/JoSky/Card"

//  Each player has 12 cards. 4 columns, 3 rows.
const COLUMN_COUNT = 4
const ROW_COUNT = 3
const CARD_PER_PLAYER_COUNT = COLUMN_COUNT * ROW_COUNT

export type PlayerToJSON = Pick<
  IPlayer,
  "name" | "socketID" | "avatar" | "score" | "wantReplay"
>

interface IJoSkyPlayer extends IPlayer {}
export class JoSkyPlayer extends Player implements IJoSkyPlayer {
  private _cards: JoSkyCard[][] = []

  constructor(name: string, socketID: string, avatar: Avatar) {
    super(name, socketID, avatar)
  }

  public get cards() {
    return this._cards
  }

  private set cards(value: JoSkyCard[][]) {
    this._cards = value
  }

  public setCards(cardsValue: number[]) {
    this.cards = []

    for (let i = 0; i < COLUMN_COUNT; i++) {
      this.cards.push([])
    }

    for (let i = 0; i < CARD_PER_PLAYER_COUNT; i++) {
      this.cards[i % COLUMN_COUNT].push(new JoSkyCard(cardsValue[i]))
    }
  }

  public turnCard(column: number, row: number) {
    this.cards[column][row].turnVisible()
  }

  public replaceCard(column: number, row: number, value: number) {
    this.cards[column][row] = new JoSkyCard(value)
    this.cards[column][row].turnVisible()
  }

  public hasTurnedTwoCards() {
    let count = 0

    this.cards.forEach((row) => {
      row.forEach((card) => {
        if (card.isVisible) {
          count++
        }
      })
    })

    return count === 2
  }

  public hasTurnedAllCards() {
    let count = 0

    this.cards.forEach((row) => {
      row.forEach((card) => {
        if (card.isVisible) {
          count++
        }
      })
    })

    return count === CARD_PER_PLAYER_COUNT
  }

  public currentCardScore() {
    let currentScore = 0

    this.cards.forEach((row) => {
      row.forEach((card) => {
        if (card.isVisible) {
          currentScore += card.value
        }
      })
    })

    return currentScore
  }

  public finalRoundScore() {
    let finalScore = 0

    this.cards.forEach((row) => {
      row.forEach((card) => {
        finalScore += card.value
      })
    })

    return finalScore
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      cards: this.cards.map((row) => row.map((card) => card.toJSON())),
    }
  }
}
