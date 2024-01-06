// Create grid cells
const board = document.getElementById('board');
for (let i = 0; i < 225; i++) {
    const cell = document.createElement('div');
    cell.classList.add('grid-item');
    if(i== 0 || i==7 || i== 14 || i==105 || i==119 || i==210 || i== 217 || i==224){
        cell.classList.add('triple-word');
    }
    if(i== 3 || i==11 || i== 36 || i== 38 || i==45 || i==52 || i== 59 || i==92
        || i== 96 || i== 98 || i==102 || i== 108 || i==116 || i== 122|| i== 126|| i== 128 
        || i== 132|| i== 165 || i== 172|| i== 179|| i== 186|| i== 188|| i== 213|| i== 221){
        cell.classList.add('double-letter');
    }
    if(i== 16 || i==28 || i== 32 || i== 42 || i==48 || i==56 || i== 64 || i==70
        || i== 154|| i== 160|| i== 168|| i== 176|| i== 182|| i== 192|| i== 196|| i== 208||
         i== 221){
        cell.classList.add('double-word');
    }
    if(i== 20 || i==24 || i== 76 || i==80 || i==84 || i==88 || i== 136 || i==140
        || i==144 || i==148 || i==200 || i==204){
        cell.classList.add('triple-letter');
    }
    if(i==112){
        cell.classList.add('start-square')
    }

    
    cell.addEventListener('dragover', event => event.preventDefault());
    cell.addEventListener('drop', event => {
        event.preventDefault();
        if (!cell.hasChildNodes()) { // Check if cell is empty
            const data = event.dataTransfer.getData("text");
            const draggableElement = document.getElementById(data);
            cell.appendChild(draggableElement);
        }
    });
    board.appendChild(cell);
}

// Get the letters section div by its ID
const lettersSection = document.getElementById('letters-section');

// Add dragstart event listener to each letter
const letters = document.querySelectorAll('.letter');
letters.forEach(letter => {
    letter.addEventListener('dragstart', event => {
        event.dataTransfer.setData("text", event.target.id);
    });

    // Add contextmenu (right-click) event listener to each letter
    letter.addEventListener('contextmenu', event => {
        event.preventDefault(); // Prevent the default context menu

        const letterId = event.target.id;
        const draggableElement = document.getElementById(letterId);

        if (draggableElement && draggableElement.classList.contains('letter')) {
            // Get the first character of the letter ID and construct the container ID
            const containerId = 'letter' + letterId.charAt(0).toUpperCase();
            const letterContainer = document.getElementById(containerId);

            if (letterContainer) {
                letterContainer.appendChild(draggableElement);
            }
        }
    });
});

// Add dragover event listener to allow dropping in the letters section
lettersSection.addEventListener('dragover', event => {
    event.preventDefault(); // Necessary to allow dropping
});

// Add drop event listener to the letters section
lettersSection.addEventListener('drop', event => {
    event.preventDefault();
    const letterId = event.dataTransfer.getData("text");
    const draggableElement = document.getElementById(letterId);

    if (draggableElement && draggableElement.classList.contains('letter')) {
        // Get the first character of the letter ID and construct the container ID
        const containerId = 'letter' + letterId.charAt(0).toUpperCase();
        const letterContainer = document.getElementById(containerId);

        if (letterContainer) {
            letterContainer.appendChild(draggableElement);
        }
    }
});
// Set up the tile rack
const tileRack = document.getElementById('tile-rack');
for (let i = 0; i < 7; i++) {
    const cell = document.createElement('div');
    cell.classList.add('rack-item');
    cell.setAttribute('id', `rack-cell-${i}`); // Set a unique ID for each cell

    cell.addEventListener('dragover', event => event.preventDefault());
    cell.addEventListener('drop', event => {
        event.preventDefault();
        if (!cell.hasChildNodes()) { // Check if cell is empty
            const data = event.dataTransfer.getData("text");
            const draggableElement = document.getElementById(data);
            cell.appendChild(draggableElement);
        }
    });

    // Add right-click functionality to return letter to original position
    cell.addEventListener('contextmenu', event => {
        event.preventDefault();
        if (cell.hasChildNodes()) {
            const letter = cell.firstChild;
            const originalParentId = 'letter' + letter.id.charAt(0).toUpperCase(); // Assuming your letter IDs are set up like this
            const originalParent = document.getElementById(originalParentId);
            originalParent.appendChild(letter);
        }
    });

    tileRack.appendChild(cell);
}

// Enable dragging for letters
letters.forEach(letter => {
    letter.setAttribute('draggable', 'true');
    letter.addEventListener('dragstart', event => {
        event.dataTransfer.setData("text", event.target.id);
    });
});




