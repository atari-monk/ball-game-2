import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { Game } from './game/Game'
import cors from 'cors'
import { GameState } from './game/GameState'
import initializeSocketIO from './socket'

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

initializeSocketIO(io, game)

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
