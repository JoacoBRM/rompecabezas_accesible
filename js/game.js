// Game configuration
let gridSize = 3;
let totalPieces = gridSize * gridSize;
let pieces = [];
let selectedPieceIndex = null;
let moves = 0;
let timerInterval;
let seconds = 0;
let isTimerActive = true;

const categories = {
    animales: {
        name: 'Animales',
        image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=85',
        description: 'León majestuoso'
    },
    paisajes: {
        name: 'Paisajes',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=85',
        description: 'Montañas nevadas'
    },
    comida: {
        name: 'Comida',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=85',
        description: 'Frutas frescas'
    },
    arte: {
        name: 'Arte',
        image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=85',
        description: 'Arte abstracto colorido'
    },
    oceano: {
        name: 'Océano',
        image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=85',
        description: 'Tortuga marina'
    },
    ciudad: {
        name: 'Ciudad',
        image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=85',
        description: 'Horizonte urbano'
    },
    espacio: {
        name: 'Espacio',
        image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=85',
        description: 'Galaxia infinita'
    },
    bosque: {
        name: 'Bosque',
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=85',
        description: 'Bosque encantado'
    }
};

let selectedCategory = null;

const boardElement = document.getElementById('board');
const announcer = document.getElementById('announcer');
const winMessage = document.getElementById('win-message');
const accMenuPanel = document.getElementById('acc-menu-panel');
const accMenuBtn = document.getElementById('acc-menu-btn');

window.onload = function () {
    const savedColorBlindness = localStorage.getItem('colorBlindnessMode') || 'normal';
    if (savedColorBlindness !== 'normal') {
        changeColorBlindnessMode(savedColorBlindness);
    }
    showCategorySelection();
};

// --- Color Blindness Menu ---
const cbMenuPanel = document.getElementById('cb-menu-panel');
const cbMenuBtn = document.getElementById('cb-menu-btn');

function toggleCBMenu() {
    const isHidden = cbMenuPanel.classList.contains('hidden');
    if (isHidden) {
        cbMenuPanel.classList.remove('hidden');
        cbMenuBtn.setAttribute('aria-expanded', 'true');
    } else {
        closeCBMenu();
    }
}

function closeCBMenu() {
    if (cbMenuPanel) {
        cbMenuPanel.classList.add('hidden');
        cbMenuBtn.setAttribute('aria-expanded', 'false');
    }
}

function changeColorBlindnessMode(mode) {
    document.body.classList.remove('cb-protanopia', 'cb-deuteranopia', 'cb-tritanopia', 'cb-achromatopsia');
    if (mode !== 'normal') {
        document.body.classList.add(`cb-${mode}`);
        announce(`Modo de daltonismo activado: ${mode}`);
    } else {
        announce("Modo de daltonismo desactivado");
    }
    localStorage.setItem('colorBlindnessMode', mode);
    const btnText = document.getElementById('cb-selected-text');
    if (btnText) {
        const labels = {
            'normal': 'Normal',
            'protanopia': 'Protanopía (Rojo)',
            'deuteranopia': 'Deuteranopía (Verde)',
            'tritanopia': 'Tritanopía (Azul)',
            'achromatopsia': 'Acromatopsia (Grises)'
        };
        btnText.innerText = labels[mode] || 'Normal';
    }
    closeCBMenu();
}

// --- Category Selection ---
function showCategorySelection() {
    document.getElementById('category-selection').style.display = 'flex';
    document.getElementById('game-section').style.display = 'none';
}

function selectCategory(categoryKey) {
    selectedCategory = categoryKey;
    document.getElementById('category-selection').style.display = 'none';
    document.getElementById('game-section').style.display = 'block';
    announce(`Categoría ${categories[categoryKey].name} seleccionada. Iniciando juego.`);
    startGame();
}

// --- Accessibility Menu ---
function toggleMenu() {
    const isHidden = accMenuPanel.classList.contains('hidden');
    if (isHidden) {
        accMenuPanel.classList.remove('hidden');
        accMenuBtn.setAttribute('aria-expanded', 'true');
        document.getElementById('contrast-toggle').focus();
    } else {
        closeMenu();
    }
}

