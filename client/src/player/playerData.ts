import { AnimationType, AnimationConfig } from "client-api"

const redSprite = './assets/red-player.png'
const blueSprite = './assets/blue-player.png'

const idle = {
  imagePath: redSprite,
  frameCount: 20,
  frameDuration: 100,
  frameWidth: 80,
  frameHeight: 160,
  animationType: AnimationType.Sequential,
}

const walk = {
  imagePath: redSprite,
  frameCount: 17,
  frameDuration: 100,
  frameWidth: 80,
  frameHeight: 160,
  animationType: AnimationType.Sequential,
}

export const redAnimations: AnimationConfig[] = [idle, walk]

export const blueAnimations: AnimationConfig[] = [
  { ...idle, imagePath: blueSprite },
  { ...walk, imagePath: blueSprite },
]
