export const GAME_NAMES = {
  "tic-tac-toe": "tic-tac-toe",
  "connect-four": "connect-four",
} as const

export type GameNames = keyof typeof GAME_NAMES

export const SOCKET_NAMESPACES = {
  ...GAME_NAMES,
} as const
export type SocketNamespaces = keyof typeof SOCKET_NAMESPACES
