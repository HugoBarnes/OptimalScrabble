// Function to return a letter to its starting place
function returnLetterToStartingPlace(letter) {
    const containerId = 'letter' + letter.id.charAt(0).toUpperCase();
    const letterContainer = document.getElementById(containerId);
    if (letterContainer) {
        letterContainer.appendChild(letter);
    }
}

// Function to add right-click functionality to a letter
function addRightClickFunctionality(letter) {
    letter.addEventListener('contextmenu', event => {
        event.preventDefault(); 
        returnLetterToStartingPlace(letter);
    });
}

// Function to create a generic rack with a given ID
function createRack(rackId, cellCount) {
    const rack = document.getElementById(rackId);
    for (let i = 0; i < cellCount; i++) {
        const cell = document.createElement('div');
        cell.classList.add('rack-item');
        cell.setAttribute('id', `${rackId}-cell-${i}`);
        rack.appendChild(cell);
    }
}

// Initialize dragging for letters
function initializeLetterDragging() {
    const letters = document.querySelectorAll('.letter');
    letters.forEach(letter => {
        letter.setAttribute('draggable', 'true');
        letter.addEventListener('dragstart', event => {
            event.dataTransfer.setData("text", event.target.id);
        });
        addRightClickFunctionality(letter);
    });
}

// Initialize the tile rack with drag-and-drop functionality
createRack('tile-rack', 7);
const tileRackCells = document.querySelectorAll('#tile-rack .rack-item');
tileRackCells.forEach(cell => {
    cell.addEventListener('dragover', event => event.preventDefault());
    cell.addEventListener('drop', event => {
        event.preventDefault();
        if (!cell.hasChildNodes()) {
            const data = event.dataTransfer.getData("text");
            const draggableElement = document.getElementById(data);
            cell.appendChild(draggableElement);
        }
    });
});

// Initialize additional racks without drag-and-drop functionality
createRack('words-rack-1', 7);
createRack('words-rack-2', 7);
createRack('points-rack', 2); // Points rack has only 2 cells

// Function to clear a rack and return letters to their starting place
function clearRackAndReturnLetters(rackSelector) {
    const rackCells = document.querySelectorAll(rackSelector);
    rackCells.forEach(cell => {
        while (cell.firstChild) {
            returnLetterToStartingPlace(cell.firstChild);
        }
    });
}

// Initialize the functionality for clearing racks and board
document.getElementById('clear-rack').addEventListener('click', () => {
    clearRackAndReturnLetters('#tile-rack .rack-item');
});
document.getElementById('clear-board').addEventListener('click', () => {
    clearRackAndReturnLetters('#board .grid-item');
});

// Initialize the scrabble board
const board = document.getElementById('board');
for (let i = 0; i < 225; i++) {
    const cell = document.createElement('div');
    cell.classList.add('grid-item');
    // Add special classes based on cell index
    if ([0, 7, 14, 105, 119, 210, 217, 224].includes(i)) {
        cell.classList.add('triple-word');
    }
    if ([3, 11, 36, 38, 45, 52, 59, 92, 96, 98, 102, 108, 116, 122, 126, 128, 132, 165, 172, 179, 186, 188, 213, 221].includes(i)) {
        cell.classList.add('double-letter');
    }
    if ([16, 28, 32, 42, 48, 56, 64, 70, 154, 160, 168, 176, 182, 192, 196, 208, 221].includes(i)) {
        cell.classList.add('double-word');
    }
    if ([20, 24, 76, 80, 84, 88, 136, 140, 144, 148, 200, 204].includes(i)) {
        cell.classList.add('triple-letter');
    }
    if (i == 112) {
        cell.classList.add('start-square');
    }
    // Add drag and drop functionality
    cell.addEventListener('dragover', event => event.preventDefault());
    cell.addEventListener('drop', event => {
        event.preventDefault();
        if (!cell.hasChildNodes()) {
            const data = event.dataTransfer.getData("text");
            const draggableElement = document.getElementById(data);
            cell.appendChild(draggableElement);
        }
    });
    board.appendChild(cell);
}

// Enable dragging for letters
initializeLetterDragging();
