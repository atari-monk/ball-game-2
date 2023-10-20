export function getById(id: string): HTMLElement {
  const el = document.getElementById(id)
  if (!el) throw new Error(`No element with id ${id}!`)
  return el
}

export function get2D(canvasId: string = 'canvas'): {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
} {
  const canvas = getById(canvasId) as HTMLCanvasElement
  const context = canvas.getContext('2d') as CanvasRenderingContext2D
  return { canvas, context }
}

export function setCanvasColor(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  color: string = 'green'
): void {
  context.fillStyle = color
  context.fillRect(0, 0, canvas.width, canvas.height)
}

export function unhide(
  el: HTMLElement,
  hiddenClassName: string = 'hidden'
): void {
  el.classList.toggle(hiddenClassName)
}

export function setClick(
  el: HTMLElement,
  fn: EventListenerOrEventListenerObject
): void {
  el.addEventListener('click', fn)
}

export function setTouch(
  el: HTMLElement,
  fn: EventListenerOrEventListenerObject
): void {
  el.addEventListener('touchstart', fn)
}

export function logScreenInfo(): void {
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

export function detectMobileOrientation(): string {
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

export function setTextContent(element: HTMLElement, text: string): void {
  element.textContent = text
}

export function setAttribute(
  element: HTMLElement,
  name: string,
  value: string
): void {
  element.setAttribute(name, value)
}
