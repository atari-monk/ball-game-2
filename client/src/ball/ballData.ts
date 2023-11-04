import { AnimationType, AnimationConfig } from 'client-api'

const ballSprite = './assets/ball.png'

const idle = {
  imagePath: ballSprite,
  frameCount: 20,
  frameDuration: 100,
  frameWidth: 80,
  frameHeight: 40,
  animationType: AnimationType.Sequential,
}

const rotate = {
  imagePath: ballSprite,
  frameCount: 20,
  frameDuration: 100,
  frameWidth: 80,
  frameHeight: 40,
  animationType: AnimationType.Sequential,
}

export const ballAnimations: AnimationConfig[] = [idle, rotate]
