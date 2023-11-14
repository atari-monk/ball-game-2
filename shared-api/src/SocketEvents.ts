export const SocketEvents = {
  Ping: 'ping',
  Pong: 'pong',
  Connect: 'connect',
  SetPlayerId: 'setPlayerId',
  YourPlayerId: 'yourPlayerId',
  NewPlayer: 'newPlayer',
  Map: 'map',
  Team: 'team',
  Log: 'log',
  LogReset: 'log-reset',
  MatchUpdate: 'update',
  Input: 'input',
  Disconnect: 'disconnect',
  PlayerState: 'playerState',
  Point: 'point',
  Counter: 'counter',
  BallState: 'ballState',
  Keys: 'keys',
} as const

export type SocketEvent = keyof typeof SocketEvents
