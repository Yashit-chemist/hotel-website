let hotels = [];
let currentHotel = 0;
let currentImage = 0;
let currentPdfImage = 0;
let editorMode = "edit";

const storageKey = "hotel-editor-data";
const driveSyncKey = "hotel-drive-sync-url";

function loadStoredHotels() {
    try {
        const stored = localStorage.getItem(storageKey);
        if (!stored) return null;
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : null;
    } catch (error) {
        console.warn("Could not load saved hotel data", error);
        return null;
    }
}

function persistHotels() {
    localStorage.setItem(storageKey, JSON.stringify(hotels));
}

function loadDriveSyncUrl() {
    return localStorage.getItem(driveSyncKey) || "";
}

function saveDriveSyncUrl(url) {
    if (url) {
        localStorage.setItem(driveSyncKey, url);
    } else {
        localStorage.removeItem(driveSyncKey);
    }
}

async function syncHotelsToDrive() {
    const driveUrl = loadDriveSyncUrl();
    if (!driveUrl) return null;

    try {
        const response = await fetch(driveUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "save", hotels })
        });

        if (!response.ok) {
            throw new Error(`Drive sync failed with status ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.warn("Drive sync failed", error);
        return null;
    }
}

async function loadHotelsFromDrive() {
    const driveUrl = loadDriveSyncUrl();
    if (!driveUrl) return null;

    try {
        const response = await fetch(driveUrl);
        if (!response.ok) {
            throw new Error(`Drive load failed with status ${response.status}`);
        }

        const loaded = await response.json();
        return Array.isArray(loaded) ? loaded : null;
    } catch (error) {
        console.warn("Drive load failed", error);
        return null;
    }
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[char]));
}

function renderHotelTabs() {
    const hotelTabsEl = document.getElementById("hotelTabs");
    if (!hotelTabsEl) return;

    hotelTabsEl.innerHTML = hotels.map((hotel, index) => `
        <button class="hotel-tab ${index === currentHotel ? 'active' : ''}" onclick="showHotel(${index})">
            ${escapeHtml(hotel.name)}
        </button>
    `).join('');
}

function renderComments(hotel) {
    const commentsEl = document.getElementById("comments");
    if (!commentsEl) return;

    const rawText = hotel.comments ? String(hotel.comments).trim() : "";
    if (!rawText) {
        commentsEl.innerHTML = '<p class="empty-state">No details shared for this property yet.</p>';
        return;
    }

    if (/^https?:\/\//i.test(rawText)) {
        commentsEl.innerHTML = `<a href="${rawText}" target="_blank" rel="noopener noreferrer">${escapeHtml(rawText)}</a>`;
        return;
    }

    const paragraphs = rawText
        .split(/\n+/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => `<p>${escapeHtml(line)}</p>`);

    commentsEl.innerHTML = paragraphs.length ? paragraphs.join('') : '<p class="empty-state">No details shared for this property yet.</p>';
}

function showHotel(index) {
    currentHotel = index;
    currentImage = 0;
    currentPdfImage = 0;

    const hotel = hotels[index];
    if (!hotel) return;

    const nameEl = document.getElementById("hotelName");
    const subtitleEl = document.getElementById("hotelSubtitle");
    const statusEl = document.getElementById("hotelStatus");
    const mapEl = document.getElementById("hotelMap");

    if (nameEl) nameEl.textContent = hotel.name;
    if (subtitleEl) {
        const photoCount = hotel.images && hotel.images.length ? hotel.images.length : 0;
        const documentCount = hotel.pdf_images && hotel.pdf_images.length ? hotel.pdf_images.length : 0;
        subtitleEl.textContent = `Explore ${photoCount} photo${photoCount === 1 ? '' : 's'} and ${documentCount} document page${documentCount === 1 ? '' : 's'} for this property.`;
    }

    if (statusEl) {
        const summary = [];
        if (hotel.images && hotel.images.length) summary.push(`${hotel.images.length} photos`);
        if (hotel.pdf_images && hotel.pdf_images.length) summary.push(`${hotel.pdf_images.length} document pages`);
        summary.push('map available');
        statusEl.textContent = `${index + 1} of ${hotels.length} • ${summary.join(' • ')}`;
    }

    if (mapEl) {
        mapEl.src = hotel.location || '';
    }

    renderHotelTabs();
    renderComments(hotel);
    loadImage();
    loadPdfImages();
}

function loadImage() {
    const hotel = hotels[currentHotel];
    const imgElement = document.getElementById("hotelImage");
    const counterElement = document.getElementById("imageCounter");
    const galleryWrapper = document.getElementById("imageGalleryWrapper");

    if (!galleryWrapper) return;

    if (!hotel.images || hotel.images.length === 0) {
        galleryWrapper.style.display = "none";
        if (counterElement) counterElement.textContent = "0 / 0";
        return;
    }

    galleryWrapper.style.display = "flex";

    if (imgElement) {
        imgElement.src = hotel.images[currentImage];
        imgElement.alt = `${hotel.name} gallery image ${currentImage + 1}`;
    }

    if (counterElement) {
        counterElement.textContent = `${currentImage + 1} / ${hotel.images.length}`;
    }

    const nextImgIndex = (currentImage + 1) % hotel.images.length;
    if (hotel.images[nextImgIndex]) {
        const imgCache = new Image();
        imgCache.src = hotel.images[nextImgIndex];
    }
}

function loadPdfImages() {
    const hotel = hotels[currentHotel];
    const pdfImgElement = document.getElementById("pdfImage");
    const counterElement = document.getElementById("pdfImageCounter");
    const pdfWrapper = document.getElementById("pdfGalleryWrapper");

    if (!pdfWrapper) return;

    if (!hotel.pdf_images || hotel.pdf_images.length === 0) {
        pdfWrapper.style.display = "none";
        if (counterElement) counterElement.textContent = "0 / 0";
        return;
    }

    pdfWrapper.style.display = "flex";

    if (pdfImgElement) {
        pdfImgElement.src = hotel.pdf_images[currentPdfImage];
        pdfImgElement.alt = `${hotel.name} document page ${currentPdfImage + 1}`;
    }

    if (counterElement) {
        counterElement.textContent = `${currentPdfImage + 1} / ${hotel.pdf_images.length}`;
    }

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

function openEditorModal(isNew = false) {
    const modal = document.getElementById("editorModal");
    const form = document.getElementById("hotelEditorForm");
    const hotel = hotels[currentHotel];

    if (!modal || !form) return;

    editorMode = isNew ? "add" : "edit";
    const titleEl = document.getElementById("editorTitle");
    if (titleEl) {
        titleEl.textContent = isNew ? "Add new resort" : "Edit hotel details";
    }

    form.reset();

    const driveUrlInput = document.getElementById("driveSyncUrl");
    if (driveUrlInput) {
        driveUrlInput.value = loadDriveSyncUrl();
    }

    if (!isNew && hotel) {
        const nameInput = document.getElementById("editorName");
        const commentsInput = document.getElementById("editorComments");
        const locationInput = document.getElementById("editorLocation");

        if (nameInput) nameInput.value = hotel.name || "";
        if (commentsInput) commentsInput.value = hotel.comments || "";
        if (locationInput) locationInput.value = hotel.location || "";
    }

    modal.classList.remove("hidden");
    document.getElementById("editorName").focus();
}

function closeEditorModal() {
    const modal = document.getElementById("editorModal");
    if (modal) modal.classList.add("hidden");
}

async function readFilesAsDataUrls(files) {
    const readers = Array.from(files || []).map((file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    }));

    return Promise.all(readers);
}

async function handleEditorSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const driveUrl = formData.get("driveSyncUrl").toString().trim();
    const name = formData.get("name").toString().trim() || "New Resort";
    const comments = formData.get("comments").toString().trim();
    const location = formData.get("location").toString().trim();
    const selectedImages = form.elements.images.files;
    const selectedPdfImages = form.elements.pdf_images.files;

    const images = selectedImages && selectedImages.length
        ? await readFilesAsDataUrls(selectedImages)
        : [];

    const pdfImages = selectedPdfImages && selectedPdfImages.length
        ? await readFilesAsDataUrls(selectedPdfImages)
        : [];

    if (editorMode === "add") {
        const newHotel = {
            name,
            images,
            pdf_images: pdfImages,
            comments,
            location
        };

        hotels.push(newHotel);
        currentHotel = hotels.length - 1;
    } else {
        const hotel = hotels[currentHotel];
        if (!hotel) return;

        hotel.name = name;
        hotel.comments = comments;
        hotel.location = location;
        hotel.images = images.length ? images : hotel.images || [];
        hotel.pdf_images = pdfImages.length ? pdfImages : hotel.pdf_images || [];
    }

    if (driveUrl) {
        saveDriveSyncUrl(driveUrl);
    } else {
        saveDriveSyncUrl("");
    }

    persistHotels();
    await syncHotelsToDrive();
    showHotel(currentHotel);
    closeEditorModal();
}

function attachEditorEvents() {
    document.getElementById("openEditorBtn").addEventListener("click", () => openEditorModal(true));
    document.getElementById("closeEditorBtn").addEventListener("click", closeEditorModal);
    document.getElementById("cancelEditorBtn").addEventListener("click", closeEditorModal);
    document.getElementById("hotelEditorForm").addEventListener("submit", handleEditorSubmit);

    document.getElementById("editorModal").addEventListener("click", (event) => {
        if (event.target.id === "editorModal") closeEditorModal();
    });
}

async function initializeHotels() {
    try {
        const storedHotels = loadStoredHotels();
        const driveHotels = await loadHotelsFromDrive();
        const baseHotels = driveHotels && driveHotels.length ? driveHotels : (storedHotels && storedHotels.length ? storedHotels : null);

        if (baseHotels) {
            hotels = baseHotels;
        } else {
            const response = await fetch("hotels.json");
            if (!response.ok) throw new Error("Network response was not ok");
            hotels = await response.json();
        }

        attachEditorEvents();
        if (hotels.length > 0) {
            showHotel(0);
        }
    } catch (error) {
        console.error("Failed to load hotels data", error);
    }
}

initializeHotels();
