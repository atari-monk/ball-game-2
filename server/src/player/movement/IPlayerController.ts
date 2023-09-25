export interface IPlayerController {
  update(deltaTime: number): void
  onUp(): void
  onDown(): void
  onLeft(): void
  onRight(): void
}
