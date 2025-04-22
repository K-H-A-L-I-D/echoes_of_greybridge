// Evidence and Notes functions
function collectEvidence(evidenceId) {
    // Check if we've already collected this evidence
    if (gameState.collectedEvidence.some(e => e.id === evidenceId)) {
        return;
    }
    
    // Find the evidence data
    const currentPage = gameData.pages.find(p => p.id === gameState.currentPage);
    const evidence = currentPage.leftPage.evidence.find(e => e.id === evidenceId);
    
    if (!evidence) {
        console.error(`Evidence with ID "${evidenceId}" not found.`);
        return;
    }
    
    // Add to collected evidence
    gameState.collectedEvidence.push({
        id: evidenceId,
        title: `Evidence from ${currentPage.id}`,
        content: evidence.description
    });
    
    // Mark as found visually
    const marker = document.querySelector(`.evidence-marker[data-evidence-id="${evidenceId}"]`);
    if (marker) {
        marker.classList.add('found');
        marker.classList.remove('pulsing');
    }
    
    // Increment evidence counter
    gameState.evidenceFound++;
    updateEvidenceCounters();
    
    // Add note about the evidence
    const note = {
        timestamp: getCurrentTimestamp(),
        text: `Found evidence: ${evidence.description}`
    };
    gameState.notes.push(note);
    addNoteToPanel(note);
    
    // Play sound
    playClickSound();
    
    // Trigger static if it's a significant evidence (was pulsing)
    if (evidence.isPulsing) {
        triggerStaticEffect();
    }
    
    // Update debug panel
    updateDebugPanel();
}

function toggleNotesPanel() {
    notesPanel.classList.toggle('active');
    playClickSound();
}

function addNote() {
    if (notesTextarea.value.trim() === '') return;
    
    const note = {
        timestamp: getCurrentTimestamp(),
        text: notesTextarea.value.trim()
    };
    
    gameState.notes.push(note);
    addNoteToPanel(note);
    
    // Clear the textarea
    notesTextarea.value = '';
    
    // Play sound
    playClickSound();
}

function addNoteToPanel(note) {
    const noteItem = document.createElement('div');
    noteItem.className = 'note-item';
    
    const timestamp = document.createElement('div');
    timestamp.className = 'note-timestamp';
    timestamp.textContent = note.timestamp;
    
    const text = document.createElement('div');
    text.className = 'note-text';
    text.textContent = note.text;
    
    noteItem.appendChild(timestamp);
    noteItem.appendChild(text);
    
    // Add to the beginning of the notes content
    notesContent.insertBefore(noteItem, notesContent.firstChild);
}

function handleNotesKeypress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        addNote();
    }
}

// Image zoom functions
function toggleMagnifyMode(event) {
    const container = event.target.closest('.page-image-container');
    container.classList.toggle('magnify-mode');
    playClickSound();
}

function zoomImage(image) {
    zoomedImage.src = image.src;
    imageZoomOverlay.classList.add('active');
    
    // Add the evidence markers to the zoomed image if they exist
    const markers = image.closest('.page-image-container').querySelectorAll('.evidence-marker');
    if (markers.length > 0) {
        // Implementation for markers in zoomed view could be added here
    }
}

function closeZoomView() {
    imageZoomOverlay.classList.remove('active');
}

// Special effects
function triggerStaticEffect() {
    // Visual effect
    staticOverlay.classList.add('active');
    
    // Audio effect
    playStaticSound();
    
    // Remove after animation completes
    setTimeout(() => {
        staticOverlay.classList.remove('active');
    }, 500);
}

function triggerGlitchEffect() {
    // Don't trigger if already active
    if (gameState.glitchActive) return;
    
    // Set flag
    gameState.glitchActive = true;
    
    // Add glitch class to all glitch text elements
    document.querySelectorAll('.glitch-text').forEach(el => {
        el.closest('p').classList.add('glitch-active');
    });
    
    // Remove after effect completes
    setTimeout(() => {
        document.querySelectorAll('.glitch-active').forEach(el => {
            el.classList.remove('glitch-active');
        });
        gameState.glitchActive = false;
    }, 2000);
}