function closeMenu() {
    accMenuPanel.classList.add('hidden');
    accMenuBtn.setAttribute('aria-expanded', 'false');
    accMenuBtn.focus();
}

// --- Keyboard Navigation ---
let currentFocusedIndex = 0;
document.addEventListener('keydown', (e) => {
    if (!winMessage.classList.contains('hidden') && e.key === 'Enter') {
        e.preventDefault();
        startGame();
        return;
    }
    if (e.key === 'Escape' && !accMenuPanel.classList.contains('hidden')) {
        closeMenu();
        return;
    }
    const gameSection = document.getElementById('game-section');
    if (gameSection.style.display === 'none') return;

    let newIndex = currentFocusedIndex;
    let moved = false;
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault(); newIndex = currentFocusedIndex - gridSize; moved = true;
    } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault(); newIndex = currentFocusedIndex + gridSize; moved = true;
    } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault(); newIndex = currentFocusedIndex - 1; moved = true;
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault(); newIndex = currentFocusedIndex + 1; moved = true;
    }

    if (moved && newIndex >= 0 && newIndex < totalPieces) {
        if ((e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') &&
            Math.floor(currentFocusedIndex / gridSize) !== Math.floor(newIndex / gridSize)) return;
        if ((e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') &&
            Math.floor(currentFocusedIndex / gridSize) !== Math.floor(newIndex / gridSize)) return;

        currentFocusedIndex = newIndex;
        const targetPiece = document.querySelector(`[data-current="${newIndex}"]`);
        if (targetPiece) {
            targetPiece.focus();
            announce(`Posición ${newIndex + 1}`);
        }
    }
});

// --- Close menus on outside click ---
document.addEventListener('click', (e) => {
    if (accMenuPanel && !accMenuPanel.contains(e.target) && e.target !== accMenuBtn && !accMenuBtn.contains(e.target)) {
        accMenuPanel.classList.add('hidden');
        if (accMenuBtn) accMenuBtn.setAttribute('aria-expanded', 'false');
    }
    if (typeof diffMenuPanel !== 'undefined' && diffMenuPanel && !diffMenuPanel.contains(e.target) && e.target !== diffMenuBtn && !diffMenuBtn.contains(e.target)) {
        closeDifficultyMenu();
    }
    if (typeof cbMenuPanel !== 'undefined' && cbMenuPanel && !cbMenuPanel.contains(e.target) && e.target !== cbMenuBtn && !cbMenuBtn.contains(e.target)) {
        closeCBMenu();
    }
});

// --- Game Logic ---
function startGame() {
    pieces = [];
    selectedPieceIndex = null;
    moves = 0;

    const movesValue = document.getElementById('moves-value');
    if (movesValue) movesValue.innerText = '0';
    const timerValue = document.getElementById('timer-value');
    if (timerValue) timerValue.innerText = '00:00';

    winMessage.classList.add('hidden');
    winMessage.style.display = '';
    boardElement.style.border = 'none';
    stopTimer();
    seconds = 0;
    isTimerActive = true;
    startTimer();

    const timerBtn = document.getElementById('timer-toggle');
    if (timerBtn) {
        const lbl = timerBtn.querySelector('.btn-label');
        if (lbl) lbl.innerText = 'Pausar';
        timerBtn.setAttribute('aria-pressed', 'false');
        timerBtn.setAttribute('aria-label', 'Pausar juego');
    }

    let initialOrder = Array.from({ length: totalPieces }, (_, i) => i);
    for (let i = initialOrder.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [initialOrder[i], initialOrder[j]] = [initialOrder[j], initialOrder[i]];
    }

    boardElement.innerHTML = '';
    boardElement.style.gridTemplateColumns = `repeat(${gridSize}, var(--piece-size))`;
    boardElement.style.gridTemplateRows = `repeat(${gridSize}, var(--piece-size))`;
    initialOrder.forEach((originalIndex, currentIndex) => {
        createPiece(originalIndex, currentIndex);
    });

    announce(`Nuevo juego ${gridSize}×${gridSize} iniciado.`);
}

