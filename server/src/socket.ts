import { Server, Socket } from 'socket.io'
import { Game } from './game/Game'
import { GameState } from './game/GameState'
import { v4 as uuidv4 } from 'uuid'
import { IPlayer, MapDto, MatchDto } from 'api'

export default function initializeSocketIO(io: Server, game: Game) {
  const playerActivity = new Map()

  io.on('connection', (socket: Socket) => {
    socket.on('setPlayerId', (id) => {
      let playerId: string | undefined
      playerId = id
      //console.log(`playerId: ${playerId}`)

      let player: IPlayer | undefined

      if (playerId) {
        player = game.players.find((p) => p.id === playerId)
        if (!player) {
          player = game.addPlayer(playerId, socket)
        }
      } else {
        playerId = uuidv4()
        socket.emit('yourPlayerId', playerId)
        player = game.addPlayer(playerId, socket)
      }

      playerActivity.set(playerId, Date.now())

      const pingInterval = setInterval(() => {
        socket.emit('ping')
      }, 2000)

      socket.on('pong', () => {
        playerActivity.set(playerId, Date.now())
      })

      socket.on('input', (input: any) => {
        if (game.CurrentState !== GameState.Progress) {
          return
        }
        if (player) {
          if (input.up)
            player.speed = Math.min(player.speed + 0.05, player.maxSpeed)
          if (input.down) player.speed = Math.max(player.speed - 0.05, 0)
          if (input.left) player.direction -= 0.1
          if (input.right) player.direction += 0.1
        }
      })

      socket.on('disconnect', () => {
        clearInterval(pingInterval)
        setTimeout(() => {
          if (Date.now() - playerActivity.get(playerId) >= 2000) {
            // console.log(
            //   `Player ${playerId} is still inactive after 2 seconds. Removing player.`
            // )
            if (player) {
              const id = player.id
              game.players = game.players.filter((p) => p.id !== id)
              game.sendServerMessage(
                `${player.team?.name}'s ${player.name} ran away`
              )
              socket.emit('update', new MatchDto(game.players, game.ball))
            }
          }
        }, 2000)
      })

      socket.emit('map', new MapDto(game.gates, game.field))
      socket.emit('update', new MatchDto(game.players, game.ball))
    })
  })
}
