export class CssManager {
  unscaledCanvas() {
    this.setStyles('canvas_container', {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'black',
    })

    this.setStyles('canvas', {
      maxWidth: '100%',
      maxHeight: '100%',
      width: 'auto',
      height: 'auto',
      display: 'block',
      boxSizing: 'border-box',
    })
  }

  private setStyles(
    elementId: string,
    styles: { [key: string]: string }
  ): void {
    const element = document.getElementById(elementId)
    if (element) {
      Object.assign(element.style, styles)
    }
  }

  scaledCanvas() {
    this.setStyles('canvas_container', {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
    })

    this.setStyles('canvas', {
      width: '100%',
      height: '100%',
      display: 'block',
    })
  }
}
