import { ISocketInManager, ISocketIo } from 'client-api'
import { MapDto, MatchDto, MessageDto, PlayerDto, PlayerStateDto, TeamDto } from 'dtos'
import { SocketEvents } from 'shared-api'
import { Socket } from 'socket.io-client'

export class SocketInManager implements ISocketInManager {
  private socket: Socket

  constructor(socket: ISocketIo) {
    this.socket = socket.socket
  }

  handleConnect(callback: () => void) {
    this.socket.on(SocketEvents.Connect, callback)
  }

  handlePing(callback: () => void) {
    this.socket.on(SocketEvents.Ping, callback)
  }

  handleYourPlayerId(callback: (id: string) => void) {
    this.socket.on(SocketEvents.YourPlayerId, callback)
  }

  handleNewPlayer(callback: (dto: PlayerDto) => void) {
    this.socket.on(SocketEvents.NewPlayer, callback)
  }

  handleMapUpdate(callback: (mapData: MapDto) => void) {
    this.socket.on(SocketEvents.Map, callback)
  }

  handleTeamUpdate(callback: (teamData: TeamDto) => void) {
    this.socket.on(SocketEvents.Team, callback)
  }

  handleLogMessage(callback: (message: MessageDto) => void) {
    this.socket.on(SocketEvents.Log, callback)
  }

  handleLogReset(callback: () => void) {
    this.socket.on(SocketEvents.LogReset, callback)
  }

  handleMatchUpdate(callback: (matchData: MatchDto) => void) {
    this.socket.on(SocketEvents.MatchUpdate, callback)
  }

  handlePlayerSate(callback: (playerStateData: PlayerStateDto) => void) {
    this.socket.on(SocketEvents.PlayerState, callback)
  }
}
