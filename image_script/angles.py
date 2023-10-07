import matplotlib.pyplot as plt
import numpy as np

# Function to plot angles in Cartesian coordinates


def plot_angles(angles_degrees, colors):
    # Create a figure and axis
    fig, ax = plt.subplots()

    for angle_degrees, color in zip(angles_degrees, colors):
        # Convert angle from degrees to radians
        angle_radians = np.radians(angle_degrees)

        # Create a unit vector pointing in the direction of the angle
        x = np.cos(angle_radians)
        y = np.sin(angle_radians)

        # Plot the angle as an arrow with the specified color
        ax.arrow(0, 0, x, y, head_width=0.1, head_length=0.1,
                 fc=color, ec=color, label=f'{angle_degrees} degrees')

    # Set axis limits and labels
    ax.set_xlim(-1.2, 1.2)
    ax.set_ylim(-1.2, 1.2)
    ax.set_aspect('equal', adjustable='box')
    ax.set_xlabel('X')
    ax.set_ylabel('Y')

    # Add a legend to label the angles
    ax.legend()

    # Show the plot
    plt.grid()
    plt.title('Multiple Angle Visualization')
    plt.show()


# Example usage: Plot three angles in different colors
angles = [0, 45, 90, 135, 180, 225, 270, 315]
colors = ['blue', 'green', 'red', 'orange', 'purple', 'pink', 'cyan', 'brown']
plot_angles(angles, colors)
