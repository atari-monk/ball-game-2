import { Server, Socket } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'
import { IPlayer, MapDto, MatchDto, PlayerDto, TeamDto } from 'api'
import { Game } from './game/Game'
import { Team } from './team/Team'

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
      console.log(`playerId: ${playerId || 'first time player'}`)

      let player: IPlayer | undefined

      if (playerId) {
        player = game.players.find((p) => p.id === playerId)
        if (!player) {
          player = game.addPlayer(playerId)
          io.emit('newPlayer', new PlayerDto(player))
        }
      } else {
        playerId = uuidv4()
        socket.emit('yourPlayerId', playerId)
        player = game.addPlayer(playerId)
        io.emit('newPlayer', new PlayerDto(player))
      }
      const team = game.teams.find((t) =>
        t.playerIds.find((id) => id === playerId)
      )
      if (team) io.emit('team', new TeamDto(team))

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
          if (input.up) player.onUp()
          if (input.down) player.onDown()
          if (input.left) player.onLeft()
          if (input.right) player.onRight()
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
              io.emit('update', new MatchDto(game.players, game.ball, 16))
              game.stateManager.transitionToMatchMaking()
            }
          }
        }, 2000)
      })

      socket.emit('map', new MapDto(game.gates, game.field))
      io.emit('update', new MatchDto(game.players, game.ball, 16))
    })
  })
}
