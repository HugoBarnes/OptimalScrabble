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

// Make letters draggable
const letters = document.querySelectorAll('.letter');
letters.forEach(letter => {
    letter.addEventListener('dragstart', event => {
        event.dataTransfer.setData("text", event.target.id);
    });
});

