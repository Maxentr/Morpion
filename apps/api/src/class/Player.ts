import { Avatar } from "shared-types"

export class Player {
  private _name: string
  private _socketID: string
  private _avatar: Avatar
  private _score: number

  constructor(name: string, socketID: string, avatar: Avatar) {
    this._name = name
    this._socketID = socketID
    this._avatar = avatar
    this._score = 0
  }

  get name(): string {
    return this._name
  }

  get socketID(): string {
    return this._socketID
  }

  get avatar(): Avatar {
    return this._avatar
  }

  get score(): number {
    return this._score
  }

  set score(score: number) {
    this._score = score
  }

  addPoint(): void {
    this._score += 1
  }
}
