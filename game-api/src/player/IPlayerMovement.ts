export interface IPlayerMovement {
  onUp(): void
  onDown(): void
  onLeft(): void
  onRight(): void
  onInactive(): void
  update(deltaTime: number): void
}
