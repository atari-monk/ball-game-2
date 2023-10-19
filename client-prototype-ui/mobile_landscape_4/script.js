function getById(id) {
  const el = document.getElementById(id)
  if (!el) throw new Error(`No element wtith id ${id} !`)
  return el
}

function get2D(canvasId = 'canvas') {
  const canvas = getById(canvasId)
  const context = canvas.getContext('2d')
  return { canvas, context }
}

function setCanvasColor(canvas, context, color = 'green') {
  context.fillStyle = color
  context.fillRect(0, 0, canvas.width, canvas.height)
}

function unhide(el, hiddenClassName = 'hidden') {
  el.classList.toggle(hiddenClassName)
}

function setClick(el, fn) {
  el.addEventListener('click', fn)
}

function setTouch(el, fn) {
  el.addEventListener('touchstart', fn)
}

function logScreenInfo() {
  const screenWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth
  const screenHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight
  const aspectRatio = screenWidth / screenHeight
  console.log('screenWidth', screenWidth)
  console.log('screenHeight', screenHeight)
  console.log('aspectRatio', aspectRatio)
}

function detectMobileOrientation() {
  const screenWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth
  const screenHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight
  const aspectRatio = screenWidth / screenHeight
  const portraitThreshold = 0.75
  const landscapeThreshold = 1.5
  if (screenWidth > 1024) {
    return 'desktop'
  } else if (aspectRatio < portraitThreshold) {
    return 'portrait'
  } else if (aspectRatio > landscapeThreshold) {
    return 'landscape'
  } else {
    return 'unknown'
  }
}

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
