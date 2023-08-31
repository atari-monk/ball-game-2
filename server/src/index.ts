import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import Game from './Game'

const app = express()
const server = http.createServer(app)
const io = new Server(server)

// Serve static files (e.g., HTML, CSS, JS)
app.use(express.static(__dirname + '/public'))

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
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
