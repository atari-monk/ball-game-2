export class TeamNameGenerator {
  private readonly animalTeams: string[][] = [
    ['Lions', 'Tigers'],
    ['Eagles', 'Hawks'],
    ['Dolphins', 'Sharks'],
    ['Wolves', 'Bears'],
    ['Penguins', 'Seals'],
    ['Cheetahs', 'Leopards'],
    ['Owls', 'Falcons'],
    ['Elephants', 'Rhinos'],
    ['Kangaroos', 'Koalas'],
    ['Gorillas', 'Chimpanzees'],
  ]

  public getRandomAnimalTeams(): string[] {
    const randomIndex = Math.floor(Math.random() * this.animalTeams.length)
    return this.animalTeams[randomIndex]
  }
}
