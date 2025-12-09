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
        image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        description: 'Frutas frescas'
    },
    arte: {
        name: 'Arte',
        image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
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
    showCategorySelection();
};

// --- Lógica de Selección de Categoría ---
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

// --- Lógica del Menú de Accesibilidad ---
function toggleMenu() {
    const isHidden = accMenuPanel.classList.contains('hidden');
    if (isHidden) {
        accMenuPanel.classList.remove('hidden');
        accMenuBtn.setAttribute('aria-expanded', 'true');
        // Poner foco en el primer elemento del menú
        document.getElementById('contrast-toggle').focus();
    } else {
        closeMenu();
    }
}

function closeMenu() {
    accMenuPanel.classList.add('hidden');
    accMenuBtn.setAttribute('aria-expanded', 'false');
    accMenuBtn.focus(); // Devolver foco al botón
}

// Cerrar menú al presionar Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !accMenuPanel.classList.contains('hidden')) {
        closeMenu();
    }
});

// Cerrar menú si se hace clic fuera
document.addEventListener('click', (e) => {
    if (!accMenuPanel.contains(e.target) && e.target !== accMenuBtn) {
        accMenuPanel.classList.add('hidden');
        accMenuBtn.setAttribute('aria-expanded', 'false');
    }
});

function changeGridSize(size) {
    gridSize = parseInt(size);
    totalPieces = gridSize * gridSize;

    // Actualizar CSS Grid dinámicamente
    boardElement.style.gridTemplateColumns = `repeat(${gridSize}, var(--piece-size))`;
    boardElement.style.gridTemplateRows = `repeat(${gridSize}, var(--piece-size))`;

    startGame();
    announce(`Tamaño del tablero cambiado a ${gridSize} por ${gridSize}. Juego reiniciado.`);
}

function startGame() {
    // Reiniciar variables
    pieces = [];
    selectedPieceIndex = null;
    moves = 0;
    seconds = 0;
    movesDisplay.innerText = `Movimientos: 0`;
    winMessage.style.display = 'none';
    boardElement.style.border = "none";
    stopTimer();
    if (isTimerActive) startTimer();

    // Generar orden inicial correcto
    let initialOrder = Array.from({ length: totalPieces }, (_, i) => i);

    // Barajar
    for (let i = initialOrder.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [initialOrder[i], initialOrder[j]] = [initialOrder[j], initialOrder[i]];
    }

    // Limpiar tablero
    boardElement.innerHTML = '';

    // Asegurar columnas correctas si primera carga
    boardElement.style.gridTemplateColumns = `repeat(${gridSize}, var(--piece-size))`;
    boardElement.style.gridTemplateRows = `repeat(${gridSize}, var(--piece-size))`;

    // Crear piezas
    initialOrder.forEach((originalIndex, currentIndex) => {
        createPiece(originalIndex, currentIndex);
    });

    announce(`Juego nuevo de ${gridSize} por ${gridSize} iniciado.`);
}

function createPiece(originalIndex, currentIndex) {
    const piece = document.createElement('div');
    piece.className = 'puzzle-piece';
    piece.id = `piece-${currentIndex}`;

    piece.setAttribute('role', 'button');
    piece.setAttribute('tabindex', '0');
    piece.setAttribute('aria-label', `Pieza en posición ${currentIndex + 1}. Contenido: Parte ${originalIndex + 1}.`);

    // Usar imagen de la categoría seleccionada
    if (selectedCategory && categories[selectedCategory]) {
        piece.style.backgroundImage = `url('${categories[selectedCategory].image}')`;
    }

    // Calcular posición del background image
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

    boardElement.appendChild(piece);
    pieces.push(piece);
}

function handleInteraction(index) {
    if (winMessage.style.display === 'block') return;

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

function swapPieces(indexA, indexB) {
    const domPieceA = document.querySelector(`[data-current="${indexA}"]`);
    const domPieceB = document.querySelector(`[data-current="${indexB}"]`);

    // Intercambiar backgroundPosition
    const tempBg = domPieceA.style.backgroundPosition;
    domPieceA.style.backgroundPosition = domPieceB.style.backgroundPosition;
    domPieceB.style.backgroundPosition = tempBg;

    // Intercambiar data-original
    const tempOriginal = domPieceA.dataset.original;
    domPieceA.dataset.original = domPieceB.dataset.original;
    domPieceB.dataset.original = tempOriginal;

    // Accesibilidad
    domPieceA.setAttribute('aria-label', `Pieza en posición ${parseInt(indexA) + 1}. Contenido: Parte ${parseInt(domPieceA.dataset.original) + 1}.`);
    domPieceB.setAttribute('aria-label', `Pieza en posición ${parseInt(indexB) + 1}. Contenido: Parte ${parseInt(domPieceB.dataset.original) + 1}.`);

    announce(`Piezas intercambiadas.`);
}

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
        winMessage.style.display = 'block';
        announce("¡Felicidades! Has completado el rompecabezas correctamente.");
        boardElement.style.border = "5px solid #28a745";
    }
}

// --- Utilidades ---
function toggleTimer() {
    const btn = document.getElementById('timer-toggle');
    isTimerActive = !isTimerActive;

    if (isTimerActive) {
        startTimer();
        btn.innerText = "Activado";
        btn.setAttribute('aria-pressed', 'true');
    } else {
        stopTimer();
        btn.innerText = "Pausado";
        btn.setAttribute('aria-pressed', 'false');
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

function toggleContrast() {
    document.body.classList.toggle('high-contrast');
    const isHigh = document.body.classList.contains('high-contrast');

    const btn = document.getElementById('contrast-toggle');
    btn.innerText = isHigh ? "Activado" : "Desactivado";
    btn.setAttribute('aria-pressed', isHigh.toString());

    announce(isHigh ? "Modo alto contraste activado" : "Modo alto contraste desactivado");
}

function announce(text) {
    if (announcer) {
        announcer.innerText = text;
        setTimeout(() => { announcer.innerText = '' }, 1000);
    }
}
