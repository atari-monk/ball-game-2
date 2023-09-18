import { ICanvasInfo } from './api/ICanvasInfo'

export class CanvasInfoProvider {
  getCanvasInfo(id: string): ICanvasInfo {
    const canvas = document.getElementById(id) as HTMLCanvasElement

    if (!canvas) {
      throw new Error('Canvas element not found')
    }

    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('Canvas 2d context not available')
    }

    return { canvas, ctx }
  }
}
