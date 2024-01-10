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
function createRack(rackId, cellCount, isPointsRack = false) {
    const rack = document.getElementById(rackId);
    for (let i = 0; i < cellCount; i++) {
        const cell = document.createElement('div');
        cell.classList.add(isPointsRack ? 'points-rack-item' : 'rack-item');
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
createRack('points-rack', 2, true); // Points rack has only 2 cells

// Function to clear a rack and return letters to their starting place
function clearRackAndReturnLetters(rackSelector) {
    const rackCells = document.querySelectorAll(rackSelector);
    rackCells.forEach(cell => {
        while (cell.firstChild) {
            returnLetterToStartingPlace(cell.firstChild);
        }
    });
}
function clearpts(rackSelector) {
    const rackRows = document.querySelectorAll(rackSelector);
    rackRows.forEach(row => {
        row.innerHTML = ''; // This will remove all child elements in each row
    });
}
// Initialize the functionality for clearing racks and board
document.getElementById('clear-rack').addEventListener('click', () => {
    clearRackAndReturnLetters('#tile-rack .rack-item');
});
document.getElementById('clear-words').addEventListener('click', ()=>{
    clearpts('#word-0, #word-1, #pts-0, #pts-1');
})
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



// Working on the find funciton for Scrabble: 
// if the permutation is a word, calculate how many points it is
// if the number of points for that word is greater than the greatest
    // remove second greatest, add previous greatest
// if the number of points for that word is second greatest
    // remove second greatest insert new word
// print the best word to the first words rack
// print the second best word to the second words rack

let myDictionary;
let hashedDictionary; 
function findBestWords(){
    const letters = getLetters(); // gets letters from tile-rack
    console.log(letters);
    const permutations = getPermutations(letters); // makes all of the possible letter arrangements for 7 letters
    console.log(permutations);
    const words = validWords(myDictionary, permutations);
    console.log(words);
    showWords(words);
}

document.getElementById('find-rack').addEventListener('click', ()=>{
    clearpts('#word-0, #word-1, #pts-0, #pts-1');
    findBestWords();
});

function getLetters(){
    let letters = [];

    document.querySelectorAll('#tile-rack .rack-item').forEach(cell =>{
        if(cell.hasChildNodes()){
            letters.push(cell.firstChild.textContent.trim());
        }
    });
    letters = letters.map(item => item.substring(0,1));
    return letters;
}
function getPermutations(letters) {
    let result = new Set();
    
    const getSubsets = (arr) => {
        return arr.reduce((subsets,value) => subsets.concat(subsets.map(set => [value, ...set])), [[]]);
    };
    const permuteArray = (arr, m = []) => {
        if(arr.length === 0){
            result.add(m.join(''));
        } else {
            for(let i=0; i<arr.length; i++){
                let curr = arr.slice();
                let next = curr.splice(i,1);
                permuteArray(curr, m.concat(next));
            }
        }
    };
    let subsets = getSubsets(letters);
    subsets.forEach(subset => {
        if(subset.length>0) {
            permuteArray(subset);
        }
    });
    return Array.from(result);
}

function loadDictionary() {
    fetch('dictionary.txt')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(text => {
            myDictionary = text.split(/\r?\n/);
            console.log("Dictionary loaded", myDictionary);
        })
        .catch(error => {
            console.error('Error loading dictionary:', error);
        });
}
window.onload = loadDictionary;

function validWords(myDictionary, permutations){
    let result = [null, null, null, null];
    let maxScore = 0;
    let secondMaxScore = 0;
    let dictionarySet = new Set(myDictionary); 

    for (let i = 0; i < permutations.length; i++) {
        const word = permutations[i];
        if (dictionarySet.has(word)) { 
            const pts = sumWord(word);
            if(pts > maxScore){
                secondMaxScore = maxScore;
                maxScore = pts;
                result[2] = result[0];
                result[0] = word;
            } else if(pts > secondMaxScore){
                secondMaxScore = pts;
                result[2] = word;
            }
        }
    }
    result[1]=maxScore;
    result[3]=secondMaxScore;
    return result;
}

function sumWord(string){
    const points = {
        A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1,
        J: 8, K: 5, L: 1, M: 3, N: 1, O: 1, P: 3, Q: 10,
        R: 1, S: 1, T: 1, U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10
    };
    let sum = 0;
    for (let i = 0; i < string.length; i++) {
        sum += points[string.charAt(i).toUpperCase()] || 0;
    }
    if (string.length === 7) {
        sum += 50;
    }
    return sum;
}

const LETTERINFO = {
    A: [1, 9], B: [3, 2], C: [3, 2], D: [2, 4], E: [1, 12], F: [4, 2], G: [2, 3], H: [4, 2], I: [1, 9],
    J: [8, 1], K: [5, 1], L: [1, 4], M: [3, 2], N: [1, 6], O: [1, 8], P: [3, 2], Q: [10, 1],
    R: [1, 6], S: [1, 4], T: [1, 6], U: [1, 4], V: [4, 2], W: [4, 2], X: [8, 1], Y: [4, 2], Z: [10, 1]
};



function showWords(words){
    const firstWord = words[0];
    const secondWord = words[2];
    const max = words[1]; 
    const min = words[3];

    // makes the words tiles
    wordRack(firstWord,'word-0');
    wordRack(secondWord,'word-1');

    // makes the pts tiles
    ptsRack(max,'pts-0');
    ptsRack(min,'pts-1');
}

function wordRack(word, wordRowId) {
    const wordRow = document.getElementById(wordRowId);

    for (let i = 0; i < word.length; i++) {
        const letter = word[i].toUpperCase();
        const pointValue = LETTERINFO[letter] ? LETTERINFO[letter][0] : 0;

        const letterDiv = document.createElement('div');
        letterDiv.className = 'output-letter';

        const letterSpan = document.createElement('span');
        letterSpan.textContent = letter;

        const pointSpan = document.createElement('span');
        pointSpan.className = 'output-pts';
        pointSpan.textContent = pointValue;

        letterDiv.appendChild(letterSpan);
        letterDiv.appendChild(pointSpan);
        wordRow.appendChild(letterDiv);
    }
}



function ptsRack(strInt, position) {
    const ptsRow = document.getElementById(position);
    const num = parseInt(strInt, 10);  // Ensure the string is parsed as a base-10 number

    // Create the main container div
    const pointDiv = document.createElement('div');
    pointDiv.className = 'output-pts-letter';

    // Create and append the number span
    const numberSpan = document.createElement('span');
    numberSpan.textContent = isNaN(num) ? 0 : num;  // Check if num is a number, if not, default to 0
    pointDiv.appendChild(numberSpan);

    // Create and append the 'pts' span
    const ptsSpan = document.createElement('span');
    ptsSpan.className = 'pts-text';  // Corrected the way to set className
    ptsSpan.textContent = 'pts';
    pointDiv.appendChild(ptsSpan);

    // Append the pointDiv to the ptsRow
    ptsRow.appendChild(pointDiv);
}

