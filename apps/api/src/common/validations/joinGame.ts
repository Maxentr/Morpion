import { z } from "zod"
import createPlayer from "./createPlayer"

const joinGame = z.object({
  gameID: z.string(),
  player: createPlayer,
})

export type JoinGame = z.infer<typeof joinGame>

export default joinGame
