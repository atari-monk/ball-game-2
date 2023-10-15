// Get the canvas element
const canvas = document.getElementById('canvas')

// Get the 2D rendering context of the canvas
const context = canvas.getContext('2d')

// Set the fill color to green
context.fillStyle = 'green'

// Fill the entire canvas with the green color
context.fillRect(0, 0, canvas.width, canvas.height)
