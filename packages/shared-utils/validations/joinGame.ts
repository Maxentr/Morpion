import { z } from "zod"
import { createPlayer } from "./createPlayer"

export const joinGame = z.object({
  gameId: z.string(),
  player: createPlayer,
})

export type JoinGame = z.infer<typeof joinGame>
