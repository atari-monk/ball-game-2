import { PlayerStateType } from './PlayerStateType'

export type PlayerState =
  | {
      type: PlayerStateType.Idle
    }
  | {
      type: PlayerStateType.Walk
    }
  | {
      type: PlayerStateType.Run
    }
