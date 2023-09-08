import { io } from 'socket.io-client'

import './css/styles.css'
import { IMessage } from './IMessage'
import { IGameState } from './IGameState'
import { FieldDto, MapDto, MatchDto } from 'api'

const localhost = 'http://localhost:3001'
const host = 'atari-monk-ball-game-2-server.azurewebsites.net'
const socket = io(localhost)

const canvas = document.getElementById('canvas') as HTMLCanvasElement | null
if (!canvas) {
  throw new Error('Canvas element not found.')
}

const ctx = canvas.getContext('2d')
if (!ctx) {
  throw new Error('Canvas 2d context not available.')
}

const logTextarea = document.getElementById('log') as HTMLTextAreaElement | null
if (!logTextarea) {
  throw new Error('log Text area not available.')
}

const printedMessages: Set<string> = new Set<string>()

function addMessageToLog(message: IMessage) {
  //${message.sender}:
  const messageText = message.text
  if (logTextarea && !printedMessages.has(messageText)) {
    logTextarea.value += messageText + '\n'
    logTextarea.scrollTop = logTextarea.scrollHeight

    // Add the message text to the set of printed messages
    printedMessages.add(messageText)
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

let field: FieldDto
socket.on('map', (dto: MapDto) => {
  field = dto.field
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawField()
})

socket.on('update', (dto: MatchDto) => {
  const { players, ball } = dto //,field, gates } = dto

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawField()
  // Update and render the game state on the canvas
  //ctx.clearRect(0, 0, canvas.width, canvas.height)
  /*
  // Draw the field as a rectangle
  

  // Draw the gates
  ctx.fillStyle = gates.left.team.color // Set the gate color
  ctx.fillRect(gates.left.x, gates.left.y, gates.left.width, gates.left.height)
  ctx.fillStyle = gates.right.team.color
  ctx.fillRect(
    gates.right.x,
    gates.right.y,
    gates.right.width,
    gates.right.height
  )
*/
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

  //updateMessageBoard(dto.messages)
})

function drawField() {
  ctx!.fillStyle = 'green'
  ctx!.fillRect(0, 0, field.width, field.height)
}

function updateMessageBoard(messages: IMessage[]) {
  messages.forEach((message) => {
    addMessageToLog(message)
  })
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
