let hotels = [];
let currentHotel = 0;
let currentImage = 0;

function showHotel(index) {
    currentImage = 0;
    const hotel = hotels[index];

    document.getElementById("hotelName").textContent = hotel.name;
    document.getElementById("comments").innerText = hotel.comments;
    document.getElementById("hotelMap").src = hotel.location;

    loadImage();
    loadPDFs();
}

function loadImage() {
    const hotel = hotels[currentHotel];

    document.getElementById("hotelImage").src = hotel.images[currentImage];
    document.getElementById("imageCounter").innerText = 
        (currentImage + 1) + " / " + hotel.images.length;
}

function nextImage() {
    const hotel = hotels[currentHotel];
    currentImage++;

    if (currentImage >= hotel.images.length) currentImage = 0;
    loadImage();
}

function prevImage() {
    const hotel = hotels[currentHotel];
    currentImage--;

    if (currentImage < 0) currentImage = hotel.images.length - 1;
    loadImage();
}

function nextHotel() {
    currentHotel++;

    if (currentHotel >= hotels.length) currentHotel = 0;
    showHotel(currentHotel);
}

function prevHotel() {
    currentHotel--;

    if (currentHotel < 0) currentHotel = hotels.length - 1;
    showHotel(currentHotel);
}

function loadPDFs() {
    const hotel = hotels[currentHotel];
    const container = document.getElementById("pdfContainer");

    container.innerHTML = "";
    hotel.pdfs.forEach(pdf => {
        container.innerHTML += `
            <iframe
                class="pdfViewer"
                src="${pdf}">
            </iframe>
        `;
    });
}

fetch("hotels.json")
    .then(response => response.json())
    .then(data => {
        hotels = data;

        if (hotels.length > 0) {
            showHotel(0);
        }
    })
    .catch(error => {
        console.error("Failed to load hotels.json", error);
    });

