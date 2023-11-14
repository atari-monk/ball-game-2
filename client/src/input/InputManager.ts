import { ISocketOutManager } from 'client-api'
import { InputHandler } from './InputHandler'
import { MobileInputHandler } from './MobileInputHandler'
import { StaticJoystick } from './StaticJoystick'
import { IInputConfig } from './IInputConfig'
import { KeyInputHandler } from './KeyInputHandler'

export class InputManager {
  private _arrowsInput: InputHandler | null = null
  private _keysInput: KeyInputHandler | null = null
  private _joysticFactory: StaticJoystick | null = null
  private _myMobileInput: MobileInputHandler | null = null
  private _config: IInputConfig

  get mobileInputHandler() {
    return this._myMobileInput
  }

  get config() {
    return this._config
  }

  constructor(
    private readonly socketOutManager: ISocketOutManager,
    config: IInputConfig = {
      isArrowsOn: true,
      isKeysOn: true,
      isJoystickOn: true,
      isMyMobileInputOn: false,
    }
  ) {
    this._config = config
    if (this._config.isArrowsOn)
      this._arrowsInput = new InputHandler(this.socketOutManager)
    if (this._config.isKeysOn)
      this._keysInput = new KeyInputHandler(this.socketOutManager)
    if (this._config.isJoystickOn) this._joysticFactory = this.createJoystic()
    if (this._config.isMyMobileInputOn)
      this._myMobileInput = new MobileInputHandler(this.socketOutManager)
  }

  private createJoystic(): StaticJoystick | null {
    const staticZone = document.querySelector('.joystick_static') as HTMLElement
    if (!staticZone) throw new Error('No element with class joystick_static!')
    return new StaticJoystick(
      staticZone,
      { left: '50%', top: '80%' },
      'white',
      this.socketOutManager
    )
  }
}
