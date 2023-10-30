import { StaticJoystick } from './StaticJoystick'
import './css/styles.css'
import {
  get2D,
  getById,
  logScreenInfo,
  setCanvasColor,
  detectMobileOrientation,
  setTouch,
  setClick,
  unhide,
} from 'dom-lib'

const { canvas, context } = get2D()
const logButton = getById('log_button')
const logboard = getById('message_board_container')
const joystickContainer: HTMLElement | null =
  document.querySelector('.joystick_static')

logScreenInfo()
setCanvasColor(canvas, context)
const toogleLogboard = () => {
  logboard.classList.toggle('hidden')
  console.log('toogleLogboard')
}
const mode = detectMobileOrientation()
console.log('mode:', mode)
if (mode === 'portrait') {
  setTouch(logButton, toogleLogboard)
} else if (mode === 'landscape') {
  setTouch(logButton, toogleLogboard)
} else if (mode === 'desktop' || mode === 'unknown') {
  setClick(logButton, toogleLogboard)
}
unhide(logButton)
StaticJoystick.createJoystic()
setFullscreenButton()

function enterFullscreen(canvas: HTMLElement) {
  if (!document.fullscreenEnabled) {
    console.error('Fullscreen mode is not supported in this browser.')
    return
  }

  if (canvas instanceof HTMLElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen().catch((error: Error) => {
        console.error('Error entering fullscreen mode:', error)
      })
      joystickContainer!.style.display = 'block'
    } else {
      console.error('Fullscreen mode is not supported on this element.')
    }
  } else {
    console.error('Invalid element provided.')
  }
}

function setFullscreenButton() {
  const div = document.getElementById('canvas_container') as HTMLElement
  const fullscreenButton = document.getElementById(
    'fullscreen_button'
  ) as HTMLButtonElement
  if (!fullscreenButton) return

  fullscreenButton.addEventListener('click', () => {
    enterFullscreen(div)
  })
  fullscreenButton.addEventListener('touchstart', () => {
    enterFullscreen(div)
  })
}
