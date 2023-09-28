export const OutEvents = {
  Input: 'input',
  SetPlayerId: 'setPlayerId',
  Pong: 'pong',
} as const

export type SocketOutEvent = keyof typeof OutEvents
