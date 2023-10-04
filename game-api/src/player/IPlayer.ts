import { IPlayerAction } from './IPlayerAction'
import { IPlayerModel } from './IPlayerModel'
import { IPlayerMovement } from './IPlayerMovement'

export interface IPlayer extends IPlayerModel, IPlayerAction, IPlayerMovement {}
