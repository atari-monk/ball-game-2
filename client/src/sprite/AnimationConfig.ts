export interface AnimationConfig {
  imagePath: string
  frameWidth: number
  frameHeight: number
  frameDuration: number
  frameCount: number
  animationType: AnimationType
}

export enum AnimationType {
  Cyclic,
  Sequential,
}