// Utility functions
function updateEvidenceCounters() {
    document.querySelectorAll('.evidence-count').forEach(counter => {
        counter.textContent = `${gameState.evidenceFound}/${gameState.totalEvidence}`;
    });
    
    // Update debug panel
    if (debugEvidence) {
        debugEvidence.textContent = `${gameState.evidenceFound}/${gameState.totalEvidence}`;
    }
}

function getCurrentTimestamp() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    return `${month}/${day}/${year} - ${hours}:${minutes}`;
}

function preloadImages() {
    // Preload page images
    gameData.pages.forEach(page => {
        const img = new Image();
        img.src = page.leftPage.image;
    });
    
    // Preload UI images
    const uiImages = [
        'images/cover-texture.jpg',
        'images/dust.png',
        'images/stains.png',
        'images/static.png',
        'images/magnify.svg',
        'images/notes.svg',
        'images/evidence.svg'
    ];
    
    uiImages.forEach(image => {
        const img = new Image();
        img.src = image;
    });
}

// Sound functions
function playPageTurnSound() {
    pageTurnSound.currentTime = 0;
    pageTurnSound.play().catch(e => console.warn('Audio playback prevented:', e));
}

function playStaticSound() {
    staticSound.currentTime = 0;
    staticSound.volume = 0.3;
    staticSound.play().catch(e => console.warn('Audio playback prevented:', e));
}

function playClickSound() {
    clickSound.currentTime = 0;
    clickSound.volume = 0.2;
    clickSound.play().catch(e => console.warn('Audio playback prevented:', e));
}

// Debug functions
function toggleDebugPanel() {
    debugContent.style.display = debugContent.style.display === 'block' ? 'none' : 'block';
}

function updateDebugPanel() {
    if (debugCurrentPage) {
        debugCurrentPage.textContent = gameState.currentPage;
    }
    
    if (debugEvidence) {
        debugEvidence.textContent = `${gameState.evidenceFound}/${gameState.totalEvidence}`;
    }
    
    if (debugState) {
        debugState.textContent = JSON.stringify({
            currentPageIndex: gameState.currentPageIndex,
            pagesVisited: gameState.pagesVisited,
            evidenceFound: gameState.evidenceFound
        }, null, 2);
    }
}

// Initialize the game when document is ready
document.addEventListener('DOMContentLoaded', initGame);
// game.js - Main game functionality

// Game state management
const gameState = {
    currentPage: 'cover', // Start at the cover
    pagesVisited: [],
    currentPageIndex: -1,
    evidenceFound: 0,
    collectedEvidence: [],
    notes: [],
    isAnimating: false,
    totalEvidence: gameData.settings.totalEvidence,
    choices: [],
    glitchActive: false
};

