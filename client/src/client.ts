import './css/styles.css'
import './../assets/red-player.png'
import './../assets/blue-player.png'
import './../assets/ball.png'
import './../assets/grass.png'
import { CssManager } from './cssbycode/CssManager'
import { GameClient } from './GameClient'

const cssManager = new CssManager()
cssManager.unscaledCanvas()
const client = new GameClient()
client.initializeGame()