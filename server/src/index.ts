import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { Game } from './game/Game'
import cors from 'cors'
import { GameState } from './game/GameState'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  },
})

app.use(cors())

const game = new Game()

io.on('connection', (socket) => {
  if (game.CurrentState !== GameState.MatchMaking) {
    game.sendServerMessage('Game in progress, try later')
    return
  }
  const player = game.addPlayer(socket.id)

  socket.on('input', (input) => {
    if (game.CurrentState !== GameState.Progress) {
      return
    }
    const player = game.players.find((p) => p.id === socket.id)
    if (player) {
      if (input.up)
        player.speed = Math.min(player.speed + 0.05, player.maxSpeed)
      if (input.down) player.speed = Math.max(player.speed - 0.05, 0)
      if (input.left) player.direction -= 0.1
      if (input.right) player.direction += 0.1
    }
  })

  socket.on('disconnect', () => {
    game.sendServerMessage(`${player.team?.name}'s ${player.name} runned away`)
    game.players = game.players.filter((p) => p.id !== socket.id)
  })

  io.emit('gameState', game)
})

const frameRate = 30
const frameInterval = 1000 / frameRate
let lastFrameTime = Date.now()

setInterval(() => {
  const currentTime = Date.now()
  const deltaTime = currentTime - lastFrameTime

  game.update(deltaTime)

  if (game.CurrentState === GameState.Progress) {
    io.emit('gameState', game)
  }

  lastFrameTime = currentTime
}, frameInterval)

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