// DOM Elements
const bookCover = document.getElementById('book-cover');
const book = document.querySelector('.book');
const pagesContainer = document.getElementById('pages-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const notesPanel = document.querySelector('.notes-panel');
const notesTextarea = document.getElementById('notes-textarea');
const addNoteBtn = document.getElementById('add-note-btn');
const notesContent = document.getElementById('notes-content');
const imageZoomOverlay = document.getElementById('image-zoom-overlay');
const zoomedImage = document.getElementById('zoomed-image');
const closeZoom = document.getElementById('close-zoom');
const staticOverlay = document.getElementById('static-overlay');

// Sounds
const pageTurnSound = document.getElementById('page-turn-sound');
const staticSound = document.getElementById('static-sound');
const ambientSound = document.getElementById('ambient-sound');
const clickSound = document.getElementById('click-sound');

// Debug elements
const debugToggle = document.getElementById('debug-toggle');
const debugContent = document.getElementById('debug-content');
const debugCurrentPage = document.getElementById('debug-current-page');
const debugEvidence = document.getElementById('debug-evidence');
const debugState = document.getElementById('debug-state');
const debugTriggerStatic = document.getElementById('debug-trigger-static');
const debugTriggerGlitch = document.getElementById('debug-trigger-glitch');

// Initialize the game
function initGame() {
    // Set up event listeners
    bookCover.addEventListener('click', startGame);
    prevBtn.addEventListener('click', goToPreviousPage);
    nextBtn.addEventListener('click', goToNextPage);
    notesTextarea.addEventListener('keypress', handleNotesKeypress);
    addNoteBtn.addEventListener('click', addNote);
    closeZoom.addEventListener('click', closeZoomView);
    imageZoomOverlay.addEventListener('click', closeZoomView);
    
    // Add initial notes to the notes panel
    gameData.initialNotes.forEach(note => {
        gameState.notes.push(note);
        addNoteToPanel(note);
    });
    
    // Debug panel setup
    debugToggle.addEventListener('click', toggleDebugPanel);
    debugTriggerStatic.addEventListener('click', triggerStaticEffect);
    debugTriggerGlitch.addEventListener('click', triggerGlitchEffect);
    
    // Set up static effect for static-related words
    document.addEventListener('click', event => {
        if (event.target.textContent) {
            const text = event.target.textContent.toLowerCase();
            const staticTriggerWords = gameData.settings.staticTriggerWords;
            
            if (staticTriggerWords.some(word => text.includes(word))) {
                triggerStaticEffect();
            }
        }
    });
    
    // Load initial evidence
    gameData.initialEvidence.forEach(evidence => {
        gameState.collectedEvidence.push(evidence);
    });
    
    // Preload images
    preloadImages();
    
    // Update UI
    updateEvidenceCounters();
    updateDebugPanel();
}

// Start the game when cover is clicked
function startGame() {
    book.style.display = 'block';
    bookCover.style.display = 'none';
    
    // Load the intro page
    loadPage('intro');
    
    // Start ambient sound
    ambientSound.volume = 0.3;
    ambientSound.play().catch(e => console.warn('Audio autoplay prevented:', e));
}

// Load a page by its ID
function loadPage(pageId) {
    // Find the page data
    const page = gameData.pages.find(p => p.id === pageId);
    if (!page) {
        console.error(`Page with ID "${pageId}" not found.`);
        return;
    }
    
    // Add to visited pages if this is a new page (not navigating back)
    if (gameState.currentPage !== 'cover' && !gameState.pagesVisited.includes(pageId)) {
        gameState.pagesVisited.push(pageId);
    }
    
    // Update current page
    gameState.currentPage = pageId;
    gameState.currentPageIndex = gameState.pagesVisited.indexOf(pageId);
    
    // Create the page HTML
    const pageHTML = createPageHTML(page);
    
    // Clear existing pages and add new one
    pagesContainer.innerHTML = '';
    pagesContainer.appendChild(pageHTML);
    
    // Add event listeners for interactive elements
    addPageEventListeners();
    
    // Update navigation buttons
    updateNavigationButtons();
    
    // Update debug panel
    updateDebugPanel();
}

// Create HTML for a page spread
function createPageHTML(page) {
    const paper = document.createElement('div');
    paper.className = 'paper';
    paper.id = `page-${page.id}`;
    
    // Front content (visible when page is not flipped)
    const paperContent = document.createElement('div');
    paperContent.className = 'paper-content';
    
    // Left page (image)
    const pageLeft = document.createElement('div');
    pageLeft.className = 'page-left';
    
    // Image container
    const imageContainer = document.createElement('div');
    imageContainer.className = 'page-image-container';
    
    // Magnifying glass
    const magnifyingGlass = document.createElement('div');
    magnifyingGlass.className = 'magnifying-glass';
    magnifyingGlass.title = 'Examine image';
    imageContainer.appendChild(magnifyingGlass);
    
    // Page image
    const pageImage = document.createElement('img');
    pageImage.src = page.leftPage.image;
    pageImage.alt = page.leftPage.alt;
    pageImage.className = 'page-image';
    imageContainer.appendChild(pageImage);
    
    // Evidence markers
    if (page.leftPage.evidence && page.leftPage.evidence.length > 0) {
        page.leftPage.evidence.forEach(evidence => {
            const marker = document.createElement('div');
            marker.className = 'evidence-marker';
            if (evidence.isPulsing) marker.classList.add('pulsing');
            if (gameState.collectedEvidence.some(e => e.id === evidence.id)) {
                marker.classList.add('found');
            }
            marker.style.top = evidence.position.top;
            marker.style.left = evidence.position.left;
            marker.dataset.evidenceId = evidence.id;
            imageContainer.appendChild(marker);
            
            const tooltip = document.createElement('div');
            tooltip.className = 'evidence-tooltip';
            tooltip.textContent = evidence.description;
            imageContainer.appendChild(tooltip);
        });
        
        // Evidence counter
        const evidenceCollection = document.createElement('div');
        evidenceCollection.className = 'evidence-collection';
        evidenceCollection.innerHTML = `
            <div class="evidence-icon"></div>
            <span>Evidence: <span class="evidence-count">${gameState.evidenceFound}/${gameState.totalEvidence}</span></span>
        `;
        imageContainer.appendChild(evidenceCollection);
    }
    
    pageLeft.appendChild(imageContainer);
    
    // Page number
    const leftPageNumber = document.createElement('div');
    leftPageNumber.className = 'page-number';
    leftPageNumber.textContent = (gameState.pagesVisited.length * 2) - 1;
    pageLeft.appendChild(leftPageNumber);
    
    // Right page (text and choices)
    const pageRight = document.createElement('div');
    pageRight.className = 'page-right';
    
    // Story text
    const storyText = document.createElement('div');
    storyText.className = 'story-text';
    
    // Add title if it exists
    if (page.rightPage.title) {
        const title = document.createElement('h2');
        title.textContent = page.rightPage.title;
        storyText.appendChild(title);
    }
    
    // Add content
    page.rightPage.content.forEach(item => {
        if (item.type === 'header') {
            const header = document.createElement('p');
            header.innerHTML = `<b>${item.text}</b>`;
            storyText.appendChild(header);
        } else if (item.type === 'paragraph') {
            const paragraph = document.createElement('p');
            
            // Process any special highlighted or glitch words
            let text = item.text;
            
            if (item.highlightWords) {
                item.highlightWords.forEach(word => {
                    text = text.replace(`[${word}]`, `<span class="highlightable">${word}</span>`);
                });
            } else {
                text = text.replace(/\[(.*?)\]/g, '<span class="highlightable">$1</span>');
            }
            
            if (item.glitchWords) {
                item.glitchWords.forEach(word => {
                    text = text.replace(word, `<span class="glitch-text" data-text="${word}">${word}</span>`);
                });
            }
            
            paragraph.innerHTML = text;
            storyText.appendChild(paragraph);
        } else if (item.type === 'special') {
            const special = document.createElement('p');
            special.innerHTML = item.text;
            if (item.style) {
                special.style = item.style;
            }
            
            if (item.glitchWords) {
                item.glitchWords.forEach(word => {
                    special.innerHTML = special.innerHTML.replace(word, `<span class="glitch-text" data-text="${word}">${word}</span>`);
                });
            }
            
            storyText.appendChild(special);
        }
    });
    
    pageRight.appendChild(storyText);
    
    // Choices
    if (page.rightPage.choices && page.rightPage.choices.length > 0) {
        const choices = document.createElement('div');
        choices.className = 'choices';
        
        gameState.choices = page.rightPage.choices; // Store choices for later use
        
        page.rightPage.choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'choice-btn';
            button.textContent = choice.text;
            button.dataset.choiceIndex = index;
            choices.appendChild(button);
        });
        
        pageRight.appendChild(choices);
    }
    
    // Page number
    const rightPageNumber = document.createElement('div');
    rightPageNumber.className = 'page-number';
    rightPageNumber.textContent = gameState.pagesVisited.length * 2;
    pageRight.appendChild(rightPageNumber);
    
    // Notes toggle
    const notesToggle = document.createElement('div');
    notesToggle.className = 'notes-toggle';
    notesToggle.title = 'Open investigation notes';
    pageRight.appendChild(notesToggle);
    
    // Add page decorations
    const pageStains = document.createElement('div');
    pageStains.className = 'page-stains';
    pageRight.appendChild(pageStains);
    
    const pageFold = document.createElement('div');
    pageFold.className = 'page-fold';
    pageRight.appendChild(pageFold);
    
    // Assemble the paper content
    paperContent.appendChild(pageLeft);
    paperContent.appendChild(pageRight);
    paper.appendChild(paperContent);
    
    return paper;
}