function createPiece(originalIndex, currentIndex) {
    const piece = document.createElement('div');
    piece.className = 'puzzle-piece';
    piece.id = `piece-${currentIndex}`;
    piece.setAttribute('role', 'button');
    piece.setAttribute('tabindex', '0');
    piece.setAttribute('aria-label', `Pieza ${currentIndex + 1}. Parte ${originalIndex + 1}.`);

    if (selectedCategory && categories[selectedCategory]) {
        piece.style.backgroundImage = `url('${categories[selectedCategory].image}')`;
    }
    const row = Math.floor(originalIndex / gridSize);
    const col = originalIndex % gridSize;
    const xPos = gridSize > 1 ? (col / (gridSize - 1)) * 100 : 0;
    const yPos = gridSize > 1 ? (row / (gridSize - 1)) * 100 : 0;
    piece.style.backgroundPosition = `${xPos}% ${yPos}%`;
    piece.style.backgroundSize = `${gridSize * 100}% ${gridSize * 100}%`;
    piece.dataset.current = currentIndex;
    piece.dataset.original = originalIndex;

    piece.addEventListener('click', () => handleInteraction(currentIndex));
    piece.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleInteraction(currentIndex);
        }
    });
    piece.addEventListener('focus', () => { currentFocusedIndex = currentIndex; });

    boardElement.appendChild(piece);
    pieces.push(piece);
}

function handleInteraction(index) {
    if (!winMessage.classList.contains('hidden')) return;
    if (!isTimerActive) {
        announce("Juego pausado. Reanuda para continuar.");
        return;
    }

    const clickedPiece = document.querySelector(`[data-current="${index}"]`);

    if (selectedPieceIndex === null) {
        selectedPieceIndex = index;
        clickedPiece.classList.add('selected');
        announce(`Pieza seleccionada.`);
    } else if (selectedPieceIndex === index) {
        clickedPiece.classList.remove('selected');
        selectedPieceIndex = null;
        announce(`Selección cancelada.`);
    } else {
        swapPieces(selectedPieceIndex, index);
        document.querySelector(`[data-current="${selectedPieceIndex}"]`).classList.remove('selected');
        selectedPieceIndex = null;
        moves++;
        const movesValue = document.getElementById('moves-value');
        if (movesValue) movesValue.innerText = moves;
        checkWin();
    }
}

function swapPieces(indexA, indexB) {
    const domPieceA = document.querySelector(`[data-current="${indexA}"]`);
    const domPieceB = document.querySelector(`[data-current="${indexB}"]`);

    const tempBg = domPieceA.style.backgroundPosition;
    domPieceA.style.backgroundPosition = domPieceB.style.backgroundPosition;
    domPieceB.style.backgroundPosition = tempBg;

    const tempOriginal = domPieceA.dataset.original;
    domPieceA.dataset.original = domPieceB.dataset.original;
    domPieceB.dataset.original = tempOriginal;

    domPieceA.setAttribute('aria-label', `Pieza ${parseInt(indexA) + 1}. Parte ${parseInt(domPieceA.dataset.original) + 1}.`);
    domPieceB.setAttribute('aria-label', `Pieza ${parseInt(indexB) + 1}. Parte ${parseInt(domPieceB.dataset.original) + 1}.`);

    domPieceA.classList.add('swapping');
    domPieceB.classList.add('swapping');
    setTimeout(() => {
        domPieceA.classList.remove('swapping');
        domPieceB.classList.remove('swapping');
    }, 300);

    announce(`Piezas intercambiadas.`);
}

function checkWin() {
    let correctCount = 0;
    document.querySelectorAll('.puzzle-piece').forEach(piece => {
        if (piece.dataset.current == piece.dataset.original) {
            correctCount++;
            piece.classList.add('correct-position');
        } else {
            piece.classList.remove('correct-position');
        }
    });

    if (correctCount === totalPieces) {
        stopTimer();
        isTimerActive = false;
        boardElement.style.border = '4px solid #10b981';
        boardElement.style.boxShadow = '0 0 40px rgba(16, 185, 129, 0.4)';

        setTimeout(() => {
            const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
            const secs = (seconds % 60).toString().padStart(2, '0');
            const modalTime = document.getElementById('modal-time');
            const modalMoves = document.getElementById('modal-moves');
            const modalCategory = document.getElementById('modal-category');
            if (modalTime) modalTime.innerText = `${mins}:${secs}`;
            if (modalMoves) modalMoves.innerText = moves;
            if (modalCategory && selectedCategory) modalCategory.innerText = categories[selectedCategory].name;

            winMessage.classList.remove('hidden');
            announce('¡Felicidades! Has completado el rompecabezas.');
            const restartBtn = winMessage.querySelector('button');
            if (restartBtn) restartBtn.focus();
        }, 500);
    }
}

