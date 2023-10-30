import * as nipplejs from 'nipplejs'

export class StaticJoystick {
  private zone: HTMLElement
  private position: { left: string; top: string }
  private color: string
  private joystick: any
  private input: any = {
    up: false,
    down: false,
    left: false,
    right: false,
  }

  constructor(
    zone: HTMLElement,
    position: { left: string; top: string },
    color: string,
    private readonly socketOutManager: any
  ) {
    this.zone = zone
    this.position = position
    this.color = color
    this.joystick = null

    this.createJoystick()
  }

  private createJoystick() {
    if (this.joystick) {
      this.joystick.destroy()
    }

    this.joystick = nipplejs.create({
      zone: this.zone,
      mode: 'static',
      position: this.position,
      color: this.color,
      size: 100,
    })

    this.bindNipple()
  }

  private bindNipple() {
    this.joystick
      // .on('start end', (evt: any, data: any) => {})
      .on('end', (evt: any, data: any) => {
        this.resetInput()
        //this.socketOutManager.sendPlayerInput(this.input)
      })
      .on('move', (evt: any, data: any) => {
        this.setInput(data)
        //this.socketOutManager.sendPlayerInput(this.input)
      })
      .on(
        'dir:up plain:up dir:left plain:left dir:down ' +
          'plain:down dir:right plain:right',
        (evt: any, data: any) => {
          this.setInput(data)
          //this.socketOutManager.sendPlayerInput(this.input)
        }
      )
    // .on('pressure', (evt: any, data: any) => {
    //   console.log({
    //     pressure: data,
    //   })
    // })
  }

  private resetInput() {
    this.input.up = false
    this.input.down = false
    this.input.left = false
    this.input.right = false
  }

  private setInput(data: any) {
    if (!data || !data.direction) return
    this.input.up = data.direction.y === 'up'
    this.input.down = data.direction.y === 'down'
    this.input.left = data.direction.x === 'left'
    this.input.right = data.direction.x === 'right'
  }

  static createJoystic(): StaticJoystick | null {
    const staticZone = document.querySelector('.joystick_static') as HTMLElement
    if (!staticZone) throw new Error('No element with class joystick_static!')
    return new StaticJoystick(
      staticZone,
      { left: '50%', top: '60%' },
      'white',
      {}
    )
  }
}