// Navigation functions
function goToPreviousPage() {
    if (gameState.isAnimating || gameState.currentPageIndex <= 0) return;
    
    playPageTurnSound();
    
    const currentPage = document.querySelector('.paper');
    currentPage.classList.add('turning-back');
    
    gameState.isAnimating = true;
    updateNavigationButtons();
    
    setTimeout(() => {
        const previousPageId = gameState.pagesVisited[gameState.currentPageIndex - 1];
        loadPage(previousPageId);
        gameState.isAnimating = false;
        updateNavigationButtons();
    }, 1500);
}

function goToNextPage() {
    if (gameState.isAnimating || gameState.currentPageIndex >= gameState.pagesVisited.length - 1) return;
    
    playPageTurnSound();
    
    const currentPage = document.querySelector('.paper');
    currentPage.classList.add('turning');
    
    gameState.isAnimating = true;
    updateNavigationButtons();
    
    setTimeout(() => {
        const nextPageId = gameState.pagesVisited[gameState.currentPageIndex + 1];
        loadPage(nextPageId);
        gameState.isAnimating = false;
        updateNavigationButtons();
    }, 1500);
}

function updateNavigationButtons() {
    // Previous button is disabled if we're at the first page or animating
    prevBtn.disabled = gameState.isAnimating || gameState.currentPageIndex <= 0;
    
    // Next button is disabled if we're at the last page or animating
    nextBtn.disabled = gameState.isAnimating || gameState.currentPageIndex >= gameState.pagesVisited.length - 1;
}

