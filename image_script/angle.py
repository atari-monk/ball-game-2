import matplotlib.pyplot as plt
import numpy as np

# Function to plot an angle in Cartesian coordinates


def plot_angle(angle_degrees):
    # Convert angle from degrees to radians
    angle_radians = np.radians(angle_degrees)

    # Create a unit vector pointing in the direction of the angle
    x = np.cos(angle_radians)
    y = np.sin(angle_radians)

    # Create a figure and axis
    fig, ax = plt.subplots()

    # Plot the angle as an arrow
    ax.arrow(0, 0, x, y, head_width=0.1, head_length=0.1, fc='blue', ec='blue')

    # Set axis limits and labels
    ax.set_xlim(-1.2, 1.2)
    ax.set_ylim(-1.2, 1.2)
    ax.set_aspect('equal', adjustable='box')
    ax.set_xlabel('X')
    ax.set_ylabel('Y')

    # Add a text label to show the angle in degrees
    ax.text(0.2, 0.2, f'{angle_degrees} degrees', fontsize=12, color='red')

    # Show the plot
    plt.grid()
    plt.title('Angle Visualization')
    plt.show()


# Example usage: Plot a 45-degree angle
plot_angle(45)
