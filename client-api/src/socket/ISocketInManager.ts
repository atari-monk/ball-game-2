import {
  MapDto,
  MatchDto,
  MessageDto,
  PlayerDto,
  PlayerStateDto,
  TeamDto,
} from 'dtos'

export interface ISocketInManager {
  handlePing(callback: () => void): void
  handleConnect(callback: () => void): void
  handleYourPlayerId(callback: (id: string) => void): void
  handleNewPlayer(callback: (dto: PlayerDto) => void): void
  handleMapUpdate(callback: (mapData: MapDto) => void): void
  handleTeamUpdate(callback: (teamData: TeamDto) => void): void
  handleLogMessage(callback: (message: MessageDto) => void): void
  handleLogReset(callback: () => void): void
  handleMatchUpdate(callback: (matchData: MatchDto) => void): void
  handlePlayerSate(callback: (playerStateData: PlayerStateDto) => void): void
}