// Add event listeners for interactive elements on the current page
function addPageEventListeners() {
    // Evidence markers
    const evidenceMarkers = document.querySelectorAll('.evidence-marker');
    evidenceMarkers.forEach(marker => {
        marker.addEventListener('click', () => {
            collectEvidence(marker.dataset.evidenceId);
        });
    });
    
    // Magnifying glass
    const magnifyingGlasses = document.querySelectorAll('.magnifying-glass');
    magnifyingGlasses.forEach(glass => {
        glass.addEventListener('click', toggleMagnifyMode);
    });
    
    // Page images (for zoom)
    const pageImages = document.querySelectorAll('.page-image');
    pageImages.forEach(image => {
        image.addEventListener('click', event => {
            // Only zoom if we're in magnify mode
            if (event.target.closest('.page-image-container').classList.contains('magnify-mode')) {
                zoomImage(event.target);
            }
        });
    });
    
    // Notes toggle
    const notesToggleButtons = document.querySelectorAll('.notes-toggle');
    notesToggleButtons.forEach(button => {
        button.addEventListener('click', toggleNotesPanel);
    });
    
    // Highlightable text
    const highlightableText = document.querySelectorAll('.highlightable');
    highlightableText.forEach(text => {
        text.addEventListener('click', () => {
            text.classList.toggle('highlighted');
            playClickSound();
            
            // Add to notes if highlighted
            if (text.classList.contains('highlighted')) {
                const note = {
                    timestamp: getCurrentTimestamp(),
                    text: `Noted: "${text.textContent}"`
                };
                gameState.notes.push(note);
                addNoteToPanel(note);
            }
        });
    });
    
    // Glitch text
    const glitchTexts = document.querySelectorAll('.glitch-text');
    glitchTexts.forEach(text => {
        text.addEventListener('click', () => {
            triggerGlitchEffect();
            playStaticSound();
            
            // 50% chance to add a cryptic note
            if (Math.random() > 0.5) {
                const crypticMessages = [
                    "They're watching through the static.",
                    "The signal grows stronger when they're mentioned.",
                    "Don't look directly at the distortions.",
                    "They existed between frequencies before finding us.",
                    "The town isn't gone. It's elsewhere."
                ];
                
                const randomMessage = crypticMessages[Math.floor(Math.random() * crypticMessages.length)];
                
                const note = {
                    timestamp: getCurrentTimestamp(),
                    text: `[UNKNOWN SOURCE]: ${randomMessage}`
                };
                gameState.notes.push(note);
                addNoteToPanel(note);
            }
        });
    });
    
    // Choice buttons
    const choiceButtons = document.querySelectorAll('.choice-btn');
    choiceButtons.forEach(button => {
        button.addEventListener('click', () => {
            const choiceIndex = parseInt(button.dataset.choiceIndex);
            const nextPageId = gameState.choices[choiceIndex].nextPage;
            
            if (nextPageId) {
                // Play page turn sound
                playPageTurnSound();
                
                // Create animation effect for page turn
                const currentPaper = document.querySelector('.paper');
                currentPaper.classList.add('turning');
                
                // Disable buttons during animation
                gameState.isAnimating = true;
                updateNavigationButtons();
                
                // Load the new page after animation completes
                setTimeout(() => {
                    loadPage(nextPageId);
                    gameState.isAnimating = false;
                    updateNavigationButtons();
                }, 1500);
            }
        });
    });
}