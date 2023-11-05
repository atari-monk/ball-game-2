import { Server } from 'socket.io'
import { IPlayer, IBall, ITeam, IField, IGates } from 'game-api'
import { BallBuilder } from '../ball/BallBuilder'
import { GateBuilder } from '../gate/GateBuilder'
import { NameGenerator } from '../utils/NameGenerator'
import { Team } from '../team/Team'
import { TeamNameGenerator } from '../team/TeamNameGenerator'
import { Player } from '../player/Player'
import { IGameData } from './IGameData'

export class GameDataForMobileLandscape implements IGameData {
  private _field: IField
  private _teams: ITeam[]
  private _gates: IGates
  private _ball: IBall
  private _players: IPlayer[]

  get field(): IField {
    return this._field
  }

  get teams(): ITeam[] {
    return this._teams
  }

  get gates(): IGates {
    return this._gates
  }

  get ball(): IBall {
    return this._ball
  }

  get players(): IPlayer[] {
    return this._players
  }

  set players(players: IPlayer[]) {
    this._players = players
  }

  constructor(io: Server) {
    this._field = this.getField()
    this._teams = this.getTeams()
    this._gates = this.getGates()
    this._ball = this.getBall(io)
    this._players = []
  }

  private getField() {
    return { width: 740, height: 360 }
  }

  private getTeams() {
    const teamNameGenerator = new TeamNameGenerator()
    const [nameA, nameB] = teamNameGenerator.getRandomAnimalTeams()
    const teamA = Team.builder()
      .withName(nameA)
      .withColor('red')
      .withScore(0)
      .build()
    const teamB = Team.builder()
      .withName(nameB)
      .withColor('blue')
      .withScore(0)
      .build()
    const teams: ITeam[] = []
    teams.push(teamA)
    teams.push(teamB)
    return teams
  }

  private getGates() {
    const gates: IGates = {
      left: new GateBuilder()
        .withPosition(0, this._field.height / 2 - 50)
        .withWidth(20)
        .withHeight(100)
        .withTeam(this._teams[0])
        .build(),
      right: new GateBuilder()
        .withPosition(this._field.width - 20, this._field.height / 2 - 50)
        .withWidth(20)
        .withHeight(100)
        .withTeam(this._teams[1])
        .build(),
    }
    return gates
  }

  private getBall(io: Server) {
    return new BallBuilder(io)
      .withPosition(this._field.width / 2, this._field.height / 2)
      .withVelocity(0, 0)
      .withRadius(20)
      .withMass(0.6)
      .withLastHit(null)
      .build()
  }

  public getPlayer(
    id: string,
    io: Server,
    nameGenerator: NameGenerator
  ): IPlayer {
    const newPlayer: IPlayer = Player.getDefaultPlayer(io, id, nameGenerator)
    this._players.push(newPlayer)
    newPlayer.assignToTeam(this.teams)
    newPlayer.positionInLine(this.teams, this.gates, this.field)
    return newPlayer
  }
}
