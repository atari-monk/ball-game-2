export interface IPlayerBehavior {
  scorePoint(): void
  update(deltaTime: number): void
}
