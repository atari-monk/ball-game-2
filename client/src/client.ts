import './css/styles.css'
import { io } from 'socket.io-client'
import { FieldDto, IGateDtos, MapDto, MatchDto, MessageDto, MsgFlag } from 'api'
import config from './config'

const selectedHost: string = process.env.HOST || 'azure'
const socket = io(config[selectedHost])

const canvas = document.getElementById('canvas') as HTMLCanvasElement | null
if (!canvas) {
  throw new Error('Canvas element not found')
}

const ctx = canvas.getContext('2d')
if (!ctx) {
  throw new Error('Canvas 2d context not available')
}

const textArea = document.getElementById('log') as HTMLTextAreaElement | null
if (!textArea) {
  throw new Error('log Text area not available')
}

let logFilterOption = 'Text'
const logFilter = document.getElementById('log-filter') as HTMLSelectElement
if (!logFilter) {
  throw new Error('log Filter not available')
}
logFilter.value = 'Text'
logFilter.addEventListener('change', function () {
  logFilterOption = logFilter.value
})

function logMessage(message: MessageDto) {
  if (logFilterOption !== 'All' && logFilterOption !== MsgFlag[message.flag])
    return
  const senderText = message.sender ? `${message.sender}:` : ''
  const log = `${senderText}${message.text}`

  if (textArea) {
    textArea.value += log + '\n'
    textArea.scrollTop = textArea.scrollHeight
  }
}

function clearTextArea() {
  if (textArea) {
    textArea.value = '' // Set the value to an empty string
  }
}

socket.on('connect', () => {
  const yourPlayerId = localStorage.getItem('yourPlayerId')
  socket.emit('setPlayerId', yourPlayerId)
})

socket.on('yourPlayerId', (id: string) => {
  localStorage.setItem('yourPlayerId', id)
})

socket.on('ping', () => {
  socket.emit('pong')
})

let gates: IGateDtos
let field: FieldDto
socket.on('map', (dto: MapDto) => {
  gates = dto.gates
  field = dto.field

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawField()
  drawGates()
})

socket.on('log', (dto: MessageDto) => {
  logMessage(dto)
})

socket.on('log-reset', () => {
  clearTextArea()
})

socket.on('update', (dto: MatchDto) => {
  const { players, ball } = dto

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawField()
  drawGates()

  for (const playerId in players) {
    const player = players[playerId]
    ctx.fillStyle = player.team?.color ?? 'blue' // Change color or style as needed
    ctx.strokeStyle = 'yellow' // Change color or style as needed
    ctx.lineWidth = 2 // Set the line width as needed
    ctx.beginPath()
    ctx.arc(player.x, player.y, player.radius, 0, 2 * Math.PI)
    ctx.fill()

    // Draw direction vector line
    ctx.beginPath()
    ctx.moveTo(player.x, player.y)
    const directionX = player.x + player.radius * Math.cos(player.direction)
    const directionY = player.y + player.radius * Math.sin(player.direction)
    ctx.lineTo(directionX, directionY)
    ctx.stroke()
  }

  ctx.fillStyle = 'yellow' // Change color or style for the ball
  ctx.beginPath()
  ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI)
  ctx.fill()
})

function drawField() {
  ctx!.fillStyle = 'green'
  ctx!.fillRect(0, 0, field.width, field.height)
}

function drawGates() {
  ctx!.fillStyle = gates.left.team.color
  ctx!.fillRect(gates.left.x, gates.left.y, gates.left.width, gates.left.height)
  ctx!.fillStyle = gates.right.team.color
  ctx!.fillRect(
    gates.right.x,
    gates.right.y,
    gates.right.width,
    gates.right.height
  )
}

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
