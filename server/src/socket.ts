import { Server, Socket } from 'socket.io'
import { Game } from './game/Game'
import { GameState } from './game/GameState'

export default function initializeSocketIO(io: Server, game: Game) {
  io.on('connection', (socket: Socket) => {
    if (game.CurrentState !== GameState.MatchMaking) {
      game.sendServerMessage('Game in progress, try later')
      return
    }

    const player = game.addPlayer(socket.id)

    socket.on('input', (input: any) => {
      if (game.CurrentState !== GameState.Progress) {
        return
      }

      const currentPlayer = game.players.find((p) => p.id === socket.id)
      if (currentPlayer) {
        if (input.up)
          currentPlayer.speed = Math.min(
            currentPlayer.speed + 0.05,
            currentPlayer.maxSpeed
          )
        if (input.down)
          currentPlayer.speed = Math.max(currentPlayer.speed - 0.05, 0)
        if (input.left) currentPlayer.direction -= 0.1
        if (input.right) currentPlayer.direction += 0.1
      }
    })

    socket.on('disconnect', () => {
      game.sendServerMessage(`${player.team?.name}'s ${player.name} ran away`)
      game.players = game.players.filter((p) => p.id !== socket.id)
    })

    io.emit('gameState', game)
  })
}
