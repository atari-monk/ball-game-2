import './css/styles.css'
import { GameClient } from './GameClient'
import './../assets/red-player.png'
import './../assets/blue-player.png'
import { CssManager } from './cssbycode/CssManager'

const cssManager = new CssManager()
cssManager.scaledCanvas()
new GameClient()
