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
