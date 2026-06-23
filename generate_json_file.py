#!/usr/bin/env python3

import os
import json

HOTELS_DIR = "Hotels"

IMAGE_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".webp",
    ".tif",
    ".tiff"
}

PDF_EXTENSIONS = {
    ".pdf"
}

hotels = []

for hotel_name in sorted(os.listdir(HOTELS_DIR)):

    hotel_path = os.path.join(
        HOTELS_DIR,
        hotel_name
    )

    if not os.path.isdir(hotel_path):
        continue

    hotel = {}

    hotel["name"] = hotel_name

    images = []
    pdfs = []

    for fname in sorted(os.listdir(hotel_path)):

        ext = os.path.splitext(fname)[1].lower()

        relpath = os.path.join(
            "Hotels",
            hotel_name,
            fname
        ).replace("\\", "/")

        if ext in IMAGE_EXTENSIONS:
            images.append(relpath)

        elif ext in PDF_EXTENSIONS:
            pdfs.append(relpath)

    hotel["images"] = images
    hotel["pdfs"] = pdfs

    comments_file = os.path.join(
        hotel_path,
        "comments.txt"
    )

    if os.path.exists(comments_file):

        with open(
            comments_file,
            "r",
            encoding="utf-8"
        ) as f:

            hotel["comments"] = f.read()

    else:

        hotel["comments"] = ""

    location_file = os.path.join(
        hotel_path,
        "location.l"
    )

    if os.path.exists(location_file):

        with open(
            location_file,
            "r",
            encoding="utf-8"
        ) as f:

            hotel["location"] = f.read().strip()

    else:

        hotel["location"] = ""

    hotels.append(hotel)

with open(
    "hotels.json",
    "w",
    encoding="utf-8"
) as f:

    json.dump(
        hotels,
        f,
        indent=4,
        ensure_ascii=False
    )

print(
    f"Generated hotels.json with "
    f"{len(hotels)} hotels"
    )

import os
from pdf2image import convert_from_path

HOTELS_DIR = "Hotels"

OUTPUT_FOLDER_NAME = "PDF_image"

def convert_pdf(pdf_path, output_dir, pdf_name):

    images = convert_from_path(pdf_path, dpi=200)

    os.makedirs(output_dir, exist_ok=True)

    for i, img in enumerate(images):

        img_path = os.path.join(
            output_dir,
            f"{pdf_name}_page_{i+1}.png"
        )

        img.save(img_path, "PNG")

        print(f"Saved: {img_path}")


for hotel in os.listdir(HOTELS_DIR):

    hotel_path = os.path.join(HOTELS_DIR, hotel)

    if not os.path.isdir(hotel_path):
        continue

    output_dir = os.path.join(
        hotel_path,
        OUTPUT_FOLDER_NAME
    )

    for file in os.listdir(hotel_path):

        if file.lower().endswith(".pdf"):

            pdf_path = os.path.join(hotel_path, file)

            pdf_name = os.path.splitext(file)[0]

            print(f"\nConverting: {pdf_path}")

            convert_pdf(pdf_path, output_dir, pdf_name)

print("\nDONE: All PDFs converted into PDF_image folders.")



