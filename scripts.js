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



// Working on the find funciton for Scrabble: 


// We need to capture all of the letters on the letter-rack

function getLettersFromRack(){
    const letters = [];

    document.querySelectorAll('#tile-rack .rack-item').forEach(cell =>{
        if(cell.hasChildNodes()){
            letters.push(cell.firstChild.textContent.trim());
        }
    });
    return letters;
}
// TEST: GET LETTERS

function testGetLettersFromRack(){
    const letters = getLettersFromRack();
    console.log("Letters on the rack: ", letters);
}
//document.getElementById('test-get-letters').addEventListener('click', testGetLettersFromRack);
//  WORKS: returns array: 

// Create every permutation of those letters.

function createPermutations(letters) {
    // Strip away the numbers: B3 --> B
    const fixed = letters.map(item => item.substring(0, 1));

    function generatePermutations(arr, permutation = '') {
        let result = [];

        if (arr.length === 0) {
            result.push(permutation);
        } else {
            for (let i = 0; i < arr.length; i++) {
                let current = arr.slice();
                let next = current.splice(i, 1);
                result = result.concat(generatePermutations(current, permutation + next));
            }
        }

        return result;
    }

    return generatePermutations(fixed);
}


// TEST GET PERMUTATIONS:

function testPermutationsFromRack(){
    const letters= getLettersFromRack();
    let out = createPermutations(letters);
    console.log("Permutations of Letters From Rack: ", out);
}

document.getElementById('test-get-letters').addEventListener('click', testPermutationsFromRack);

// check each permutation of those letters in the dictionary
// 7*6*5*4*3*2 each going into a list 18,000 long

// CREATE DICTIONARY: 

let myDictionary = [];  // This will hold the dictionary words
let hashedDictionary = new Set();  // This will hold the hashed dictionary

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
            console.log("Dictionary loaded", myDictionary); // Log when the dictionary is loaded
            
            // Hash the dictionary after loading
            myDictionary.forEach(word => {
                hashedDictionary.add(hash(word));
            });
        })
        .catch(error => {
            console.error('Error loading dictionary:', error);
        });
}

window.onload = loadDictionary;

// HASH DICTIONARY:
function hash(string){
    let hash = 0;
    for(let i=0; i<string.length; i++){
        const char = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |=0;
    }
    return hash;
}

// create a string array of size 2. 

function checkPermutations(permutations) {
    const bestWords = [null, null]; // Array to hold the two best words
    let max = -Infinity; // Initialize to negative infinity
    let secondMax = -Infinity; // Second highest score

    permutations.forEach(word => {
        let hashedWord = hash(word);
        if (hashedDictionary.has(hashedWord)) {
            let pts = wordPoints(word);
            if (pts > max) {
                secondMax = max; // Update second highest score
                max = pts; // Update highest score
                bestWords[1] = bestWords[0]; // Move the best word to second place
                bestWords[0] = word; // Set the new best word
            } else if (pts > secondMax) {
                secondMax = pts; // Update second highest score
                bestWords[1] = word; // Set the new second best word
            }
        }
    });
    return bestWords;
}

function wordPoints(word) {
    const points = {
        A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1,
        J: 8, K: 5, L: 1, M: 3, N: 1, O: 1, P: 3, Q: 10,
        R: 1, S: 1, T: 1, U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10
    };
    let sum = 0;
    for (let i = 0; i < word.length; i++) {
        sum += points[word.charAt(i).toUpperCase()] || 0;
    }
    if (word.length === 7) {
        sum += 50; // Bonus for 7-letter words
    }
    return sum;
}

function processRackAndGetBestWords(){
    const letters = getLettersFromRack();
    console.log("Letters on the rack ", letters);

    const permutations = createPermutations(letters);
    console.log("Generated Permutations", permutations);

    const best = checkPermutations(permutations);
    console.log("Best Scoring Words ", best);
}

document.getElementById('find-rack').addEventListener('click', processRackAndGetBestWords);


// if the permutation is a word, calculate how many points it is

// if the number of points for that word is greater than the greatest
    // remove second greatest, add previous greatest
// if the number of points for that word is second greatest
    // remove second greatest insert new word

// print the best word to the first words rack

// print the second best word to the second words rack