import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import Game from './Game'
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

//
const game = new Game()

io.on('connection', (socket) => {
  // Handle player connection
  socket.on('join', () => {
    // Add player to the game
  })

  // Handle player input
  socket.on('input', (input) => {
    // Update player's state based on input
  })

  // Handle disconnection
  socket.on('disconnect', () => {
    // Remove player from the game
  })
})

// Game loop
setInterval(() => {
  game.update()

  // Emit updated game state to all connected clients
  io.emit('gameState', game)
}, 1000 / 30)
//

// Start the server
const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
