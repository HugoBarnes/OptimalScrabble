// Create grid cells
const board = document.getElementById('board');
for (let i = 0; i < 225; i++) {
    const cell = document.createElement('div');
    cell.classList.add('grid-item');
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





