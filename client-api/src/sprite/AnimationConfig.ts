import { AnimationType } from './AnimationType'

export interface AnimationConfig {
  imagePath: string
  frameWidth: number
  frameHeight: number
  frameDuration: number
  frameCount: number
  animationType: AnimationType
}
