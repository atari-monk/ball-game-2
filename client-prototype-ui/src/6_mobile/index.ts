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
