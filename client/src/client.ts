import { io } from 'socket.io-client'

const socket = io('http://localhost:3001')

const canvas = document.getElementById('canvas') as HTMLCanvasElement | null
if (!canvas) {
  throw new Error('Canvas element not found.')
}

const ctx = canvas.getContext('2d')
if (!ctx) {
  throw new Error('Canvas 2d context not available.')
}

const players: Record<string, { x: number; y: number }> = {}

socket.on('playerInfo', (player: { id: string; x: number; y: number }) => {
  players[player.id] = { x: player.x, y: player.y }
})

socket.on('gameState', (gameState: any) => {
  // Update and render the game state on the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  for (const playerId in players) {
    const player = players[playerId]
    ctx.fillStyle = 'blue' // Change color or style as needed
    ctx.beginPath()
    ctx.arc(player.x, player.y, 10, 0, 2 * Math.PI)
    ctx.fill()
  }
})

document.addEventListener('keydown', (event: KeyboardEvent) => {
  // Send input to the server using socket.emit('input', input);
})
