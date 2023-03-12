import { z } from "zod"

export const playTicTacToe = z.object({
  gameId: z.string(),
  x: z.number().int().min(0).max(2),
  y: z.number().int().min(0).max(2),
})

export type PlayTicTacToe = z.infer<typeof playTicTacToe>
