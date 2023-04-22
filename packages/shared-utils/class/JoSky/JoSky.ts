// A JoSky game has cards with value from -2 to 12. They are 5 -2 cards, 15 0 cards and 10 for each other value. The game can have between 2 to 8 players. Each player has 12 cards. At the start of the game, each player has 12 cards. The game has a faceoff cards pile and a discard pile. The game take one card from the faceoff cards pile and put it in the discard pile. All the cards in the discard pile are visible. Each player has to turn 2 cards before the game start. The first player to play is the one with the highest score. On a player turn, this one can choose between taking a card from the faceoff cards pile or take the last card from the discard pile. If the player take a card from the faceoff cards pile, he can choose to put it in the discard pile and turn one of his card or replace one of his card with it. If the player take the last card from the discard pile, he has to replace one of his card with it. The round end when a player has all of his cards visible and all other player play one more time. Each player add all his cards value to his score. The game end when a player reach 100 points. The winner is the one with the lowest score.

import { Game } from "class/Game"
import { JoSkyPlayer } from "class/JoSky/Player"
import { shuffle } from "functions/array"

// Create a JoSky game class
type RoundState = "waitingPlayersToTurnTwoCards" | "start" | "end"

type TurnState = "chooseAPile" | "faceoffPile" | "discardPile"

export class JoSky extends Game<JoSkyPlayer> {
  private _discardPile: number[] = []
  private _faceoffPile: number[] = []
  private _selectedCard: number | null = null
  private _roundState: RoundState = "waitingPlayersToTurnTwoCards"
  private _turnState: TurnState = "chooseAPile"
  private _firstPlayerToFinish: JoSkyPlayer | null = null

  constructor(privateGame: boolean = false) {
    super(2, privateGame)
    this.resetCardPiles()

    return this
  }

  private get discardPile() {
    return this._discardPile
  }
  private set discardPile(value: number[]) {
    this._discardPile = value
  }

  private get faceoffPile() {
    return this._faceoffPile
  }
  private set faceoffPile(value: number[]) {
    this._faceoffPile = value
  }

  private get roundState() {
    return this._roundState
  }

  private set roundState(value: RoundState) {
    this._roundState = value
  }

  private get turnState() {
    return this._turnState
  }

  private set turnState(value: TurnState) {
    this._turnState = value
  }

  private get selectedCard() {
    return this._selectedCard
  }

  private set selectedCard(value: number | null) {
    this._selectedCard = value
  }

  public get firstPlayerToFinish() {
    return this._firstPlayerToFinish
  }

  public set firstPlayerToFinish(value: JoSkyPlayer | null) {
    this._firstPlayerToFinish = value
  }

  public resetCardPiles() {
    const defaultCards = [
      ...Array(5).fill(-2),
      ...Array(15).fill(0),
      ...Array(10).fill(1),
      ...Array(10).fill(2),
      ...Array(10).fill(3),
      ...Array(10).fill(4),
      ...Array(10).fill(5),
      ...Array(10).fill(6),
      ...Array(10).fill(7),
      ...Array(10).fill(8),
      ...Array(10).fill(9),
      ...Array(10).fill(10),
      ...Array(10).fill(11),
      ...Array(10).fill(12),
    ]

    this.faceoffPile = shuffle(defaultCards)
    this.discardPile = []
  }

  public givePlayersCards() {
    this.players.forEach((player) => {
      player.setCards(this.faceoffPile.splice(0, 12))
    })
  }

  public checkIfAllPlayersTurnedTwoCards() {
    // Check for each player if he turned 2 cards or not
    const allPlayersTurnedTwoCards = this.players.every(
      (player) => player.hasTurnedTwoCards,
    )

    if (allPlayersTurnedTwoCards) this.roundState = "start"
  }

  public pickCardFromFaceoffPile() {
    this.selectedCard = this.faceoffPile.shift()!

    if (this.faceoffPile.length === 0) {
      this.resetCardPiles()
      this.discardPile.push(this.faceoffPile.shift()!)
    }

    return this.selectedCard
  }

  public pickCardFromDiscardPile() {
    this.selectedCard = this.discardPile.shift()!
  }

  public putCardInDiscardPile() {
    this.discardPile.push(this.selectedCard!)
  }

  public checkRoundEnd() {
    if (this.players[this.turn] !== this.firstPlayerToFinish) return

    this.players.forEach((player) => {
      player.score += player.finalRoundScore()
    })

    if (this.players.some((player) => player.score >= 100)) {
      this.endGame()
      return
    } else {
      this.roundState = "end"
    }
  }

  public endGame() {
    this.roundState = "end"
    this.status = "finished"
  }

  public reset() {
    this.resetCardPiles()

    // Give to each player 12 cards
    this.givePlayersCards()

    // Turn first card from faceoff pile to discard pile
    this.discardPile.push(this.faceoffPile.shift()!)

    this.roundState = "waitingPlayersToTurnTwoCards"
  }
}
