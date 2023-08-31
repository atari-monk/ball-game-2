import { io } from 'socket.io-client'

const socket = io('http://localhost:3000') // Update with your server URL

socket.on('gameState', (gameState: any) => {
  // Update and render the game state on the canvas
})

document.addEventListener('keydown', (event: KeyboardEvent) => {
  // Send input to the server using socket.emit('input', input);
})
