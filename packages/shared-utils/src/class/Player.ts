import { Avatar } from "../../types/avatar"

export class Player {
  name: string
  socketID: string
  avatar: Avatar
  score: number = 0
  wantReplay: boolean = false

  constructor(name: string, socketID: string, avatar: Avatar) {
    this.name = name
    this.socketID = socketID
    this.avatar = avatar
  }

  addPoint(): void {
    this.score += 1
  }

  toggleReplay(): void {
    this.wantReplay = !this.wantReplay
  }

  resetReplay(): void {
    this.wantReplay = false
  }
}
