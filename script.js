let hotels = [];
let currentHotel = 0;
let currentImage = 0;
let currentPdfImage = 0; // Track the active pseudo-PDF image

function showHotel(index) {
    // 1. Fix global state immediately
    currentHotel = index; 
    currentImage = 0;
    currentPdfImage = 0; // Reset document image index for the new hotel
    const hotel = hotels[index];

    document.getElementById("hotelName").textContent = hotel.name;
    document.getElementById("comments").innerText = hotel.comments;
    document.getElementById("hotelMap").src = hotel.location;

    loadImage();
    loadPdfImages(); // Load the new image-based doc carousel
}

// --- MAIN IMAGE SECTION ---
function loadImage() {
    const hotel = hotels[currentHotel];
    const imgElement = document.getElementById("hotelImage");

    if (hotel.images && hotel.images.length > 0) {
        imgElement.src = hotel.images[currentImage];
        document.getElementById("imageCounter").innerText = 
            (currentImage + 1) + " / " + hotel.images.length;

        // Smart Preloading for Next Main Image
        const nextImgIndex = (currentImage + 1) % hotel.images.length;
        if (hotel.images[nextImgIndex]) {
            const imgCache = new Image();
            imgCache.src = hotel.images[nextImgIndex];
        }
    } else {
        imgElement.src = "";
        document.getElementById("imageCounter").innerText = "0 / 0";
    }
}

function nextImage() {
    const hotel = hotels[currentHotel];
    if (!hotel.images || hotel.images.length === 0) return;
    currentImage = (currentImage + 1) % hotel.images.length;
    loadImage();
}

function prevImage() {
    const hotel = hotels[currentHotel];
    if (!hotel.images || hotel.images.length === 0) return;
    currentImage = (currentImage - 1 + hotel.images.length) % hotel.images.length;
    loadImage();
}


// --- PDF REPLACEMENT (IMAGES) SECTION ---
function loadPdfImages() {
    const hotel = hotels[currentHotel];
    const pdfImgElement = document.getElementById("pdfImage");
    const counterElement = document.getElementById("pdfImageCounter");

    // Check if the pdf_images array exists and has contents
    if (hotel.pdf_images && hotel.pdf_images.length > 0) {
        pdfImgElement.src = hotel.pdf_images[currentPdfImage];
        
        if (counterElement) {
            counterElement.innerText = (currentPdfImage + 1) + " / " + hotel.pdf_images.length;
        }

        // Smart Preloading for Next PDF Image
        const nextPdfImgIndex = (currentPdfImage + 1) % hotel.pdf_images.length;
        if (hotel.pdf_images[nextPdfImgIndex]) {
            const pdfCache = new Image();
            pdfCache.src = hotel.pdf_images[nextPdfImgIndex];
        }
    } else {
        // Fallback fallback if no document images exist
        pdfImgElement.src = "path/to/placeholder-or-blank.png"; 
        if (counterElement) counterElement.innerText = "0 / 0";
    }
}

function nextPdfImage() {
    const hotel = hotels[currentHotel];
    if (!hotel.pdf_images || hotel.pdf_images.length === 0) return;
    currentPdfImage = (currentPdfImage + 1) % hotel.pdf_images.length;
    loadPdfImages();
}

function prevPdfImage() {
    const hotel = hotels[currentHotel];
    if (!hotel.pdf_images || hotel.pdf_images.length === 0) return;
    currentPdfImage = (currentPdfImage - 1 + hotel.pdf_images.length) % hotel.pdf_images.length;
    loadPdfImages();
}


// --- HOTEL NAVIGATION SECTION ---
function nextHotel() {
    if (hotels.length === 0) return;
    currentHotel = (currentHotel + 1) % hotels.length;
    showHotel(currentHotel);
}

function prevHotel() {
    if (hotels.length === 0) return;
    currentHotel = (currentHotel - 1 + hotels.length) % hotels.length;
    showHotel(currentHotel);
}


// --- DATA INITIALIZATION ---
fetch("hotels.json")
    .then(response => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
    })
    .then(data => {
        hotels = data;
        if (hotels.length > 0) {
            showHotel(0);
        }
    })
    .catch(error => {
        console.error("Failed to load hotels.json", error);
    });
