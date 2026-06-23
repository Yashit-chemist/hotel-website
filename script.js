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

    // Safely apply text content
    const nameEl = document.getElementById("hotelName");
    const commentsEl = document.getElementById("comments");
    if (nameEl) nameEl.textContent = hotel.name;
    if (commentsEl) commentsEl.innerText = hotel.comments;

    // SAFE MAP BINDING: Assigns the clean string URL directly to your iframe src
    const mapEl = document.getElementById("hotelMap");
    if (mapEl && hotel.location) {
        mapEl.src = hotel.location;
    }

    loadImage();
    loadPdfImages(); // Load the new image-based doc carousel
}

// --- MAIN IMAGE SECTION ---
// --- MAIN IMAGE SECTION ---
function loadImage() {
    const hotel = hotels[currentHotel];
    const imgElement = document.getElementById("hotelImage");
    const counterElement = document.getElementById("imageCounter");
    const galleryWrapper = document.getElementById("imageGalleryWrapper");

    if (!galleryWrapper) return;

    // If there are no images, hide the entire image gallery section (including arrows)
    if (!hotel.images || hotel.images.length === 0) {
        galleryWrapper.style.display = "none";
        return;
    }

    // Otherwise, make sure it's visible and update assets
    galleryWrapper.style.display = "block";

    if (imgElement) {
        imgElement.src = hotel.images[currentImage];
    }
    
    if (counterElement) {
        counterElement.innerText = (currentImage + 1) + " / " + hotel.images.length;
    }

    // Smart Preloading for Next Main Image
    const nextImgIndex = (currentImage + 1) % hotel.images.length;
    if (hotel.images[nextImgIndex]) {
        const imgCache = new Image();
        imgCache.src = hotel.images[nextImgIndex];
    }
}


// --- PDF REPLACEMENT (IMAGES) SECTION ---
function loadPdfImages() {
    const hotel = hotels[currentHotel];
    const pdfImgElement = document.getElementById("pdfImage");
    const counterElement = document.getElementById("pdfImageCounter");
    const pdfWrapper = document.getElementById("pdfGalleryWrapper");

    if (!pdfWrapper) return;

    // If there are no document images, hide the entire document section (including arrows)
    if (!hotel.pdf_images || hotel.pdf_images.length === 0) {
        pdfWrapper.style.display = "none";
        return;
    }

    // Otherwise, reveal it and set up properties
    pdfWrapper.style.display = "block";

    if (pdfImgElement) {
        pdfImgElement.src = hotel.pdf_images[currentPdfImage];
    }
    
    if (counterElement) {
        counterElement.innerText = (currentPdfImage + 1) + " / " + hotel.pdf_images.length;
    }

    // Smart Preloading for Next PDF Image
    const nextPdfImgIndex = (currentPdfImage + 1) % hotel.pdf_images.length;
    if (hotel.pdf_images[nextPdfImgIndex]) {
        const pdfCache = new Image();
        pdfCache.src = hotel.pdf_images[nextPdfImgIndex];
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
