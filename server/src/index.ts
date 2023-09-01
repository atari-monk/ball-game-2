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
  console.log(`Player ${player.id} connected.`)

  // Emit player information to the connected client
  socket.emit('playerInfo', player)

  // Handle player input
  socket.on('input', (input) => {
    // Update player's state based on input
    const player = game.players.find((p) => p.id === socket.id)
    if (player) {
      if (input.up) player.speed = Math.min(player.speed + .5, player.maxSpeed)
      if (input.down) player.speed = Math.max(player.speed - .5, 0)
      if (input.left) player.direction -= 0.2
      if (input.right) player.direction += 0.2
      console.log('player', player)
    }
  })

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`Player ${player.id} disconnected.`)
    // Remove player from the game
    game.players = game.players.filter((p) => p.id !== socket.id)
  })
})

// Game loop
setInterval(() => {
  game.update()

  // Emit updated game state to all connected clients
  io.emit('gameState', game)
}, 1000 / 30)

// Start the server
const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
