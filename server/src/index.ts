import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { Game } from './Game'
import cors from 'cors'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  },
})

app.use(
  cors({
    origin: 'http://127.0.0.1:3000',
  })
)

// Serve static files (e.g., HTML, CSS, JS)
//app.use(express.static(__dirname + '/public'))

const game = new Game()

io.on('connection', (socket) => {
  // Handle player connection
  const player = game.addPlayer(socket.id)
  //console.log(`Player ${player.id} connected.`)

  // Emit player information to the connected client
  //socket.emit('playerInfo', player)

  // Handle player input
  socket.on('input', (input) => {
    // Update player's state based on input
    const player = game.players.find((p) => p.id === socket.id)
    if (player) {
      if (input.up)
        player.speed = Math.min(player.speed + 0.05, player.maxSpeed)
      if (input.down) player.speed = Math.max(player.speed - 0.05, 0)
      if (input.left) player.direction -= 0.1
      if (input.right) player.direction += 0.1
      //console.log('player', player)
    }
  })

  // Handle disconnection
  socket.on('disconnect', () => {
    game.sendServerMessage(`${player.team?.name}'s ${player.name} runned away`)
    // Remove player from the game
    game.players = game.players.filter((p) => p.id !== socket.id)
  })
})

const frameRate = 30 // Frames per second (adjust as needed)
const frameInterval = 1000 / frameRate // Interval in milliseconds
let lastFrameTime = Date.now()

// Game loop
setInterval(() => {
  const currentTime = Date.now()
  const deltaTime = currentTime - lastFrameTime

  game.update(deltaTime)

  // Emit updated game state to all connected clients
  io.emit('gameState', game)

  lastFrameTime = currentTime
}, frameInterval)

// Start the server
const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
