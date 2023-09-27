import { MapDto, MatchDto, MessageDto, PlayerDto, TeamDto } from 'api'
import { Socket, io } from 'socket.io-client'
import { IInput } from './api/IInput'
import { PlayerModel } from './player/PlayerModel'

//todo: make all handlers into callbacks
export class SocketManager {
  private socket: Socket

  get connection(): Socket {
    return this.socket
  }

  constructor(serverHost: string, private readonly players: PlayerModel[]) {
    this.socket = io(serverHost)
    this.setupSocket()
  }

  private setupSocket() {
    // this.socket.on('connect', () => {
    //   const playerId = localStorage.getItem('playerId')
    //   if (playerId) {
    //     if (!this.players.find((p) => p.id === playerId)) {
    //       const newPlayer = new PlayerModel()
    //       newPlayer.id = playerId
    //       this.players.push(newPlayer)
    //     }
    //   }
    //   this.socket.emit('setPlayerId', playerId)
    // })

    this.handleConnect(this.onConnect.bind(this))

    this.handleYourPlayerId(this.onYourPlayerId.bind(this))

    // this.socket.on('yourPlayerId', (id: string) => {
    //   localStorage.setItem('playerId', id)
    //   if (!this.players.find((p) => p.id === id)) {
    //     const newPlayer = new PlayerModel()
    //     newPlayer.id = id
    //     this.players.push(newPlayer)
    //   }
    // })

    this.socket.on('ping', () => {
      this.socket.emit('pong')
    })
  }

  onConnect() {
    const playerId = localStorage.getItem('playerId')
    if (playerId) {
      if (!this.players.find((p) => p.id === playerId)) {
        const newPlayer = new PlayerModel()
        newPlayer.id = playerId
        this.players.push(newPlayer)
      }
    }
    this.socket.emit('setPlayerId', playerId)
  }

  onYourPlayerId(id: string) {
    localStorage.setItem('playerId', id)
    if (!this.players.find((p) => p.id === id)) {
      const newPlayer = new PlayerModel()
      newPlayer.id = id
      this.players.push(newPlayer)
    }
  }

  handleConnect(callback: () => void) {
    this.socket.on('connect', callback)
  }

  handleYourPlayerId(callback: (id: string) => void) {
    this.socket.on('yourPlayerId', callback)
  }

  handleNewPlayer(callback: (dto: PlayerDto) => void) {
    this.socket.on('newPlayer', callback)
  }

  handleMapUpdate(callback: (mapData: MapDto) => void) {
    this.socket.on('map', callback)
  }

  handleTeamUpdate(callback: (teamData: TeamDto) => void) {
    this.socket.on('team', callback)
  }

  handleLogMessage(callback: (message: MessageDto) => void) {
    this.socket.on('log', callback)
  }

  handleLogReset(callback: () => void) {
    this.socket.on('log-reset', callback)
  }

  handleMatchUpdate(callback: (matchData: MatchDto) => void) {
    this.socket.on('update', callback)
  }

  sendPlayerInput(input: IInput) {
    this.socket.emit('input', input)
  }
}
