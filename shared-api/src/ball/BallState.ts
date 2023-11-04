import { BallStateType } from './BallStateType'

export type BallState =
  | {
      type: BallStateType.Idle
    }
  | {
      type: BallStateType.Rotate
    }
