import { ISocketInManager, ISocketIo, InEvents } from 'client-api'
import { MapDto, MatchDto, MessageDto, PlayerDto, TeamDto } from 'dtos'
import { Socket } from 'socket.io-client'

export class SocketInManager implements ISocketInManager {
  private socket: Socket

  constructor(socket: ISocketIo) {
    this.socket = socket.socket
  }

  handlePing(callback: () => void) {
    this.socket.on(InEvents.Ping, callback)
  }

  handleConnect(callback: () => void) {
    this.socket.on(InEvents.Connect, callback)
  }

  handleYourPlayerId(callback: (id: string) => void) {
    this.socket.on(InEvents.YourPlayerId, callback)
  }

  handleNewPlayer(callback: (dto: PlayerDto) => void) {
    this.socket.on(InEvents.NewPlayer, callback)
  }

  handleMapUpdate(callback: (mapData: MapDto) => void) {
    this.socket.on(InEvents.Map, callback)
  }

  handleTeamUpdate(callback: (teamData: TeamDto) => void) {
    this.socket.on(InEvents.Team, callback)
  }

  handleLogMessage(callback: (message: MessageDto) => void) {
    this.socket.on(InEvents.Log, callback)
  }

  handleLogReset(callback: () => void) {
    this.socket.on(InEvents.LogReset, callback)
  }

  handleMatchUpdate(callback: (matchData: MatchDto) => void) {
    this.socket.on(InEvents.MatchUpdate, callback)
  }
}
