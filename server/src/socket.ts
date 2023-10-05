import { Server, Socket } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'
import { MapDto, MatchDto } from 'dtos'
import { Game } from 'game'
import { IPlayer } from 'game-api'
import { SocketEvents } from 'shared-api'

export default function initializeSocketIO(io: Server, game: Game) {
  const playerActivity = new Map()

  io.on(SocketEvents.Connect, (socket: Socket) => {
    if (game.gameData.players.length > 14) {
      game.messenger.sendTextToOne(socket, 'Server is at capacity')
    }
    game.messenger.clearLogOne(socket)
    game.messenger.resendLog(socket)

    socket.on(SocketEvents.SetPlayerId, (id: string) => {
      let playerId: string
      playerId = id
      console.log(`playerId: ${playerId || 'first time player'}`)

      let player: IPlayer | undefined

      if (playerId) {
        player = game.gameData.players.find((p) => p.id === playerId)
        if (!player) {
          player = game.addPlayer(playerId)
        }
      } else {
        playerId = uuidv4()
        socket.emit(SocketEvents.YourPlayerId, playerId)
        player = game.addPlayer(playerId)
      }

      playerActivity.set(playerId, Date.now())

      const pingInterval = setInterval(() => {
        socket.emit(SocketEvents.Ping)
      }, 2000)

      socket.on(SocketEvents.Pong, () => {
        playerActivity.set(playerId, Date.now())
      })

      socket.on(SocketEvents.Input, (input: any) => {
        if (game.stateManager.isNotInProgressState()) {
          return
        }
        if (player) {
          if (input.up) player.onUp()
          if (input.down) player.onDown()
          if (input.left) player.onLeft()
          if (input.right) player.onRight()
          if (!input.up && !input.down && !input.left && !input.right)
            player.onInactive()
        }
      })

      socket.on(SocketEvents.Disconnect, () => {
        clearInterval(pingInterval)
        setTimeout(() => {
          if (Date.now() - playerActivity.get(playerId) >= 2000) {
            console.log(
              `Player ${playerId} is still inactive after 2 seconds. Removing player.`
            )
            if (player) {
              const id = player.id
              game.gameData.players = game.gameData.players.filter(
                (p) => p.id !== id
              )
              game.messenger.sendText(
                `${player.team?.name}'s ${player.name} ran away`
              )
              game.resetGame()
              io.emit(
                SocketEvents.MatchUpdate,
                new MatchDto(game.gameData.players, game.gameData.ball, 16)
              )
              game.stateManager.transitionToMatchMaking()
            }
          }
        }, 2000)
      })

      socket.emit(
        SocketEvents.Map,
        new MapDto(game.gameData.gates, game.gameData.field)
      )
      io.emit(
        SocketEvents.MatchUpdate,
        new MatchDto(game.gameData.players, game.gameData.ball, 16)
      )
    })
  })
}
