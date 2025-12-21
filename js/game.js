// Configuración del juego
let gridSize = 3; // Tamaño por defecto: 3x3
let totalPieces = gridSize * gridSize;
let pieces = [];
let selectedPieceIndex = null;
let moves = 0;
let timerInterval;
let seconds = 0;
let isTimerActive = true;

// Categorías de imágenes
const categories = {
    animales: {
        name: 'Animales',
        image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        description: 'León majestuoso'
    },
    paisajes: {
        name: 'Paisajes',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        description: 'Montañas nevadas'
    },
    comida: {
        name: 'Comida',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Frutas frescas'
    },
    arte: {
        name: 'Arte',
        image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Arte abstracto colorido'
    }
};

let selectedCategory = null;

const boardElement = document.getElementById('board');
const timerDisplay = document.getElementById('timer-display');
const movesDisplay = document.getElementById('moves-display');
const announcer = document.getElementById('announcer');
const winMessage = document.getElementById('win-message');
const accMenuPanel = document.getElementById('acc-menu-panel');
const accMenuBtn = document.getElementById('acc-menu-btn');

// Inicializar juego al cargar
window.onload = function () {
    // Restaurar preferencias accesibilidad
    const savedColorBlindness = localStorage.getItem('colorBlindnessMode') || 'normal';
    if (savedColorBlindness !== 'normal') {
        changeColorBlindnessMode(savedColorBlindness);
        changeColorBlindnessMode(savedColorBlindness);
        // Sincronizar selector
        const cbSelect = document.getElementById('color-blindness-select');
        if (cbSelect) cbSelect.value = savedColorBlindness;
    }

    showCategorySelection();
};

// --- Menú de Daltonismo ---
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

// --- Selección de Categoría ---
function showCategorySelection() {
    const categorySection = document.getElementById('category-selection');
    const gameSection = document.getElementById('game-section');

    categorySection.style.display = 'block';
    gameSection.style.display = 'none';
}

function selectCategory(categoryKey) {
    selectedCategory = categoryKey;

    const categorySection = document.getElementById('category-selection');
    const gameSection = document.getElementById('game-section');

    categorySection.style.display = 'none';
    gameSection.style.display = 'block';

    announce(`Categoría ${categories[categoryKey].name} seleccionada. Iniciando juego.`);
    startGame();
}

// --- Menú de Accesibilidad ---
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

let currentFocusedIndex = 0;
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !accMenuPanel.classList.contains('hidden')) {
        closeMenu();
        return;
    }

    const gameSection = document.getElementById('game-section');
    if (gameSection.style.display === 'none') return;

    let newIndex = currentFocusedIndex;
    let moved = false;
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        newIndex = currentFocusedIndex - gridSize;
        moved = true;
    } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        newIndex = currentFocusedIndex + gridSize;
        moved = true;
    } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        newIndex = currentFocusedIndex - 1;
        moved = true;
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        newIndex = currentFocusedIndex + 1;
        moved = true;
    }

    if (moved && newIndex >= 0 && newIndex < totalPieces) {
        if ((e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') &&
            Math.floor(currentFocusedIndex / gridSize) !== Math.floor(newIndex / gridSize)) {
            return;
        }
        if ((e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') &&
            Math.floor(currentFocusedIndex / gridSize) !== Math.floor(newIndex / gridSize)) {
            return;
        }

        currentFocusedIndex = newIndex;
        const targetPiece = document.querySelector(`[data-current="${newIndex}"]`);
        if (targetPiece) {
            targetPiece.focus();
            announce(`Navegando a pieza en posición ${newIndex + 1}`);
        }
    }
});

document.addEventListener('click', (e) => {
    if (!accMenuPanel.contains(e.target) && e.target !== accMenuBtn) {
        accMenuPanel.classList.add('hidden');
        accMenuBtn.setAttribute('aria-expanded', 'false');
    }
});

function changeGridSize(size) {
    gridSize = parseInt(size);
    totalPieces = gridSize * gridSize;
    boardElement.style.gridTemplateColumns = `repeat(${gridSize}, var(--piece-size))`;
    boardElement.style.gridTemplateRows = `repeat(${gridSize}, var(--piece-size))`;
    startGame();
    announce(`Tamaño del tablero cambiado a ${gridSize} por ${gridSize}. Juego reiniciado.`);
}

// Inicia o reinicia el juego, mezclando las piezas y reseteando estado
function startGame() {
    pieces = [];
    selectedPieceIndex = null;
    moves = 0;
    seconds = 0;
    movesDisplay.innerText = `Movimientos: 0`;
    winMessage.classList.add('hidden');
    winMessage.style.display = '';
    boardElement.style.border = "none";
    boardElement.style.border = "none";
    stopTimer();
    isTimerActive = true;
    startTimer();
    const timerBtn = document.getElementById('timer-toggle');
    if (timerBtn) {
        timerBtn.innerText = "Pausar";
        timerBtn.setAttribute('aria-pressed', 'false');
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

    announce(`Juego nuevo de ${gridSize} por ${gridSize} iniciado.`);
}

// Crea un elemento visual para una pieza del rompecabezas
function createPiece(originalIndex, currentIndex) {
    const piece = document.createElement('div');
    piece.className = 'puzzle-piece';
    piece.id = `piece-${currentIndex}`;

    piece.setAttribute('role', 'button');
    piece.setAttribute('tabindex', '0');
    piece.setAttribute('aria-label', `Pieza en posición ${currentIndex + 1}. Contenido: Parte ${originalIndex + 1}.`);

    if (selectedCategory && categories[selectedCategory]) {
        piece.style.backgroundImage = `url('${categories[selectedCategory].image}')`;
    }
    const row = Math.floor(originalIndex / gridSize);
    const col = originalIndex % gridSize;

    const xPos = (col / (gridSize - 1)) * 100;
    const yPos = (row / (gridSize - 1)) * 100;

    piece.style.backgroundPosition = `${xPos}% ${yPos}%`;

    const sizePercent = gridSize * 100;
    piece.style.backgroundSize = `${sizePercent}% ${sizePercent}%`;

    piece.dataset.current = currentIndex;
    piece.dataset.original = originalIndex;

    piece.addEventListener('click', () => handleInteraction(currentIndex));
    piece.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleInteraction(currentIndex);
        }
    });

    piece.addEventListener('focus', () => {
        currentFocusedIndex = currentIndex;
    });

    boardElement.appendChild(piece);
    pieces.push(piece);
}

