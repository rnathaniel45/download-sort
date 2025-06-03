from sentence_transformers import SentenceTransformer, util
from PIL import Image
import pytesseract
import sys
import easyocr
import torch
import json
model = SentenceTransformer('all-mpnet-base-v2')
def ocr_image(image_path, folders):
    reader = easyocr.Reader(['en'])  # English model
    result = reader.readtext(image_path)
    latex_lines = [entry[1] for entry in result]  # get only the recognized text
    latex_code = " ".join(latex_lines)
    files = [
    latex_code
    ]
# Embed folder names and files
    folder_embeddings = model.encode(folders, convert_to_tensor=True)
    file_embeddings = model.encode(files, convert_to_tensor=True)

    # Compute cosine similarity between each file and all folder embeddings
    cosine_scores = util.cos_sim(file_embeddings, folder_embeddings)

    # Assign each file to the folder with highest similarity
    best_match_index = torch.argmax(cosine_scores)

# Get the corresponding folder name
    best_match_folder = folders[best_match_index]

    return best_match_folder

# Join lines with spaces or newlines, depending on your need
# from pptx import Presentation
# prs = Presentation('writingclasses.pptx')
# text = ""

# for slide in prs.slides:
#             for shape in slide.shapes:
#                 # Text directly in shapes
#                 if hasattr(shape, "text"):
#                     text += shape.text + "\n"
#                 # Text inside tables
#                 if shape.has_table:
#                     for row in shape.table.rows:
#                         for cell in row.cells:
#                             text += cell.text + "\n"

# image = Image.open('calc3.jpg')
# image.show()
# # Use pytesseract to do OCR on the image
# text = pytesseract.image_to_string(image)
# print(text)
# # Load the pretrained MPNet model


# Define your folder categories (labels)


# Example file names to classify

if __name__ == "__main__":
    func = sys.argv[1]
    folders = json.loads(sys.argv[2])
    print(ocr_image(func, folders))
    