// --- Timer ---
function toggleTimer() {
    const btn = document.getElementById('timer-toggle');
    isTimerActive = !isTimerActive;

    if (isTimerActive) {
        startTimer();
        if (btn) {
            const lbl = btn.querySelector('.btn-label');
            if (lbl) lbl.innerText = 'Pausar';
            btn.setAttribute('aria-pressed', 'false');
            btn.setAttribute('aria-label', 'Pausar juego');
        }
        announce("Juego reanudado");
        boardElement.classList.remove('opacity-50', 'pointer-events-none');
    } else {
        stopTimer();
        if (btn) {
            const lbl = btn.querySelector('.btn-label');
            if (lbl) lbl.innerText = 'Reanudar';
            btn.setAttribute('aria-pressed', 'true');
            btn.setAttribute('aria-label', 'Reanudar juego');
        }
        announce("Juego pausado");
        boardElement.classList.add('opacity-50', 'pointer-events-none');
    }
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        seconds++;
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        const timerValue = document.getElementById('timer-value');
        if (timerValue) timerValue.innerText = `${mins}:${secs}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

// --- Difficulty Menu ---
const diffMenuPanel = document.getElementById('difficulty-menu-panel');
const diffMenuBtn = document.getElementById('difficulty-menu-btn');

function toggleDifficultyMenu() {
    const isHidden = diffMenuPanel.classList.contains('hidden');
    if (isHidden) {
        diffMenuPanel.classList.remove('hidden');
        diffMenuBtn.setAttribute('aria-expanded', 'true');
    } else {
        closeDifficultyMenu();
    }
}

function closeDifficultyMenu() {
    if (diffMenuPanel) {
        diffMenuPanel.classList.add('hidden');
        diffMenuBtn.setAttribute('aria-expanded', 'false');
    }
}

function changeGridSize(size) {
    gridSize = parseInt(size);
    totalPieces = gridSize * gridSize;
    const btnText = document.getElementById('difficulty-selected-text');
    if (btnText) {
        const labels = { 3: 'Fácil (3×3)', 4: 'Media (4×4)', 5: 'Difícil (5×5)' };
        btnText.innerText = labels[size] || `${size}×${size}`;
    }
    closeDifficultyMenu();
    boardElement.style.gridTemplateColumns = `repeat(${gridSize}, var(--piece-size))`;
    boardElement.style.gridTemplateRows = `repeat(${gridSize}, var(--piece-size))`;
    startGame();
    announce(`Tablero ${gridSize}×${gridSize}. Juego reiniciado.`);
}

// --- Contrast ---
function toggleContrast() {
    document.body.classList.toggle('high-contrast');
    const isHigh = document.body.classList.contains('high-contrast');
    const btn = document.getElementById('contrast-toggle');
    const knob = btn.querySelector('span[aria-hidden="true"]');
    btn.setAttribute('aria-checked', isHigh.toString());

    if (isHigh) {
        btn.classList.remove('bg-slate-200');
        btn.classList.add('bg-indigo-600');
        knob.classList.add('translate-x-5');
        knob.classList.remove('translate-x-0');
    } else {
        btn.classList.add('bg-slate-200');
        btn.classList.remove('bg-indigo-600');
        knob.classList.add('translate-x-0');
        knob.classList.remove('translate-x-5');
    }
    announce(isHigh ? "Alto contraste activado" : "Alto contraste desactivado");
}

function announce(text) {
    if (announcer) {
        announcer.innerText = text;
        setTimeout(() => { announcer.innerText = ''; }, 1000);
    }
}
