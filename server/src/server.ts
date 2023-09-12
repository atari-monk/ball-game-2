import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import initializeSocketIO from './socket'
import { Game } from './game/Game'

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

const game = new Game(io)

initializeSocketIO(io, game)

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
