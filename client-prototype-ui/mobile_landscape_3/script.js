// Get the canvas element
const canvas = document.getElementById('canvas')

// Get the 2D rendering context of the canvas
const context = canvas.getContext('2d')

// Set the fill color to green
context.fillStyle = 'green'

// Fill the entire canvas with the green color
context.fillRect(0, 0, canvas.width, canvas.height)

function setLogButton() {
  const logButton = document.getElementById('log_button')
  if (!logButton) return

  const logboard = document.getElementById('message_board_container')
  if (!logboard) return

  const toggleLogboard = () => {
    logboard.classList.toggle('hidden')
  }

  logButton.addEventListener('click', toggleLogboard)
  logButton.addEventListener('touchstart', toggleLogboard)
}

setLogButton()
