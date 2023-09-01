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

interface Player {
  id: string
  x: number
  y: number
  radius: number
  mass: number
}

interface GameState {
  players: Record<string, Player>
  ball: {
    x: number
    y: number
    radius: number
    mass: number
  }
}

const players: Record<string, { x: number; y: number }> = {}

socket.on('connect', () => {
  console.log('Connected to server')
})

socket.on('playerInfo', (player: { id: string; x: number; y: number }) => {
  players[player.id] = { x: player.x, y: player.y }
})

socket.on('gameState', (gameState: GameState) => {
  const { players, ball } = gameState

  // Update and render the game state on the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  for (const playerId in players) {
    const player = players[playerId]
    ctx.fillStyle = 'blue' // Change color or style as needed
    ctx.beginPath()
    ctx.arc(player.x, player.y, player.radius, 0, 2 * Math.PI)
    ctx.fill()
  }

  ctx.fillStyle = 'red' // Change color or style for the ball
  ctx.beginPath()
  ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI)
  ctx.fill()
})

document.addEventListener('keydown', (event: KeyboardEvent) => {
  const input = {
    up: event.key === 'ArrowUp',
    down: event.key === 'ArrowDown',
    left: event.key === 'ArrowLeft',
    right: event.key === 'ArrowRight',
  }
  console.log('input: ', input)
  socket.emit('input', input)
})
