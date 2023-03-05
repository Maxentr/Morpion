import { z } from "zod"

const playTicTacToe = z.object({
  gameID: z.string(),
  x: z.number().int().min(0).max(2),
  y: z.number().int().min(0).max(2),
})

export type PlayTicTacToe = z.infer<typeof playTicTacToe>

export default playTicTacToe
