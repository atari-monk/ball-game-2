import { Server, Socket } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'
import { IPlayer, MapDto, MatchDto } from 'api'
import { Game } from './game/Game'

export default function initializeSocketIO(io: Server, game: Game) {
  const playerActivity = new Map()

  io.on('connection', (socket: Socket) => {
    if (game.players.length > 14) {
      game.messenger.sendTextToOne(socket, 'Server is at capacity')
    }
    game.messenger.clearLogOne(socket)
    game.messenger.resendLog(socket)

    socket.on('setPlayerId', (id) => {
      let playerId: string | undefined
      playerId = id
      console.log(`playerId: ${playerId}`)

      let player: IPlayer | undefined

      if (playerId) {
        player = game.players.find((p) => p.id === playerId)
        if (!player) {
          player = game.addPlayer(playerId)
        }
      } else {
        playerId = uuidv4()
        socket.emit('yourPlayerId', playerId)
        player = game.addPlayer(playerId)
      }

      playerActivity.set(playerId, Date.now())

      const pingInterval = setInterval(() => {
        socket.emit('ping')
      }, 2000)

      socket.on('pong', () => {
        playerActivity.set(playerId, Date.now())
      })

      socket.on('input', (input: any) => {
        if (game.stateManager.isNotInProgressState()) {
          return
        }
        if (player) {
          if (input.up)
            player.speed = Math.min(
              player.speed + player.maxSpeedForward / 2,
              player.maxSpeedForward
            )
          if (input.down) {
            if (player.speed > 0) {
              player.speed = 0
            } else if (player.speed === 0) {
              player.speed = player.maxSpeedBackward
            }
          }
          if (input.left) player.direction -= player.turnSpeed
          if (input.right) player.direction += player.turnSpeed
        }
      })

      socket.on('disconnect', () => {
        clearInterval(pingInterval)
        setTimeout(() => {
          if (Date.now() - playerActivity.get(playerId) >= 2000) {
            console.log(
              `Player ${playerId} is still inactive after 2 seconds. Removing player.`
            )
            if (player) {
              const id = player.id
              game.players = game.players.filter((p) => p.id !== id)
              game.messenger.sendText(
                `${player.team?.name}'s ${player.name} ran away`
              )
              game.resetGame()
              io.emit('update', new MatchDto(game.players, game.ball))
              game.stateManager.transitionToMatchMaking()
            }
          }
        }, 2000)
      })

      socket.emit('map', new MapDto(game.gates, game.field))
      io.emit('update', new MatchDto(game.players, game.ball))
    })
  })
}
