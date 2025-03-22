const dropArea = document.getElementById("drop-area");
const timerDisplay = document.getElementById("timer");
const pdfContainer = document.getElementById("pdf-container");
const canvas = document.getElementById("pdf-render");
const openChatGPTBtn = document.getElementById("open-chatgpt");

let timerInterval;
let elapsedTime = 0; // Time spent in fullscreen mode
let isFullscreen = false; // Track fullscreen state
let startTime = 0; // Store timestamp when fullscreen starts
let totalFullscreenTime = 0; // Total time spent in fullscreen mode
let pdfDoc = null;
let pageNum = 1;

// Handle Drag & Drop
dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.style.borderColor = "yellow";
});

dropArea.addEventListener("dragleave", () => {
    dropArea.style.borderColor = "white";
});

dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    dropArea.style.display = "none";

    // Load PDF
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
        loadPDF(URL.createObjectURL(file));
    } else {
        alert("Please upload a valid PDF file.");
    }

    // Enter Fullscreen Mode
    enterFullscreen();
});

// Enter Fullscreen
function enterFullscreen() {
    let elem = document.documentElement;

    if (!document.fullscreenElement) {
        isFullscreen = true;
        startTime = Date.now(); // Start tracking fullscreen time
        timerDisplay.style.display = "none"; // Hide timer in fullscreen

        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }

        startTimer(); // Start/resume the timer
    }
}

// Detect Exit & Re-entering Fullscreen
document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement) {
        isFullscreen = true;
        startTime = Date.now(); // Restart tracking time
        timerDisplay.style.display = "none"; // Hide timer in fullscreen
        startTimer();
    } else {
        isFullscreen = false;
        totalFullscreenTime += Math.floor((Date.now() - startTime) / 1000); // Calculate total time spent in fullscreen
        clearInterval(timerInterval);
        displayTotalFullscreenTime();
    }
});

// Start Timer (Pauses & Resumes)
function startTimer() {
    if (timerInterval) return; // Prevent duplicate intervals

    timerInterval = setInterval(() => {
        if (!isFullscreen) return; // If not in fullscreen, pause updating
        elapsedTime++;
    }, 1000);
}

// Display Total Fullscreen Time After Exiting
function displayTotalFullscreenTime() {
    let minutes = Math.floor(totalFullscreenTime / 60);
    let seconds = totalFullscreenTime % 60;
    timerDisplay.textContent = `Total Fullscreen Time: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    timerDisplay.style.display = "block"; // Show time after exiting fullscreen
}

// Load PDF using PDF.js
function loadPDF(url) {
    pdfContainer.style.display = "block";
    pdfjsLib.getDocument(url).promise.then(pdf => {
        pdfDoc = pdf;
        document.getElementById("page-info").textContent = `Page 1 of ${pdf.numPages}`;
        renderPage(1);
    });
}

// Render PDF Page
function renderPage(num) {
    pdfDoc.getPage(num).then(page => {
        const viewport = page.getViewport({ scale: 1.5 });
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        const renderContext = { canvasContext: context, viewport: viewport };
        page.render(renderContext);
    });
}

// PDF Navigation
document.getElementById("prev-page").addEventListener("click", () => {
    if (pageNum > 1) {
        pageNum--;
        renderPage(pageNum);
        document.getElementById("page-info").textContent = `Page ${pageNum} of ${pdfDoc.numPages}`;
    }
});

document.getElementById("next-page").addEventListener("click", () => {
    if (pageNum < pdfDoc.numPages) {
        pageNum++;
        renderPage(pageNum);
        document.getElementById("page-info").textContent = `Page ${pageNum} of ${pdfDoc.numPages}`;
    }
});

// Keyboard Navigation (Shift for PDF pages, F to re-enter Fullscreen)
document.addEventListener("keydown", (e) => {
    if (e.key === "F") { // Press 'F' to go fullscreen
        enterFullscreen();
    } else if (e.key === "ShiftRight") { // Right Shift for Next Page
        if (pageNum < pdfDoc.numPages) {
            pageNum++;
            renderPage(pageNum);
            document.getElementById("page-info").textContent = `Page ${pageNum} of ${pdfDoc.numPages}`;
        }
    } else if (e.key === "ShiftLeft") { // Left Shift for Previous Page
        if (pageNum > 1) {
            pageNum--;
            renderPage(pageNum);
            document.getElementById("page-info").textContent = `Page ${pageNum} of ${pdfDoc.numPages}`;
        }
    }
});

// ========== CHATGPT WINDOW INTEGRATION ==========
openChatGPTBtn.addEventListener("click", () => {
    if (document.fullscreenElement) {
        alert("⚠️ Using ChatGPT will exit fullscreen mode!");
        document.exitFullscreen(); // Exit fullscreen
    }

    let chatWindow = window.open("https://chat.openai.com", "ChatGPT", "width=600,height=600,top=100,left=100");

    if (chatWindow) {
        chatWindow.focus();
    } else {
        alert("Please allow pop-ups for this site.");
    }
});

// ========== CHATGPT BUTTON HOVER WARNING ==========
function showWarning() {
    let warning = document.getElementById("fullscreen-warning");
    warning.style.display = "block";
}

function hideWarning() {
    let warning = document.getElementById("fullscreen-warning");
    warning.style.display = "none";
}
