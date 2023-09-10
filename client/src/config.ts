interface IHostConfig {
  [key: string]: string
}

const config: IHostConfig = {
  localhost: 'http://localhost:3001',
  azure: 'atari-monk-ball-game-2-server.azurewebsites.net',
}

export default config
