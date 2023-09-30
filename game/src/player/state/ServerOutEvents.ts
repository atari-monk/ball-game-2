export const ServerOutEvents = {
  PlayerState: 'playerState',
} as const

export type ServerOutEvent = keyof typeof ServerOutEvents
