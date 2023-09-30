import { INameGenerator } from 'game-api'
import { PlayerGetters } from './PlayerGetters'

export class PlayerSetters extends PlayerGetters {
  set velocityX(vx: number) {
    this._model.velocityX = vx
  }

  set velocityY(vy: number) {
    this._model.velocityY = vy
  }

  set direction(d: number) {
    this._model.direction = d
  }

  set x(x: number) {
    this._model.x = x
  }

  set y(y: number) {
    this._model.y = y
  }

  constructor(id: string, nameGenerator: INameGenerator) {
    super(id, nameGenerator)
  }
}
