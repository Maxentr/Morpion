import { Avatar } from "../types/avatar"

export type PlayerToJSON = Pick<
  IPlayer,
  "name" | "socketID" | "avatar" | "score" | "wantReplay"
>

interface IPlayer {
  readonly name: string
  readonly socketID: string
  readonly avatar: Avatar
  score: number
  wantReplay: boolean

  addPoint(): void
  toggleReplay(): void
  resetReplay(): void
  toJSON(): PlayerToJSON
}
export class Player implements IPlayer {
  readonly _name!: string
  readonly _socketID!: string
  readonly _avatar!: Avatar
  private _score: number = 0
  private _wantReplay: boolean = false

  constructor(name: string, socketID: string, avatar: Avatar) {
    this._name = name
    this._socketID = socketID
    this._avatar = avatar
  }

  public get name() {
    return this._name
  }

  public get socketID() {
    return this._socketID
  }

  public get avatar() {
    return this._avatar
  }

  public get score() {
    return this._score
  }
  private set score(value: number) {
    this._score = value
  }

  public get wantReplay() {
    return this._wantReplay
  }
  private set wantReplay(value: boolean) {
    this._wantReplay = value
  }

  addPoint() {
    this.score += 1
  }

  toggleReplay() {
    this.wantReplay = !this._wantReplay
  }

  resetReplay() {
    this.wantReplay = false
  }

  toJSON() {
    return {
      name: this.name,
      socketID: this.socketID,
      avatar: this.avatar,
      score: this.score,
      wantReplay: this.wantReplay,
    }
  }
}
