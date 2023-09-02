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
  direction: number
  speed: number
  maxSpeed: number
  team: Team | null
}

interface Team {
  name: string
  color: string
  playerIds: string[]
}

interface Gate {
  x: number
  y: number
  width: number
  height: number
}

interface GameState {
  players: Record<string, Player>
  ball: {
    x: number
    y: number
    radius: number
    mass: number
  }
  field: {
    width: number
    height: number
  }
  gates: {
    left: Gate
    right: Gate
  }
}

const players: Record<string, { x: number; y: number }> = {}

socket.on('connect', () => {
  console.log('Connected to server')
})

socket.on('playerInfo', (player: { id: string; x: number; y: number }) => {
  console.log('Received playerInfo:', player)
  players[player.id] = { x: player.x, y: player.y }
})

socket.on('gameState', (gameState: GameState) => {
  //console.log('Received gameState:', gameState)
  const { players, ball, field, gates } = gameState

  // Update and render the game state on the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Draw the field as a rectangle
  ctx.fillStyle = 'green'
  ctx.fillRect(0, 0, field.width, field.height)

  // Draw the gates
  ctx.fillStyle = 'gray' // Set the gate color
  ctx.fillRect(gates.left.x, gates.left.y, gates.left.width, gates.left.height)
  ctx.fillRect(
    gates.right.x,
    gates.right.y,
    gates.right.width,
    gates.right.height
  )

  for (const playerId in players) {
    const player = players[playerId]
    ctx.fillStyle = player.team?.color ?? 'blue' // Change color or style as needed
    ctx.beginPath()
    ctx.arc(player.x, player.y, player.radius, 0, 2 * Math.PI)
    ctx.fill()
  }

  ctx.fillStyle = 'yellow' // Change color or style for the ball
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
  //console.log('input: ', input)
  socket.emit('input', input)
})