// Maneja la interacción (clic o teclado) con una pieza
function handleInteraction(index) {
    if (!winMessage.classList.contains('hidden')) return;
    if (!isTimerActive) {
        announce("El juego está pausado. Reanuda para continuar.");
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
        movesDisplay.innerText = `Movimientos: ${moves}`;

        checkWin();
    }
}

// Intercambia la posición de dos piezas en el tablero
function swapPieces(indexA, indexB) {
    const domPieceA = document.querySelector(`[data-current="${indexA}"]`);
    const domPieceB = document.querySelector(`[data-current="${indexB}"]`);

    const tempBg = domPieceA.style.backgroundPosition;
    domPieceA.style.backgroundPosition = domPieceB.style.backgroundPosition;
    domPieceB.style.backgroundPosition = tempBg;
    const tempOriginal = domPieceA.dataset.original;
    domPieceA.dataset.original = domPieceB.dataset.original;
    domPieceB.dataset.original = tempOriginal;

    domPieceA.setAttribute('aria-label', `Pieza en posición ${parseInt(indexA) + 1}. Contenido: Parte ${parseInt(domPieceA.dataset.original) + 1}.`);
    domPieceB.setAttribute('aria-label', `Pieza en posición ${parseInt(indexB) + 1}. Contenido: Parte ${parseInt(domPieceB.dataset.original) + 1}.`);

    announce(`Piezas intercambiadas.`);
}

// Verifica si todas las piezas están en su posición original
function checkWin() {
    let correctCount = 0;
    const currentPieces = document.querySelectorAll('.puzzle-piece');

    currentPieces.forEach(piece => {
        if (piece.dataset.current == piece.dataset.original) {
            correctCount++;
            piece.classList.add('correct-position');
        } else {
            piece.classList.remove('correct-position');
        }
    });

    if (correctCount === totalPieces) {
        stopTimer();
        winMessage.classList.remove('hidden');
        announce("¡Felicidades! Has completado el rompecabezas correctamente.");
        boardElement.style.border = "5px solid #28a745";
    }
}

// --- Utilidades ---
// Alterna el estado de pausa del temporizador
function toggleTimer() {
    const btn = document.getElementById('timer-toggle');
    isTimerActive = !isTimerActive;

    if (isTimerActive) {
        startTimer();
        if (btn) btn.innerText = "Pausar";
        if (btn) btn.setAttribute('aria-pressed', 'false');
        announce("Juego reanudado");
        boardElement.classList.remove('opacity-50', 'pointer-events-none');
    } else {
        stopTimer();
        if (btn) btn.innerText = "Reanudar";
        if (btn) btn.setAttribute('aria-pressed', 'true');
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
        timerDisplay.innerText = `Tiempo: ${mins}:${secs}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

// --- Lógica del Menú de Dificultad ---
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

// Cerrar menús al hacer clic fuera
document.addEventListener('click', (e) => {
    // Accesibilidad
    if (accMenuPanel && !accMenuPanel.contains(e.target) && e.target !== accMenuBtn && !accMenuBtn.contains(e.target)) {
        accMenuPanel.classList.add('hidden');
        if (accMenuBtn) accMenuBtn.setAttribute('aria-expanded', 'false');
    }
    // Dificultad
    if (diffMenuPanel && !diffMenuPanel.contains(e.target) && e.target !== diffMenuBtn && !diffMenuBtn.contains(e.target)) {
        closeDifficultyMenu();
    }
    // Daltonismo
    if (typeof cbMenuPanel !== 'undefined' && cbMenuPanel && !cbMenuPanel.contains(e.target) && e.target !== cbMenuBtn && !cbMenuBtn.contains(e.target)) {
        closeCBMenu();
    }
});


function changeGridSize(size) {
    gridSize = parseInt(size);
    totalPieces = gridSize * gridSize;
    const btnText = document.getElementById('difficulty-selected-text');
    if (btnText) {
        if (size == 3) btnText.innerText = "Fácil (3x3)";
        if (size == 4) btnText.innerText = "Media (4x4)";
        if (size == 5) btnText.innerText = "Difícil (5x5)";
    }
    closeDifficultyMenu();
    boardElement.style.gridTemplateColumns = `repeat(${gridSize}, var(--piece-size))`;
    boardElement.style.gridTemplateRows = `repeat(${gridSize}, var(--piece-size))`;

    startGame();
    announce(`Tamaño del tablero cambiado a ${gridSize} por ${gridSize}. Juego reiniciado.`);
}


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

    announce(isHigh ? "Modo alto contraste activado" : "Modo alto contraste desactivado");
}

function announce(text) {
    if (announcer) {
        announcer.innerText = text;
        setTimeout(() => { announcer.innerText = '' }, 1000);
    }
}
