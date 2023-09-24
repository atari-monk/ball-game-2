from PIL import Image, ImageDraw, ImageFont
import os
import re


def extract_number(filename):
    # Use regular expression to extract the numeric part of the filename
    match = re.search(r'\d+', filename)
    if match:
        return int(match.group())
    else:
        return None


def number_images_in_folder(folder_path):
    # Get a list of all image files in the folder
    image_files = [f for f in os.listdir(
        folder_path) if f.endswith(('.jpg', '.png', '.jpeg'))]

    # Sort the image files based on the extracted numbers
    image_files.sort(key=lambda x: extract_number(x) or 0)

    # Initialize a counter
    counter = 1

    # Loop through each image file
    for image_file in image_files:
        # Open the image using Pillow
        image_path = os.path.join(folder_path, image_file)
        img = Image.open(image_path)

        # Create a drawing context
        draw = ImageDraw.Draw(img)

        # Choose a font and size
        font = ImageFont.load_default()

        # Specify the position to draw the number
        x, y = 40, 75

        # Draw the number on the image
        draw.text((x, y), str(counter), fill="yellow", font=font)

        # Save the modified image with the number
        img.save(os.path.join(folder_path, image_file))

        # Increment the counter
        counter += 1

    print("Done adding numbers to images.")
