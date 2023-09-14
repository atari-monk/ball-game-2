export class NameGenerator {
  private usedNames: Set<string> = new Set()

  public getUniqueFunnySingleWordName(): string {
    const funnyNames = [
      'Whiskerz',
      'Bubbles',
      'Wobble',
      'Squiggles',
      'Snickers',
      'Fluffy',
      'Tater',
      'Noodle',
      'Fizzle',
      'Puddin',
      'Squishy',
      'Fuzzy',
      'Muffin',
    ]

    const availableNames = funnyNames.filter(
      (name) => !this.usedNames.has(name)
    )

    if (availableNames.length === 0) {
      this.usedNames.clear()
    }

    const randomIndex = Math.floor(Math.random() * availableNames.length)
    const selectedName = availableNames[randomIndex]
    this.usedNames.add(selectedName)

    return selectedName
  }
}
