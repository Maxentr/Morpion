import { z } from "zod"

export const playConnectFour = z.object({
  gameId: z.string(),
  x: z.number().int().min(0).max(6),
})

export type PlayConnectFour = z.infer<typeof playConnectFour>
