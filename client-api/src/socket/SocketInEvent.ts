export const InEvents = {
  Ping: 'ping',
  Connect: 'connect',
  YourPlayerId: 'yourPlayerId',
  NewPlayer: 'newPlayer',
  Map: 'map',
  Team: 'team',
  Log: 'log',
  LogReset: 'log-reset',
  MatchUpdate: 'update',
} as const

export type SocketInEvent = keyof typeof InEvents
