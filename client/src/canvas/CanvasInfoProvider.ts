import { DOMUtils } from './../utils/DOMUtils'
import { ICanvasInfo } from 'client-api'

export class CanvasInfoProvider {
  getCanvasInfo(id: string): ICanvasInfo {
    const canvas = DOMUtils.getElementByIdOrThrow<HTMLCanvasElement>(
      id,
      'Canvas element not found'
    )
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('Canvas 2d context not available')
    }

    return { canvas, ctx }
  }
}
