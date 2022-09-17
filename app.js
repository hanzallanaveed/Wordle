const tileContainer = document.querySelector('.tile-container');
const keyContainer = document.querySelector('.key-container');
const messageContainer = document.querySelector('.message-container');

let wordle;

const getWordle = () => {
    fetch('http://localhost:8000/word')
    .then(response => response.json())
    .then(json => {
        console.log(json);
        wordle = json.toUpperCase();
    })
    .catch(err => console.log(err));
}

getWordle();

const keys = [
    'Q',
    'W',
    'E',
    'R',
    'T',
    'Y',
    'U',
    'I',
    'O',
    'P',
    'A',
    'S',
    'D',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'ENTER',
    'Z',
    'X',
    'C',
    'V',
    'B',
    'N',
    'M',
    '«',
];

const guessArrays = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
];

let currentRow = 0;
let currentTile = 0;
let isGameOver = false;

keys.forEach(key => {
    const button = document.createElement('button');

    button.textContent = key;

    button.setAttribute('id', key);

    button.addEventListener('click', () => { handleClick(key) });

    keyContainer.append(button);
});

guessArrays.forEach((array, index) => {
    const row = document.createElement('div');

    row.setAttribute('id', 'row-' + index);

    array.forEach((guess, guessIndex) => {
        const tile = document.createElement('div');

        tile.setAttribute('id', 'row-' + index + '-tile-' + guessIndex);

        tile.classList.add('tile');

        row.append(tile);
    });

    tileContainer.append(row);
});

const handleClick = (letter) => {
    if (letter === '«') {
        deleteLetter();
        return;
    }

    if (letter === 'ENTER') {
        checkRow();
        return;
    }

    if (currentTile < 5 && currentRow < 6) {
        addLetter(letter);
    }
}

const addLetter = (letter) => {
    const tile = document.getElementById('row-' + currentRow + '-tile-' + currentTile);

    tile.textContent = letter;

    guessArrays[currentRow][currentTile] = letter;

    tile.setAttribute('data', letter);

    currentTile++;
}

const deleteLetter = () => {
    if (currentTile > 0) {
        currentTile--;

        const tile = document.getElementById('row-' + currentRow + '-tile-' + currentTile);

        tile.textContent = '';

        guessArrays[currentRow][currentTile] = '';

        tile.setAttribute('data', '');
    }
}

const checkRow = () => {
    const guess = guessArrays[currentRow].join('');

    if (currentTile > 4) {
        flipTile();
        if (wordle == guess) {
            if (currentRow == 0) {
                showMessage('Congratulations! You have guessed the word correctly in ' + (currentRow + 1) + ' try!');
            } else {
                showMessage('Congratulations! You have guessed the word correctly in ' + (currentRow + 1) + ' tries!');
            }
            isGameOver = true;
            return;
        } else {
            if (currentRow >= 5) {
                isGameOver = true;
                showMessage('Sorry! You were not able to guess the word! The word was ' + wordle);
            }

            if (currentRow < 5) {
                currentRow++;
                currentTile = 0;
            }
        }
    }
}

const showMessage = (message) => {
    const messageText = document.createElement('p');

    messageText.textContent = message;

    messageContainer.append(messageText);

    setTimeout(() => messageContainer.removeChild(messageText), 5000);
}

const colorToKey = (letter, color) => {
    const key = document.getElementById(letter);

    key.classList.add(color);
}

const flipTile = () => {
    const rowTiles = document.querySelector('#row-' + currentRow).childNodes;

    let checkWordle = wordle;

    const guess = [];

    rowTiles.forEach(tile => {
        guess.push({ letter: tile.getAttribute('data'), color: 'grey-overlay' });
    });

    guess.forEach((guess, index) => {
        if (guess.letter == wordle[index]) {
            guess.color = 'green-overlay';
            checkWordle = checkWordle.replace(guess.letter, '');
        }
    });

    guess.forEach(guess => {
        if (checkWordle.includes(guess.letter)) {
            guess.color = 'yellow-overlay';
            checkWordle = checkWordle.replace(guess.letter, '');
        }
    });

    rowTiles.forEach((tile, index) => {
        setTimeout(() => {
            tile.classList.add('flip');
            tile.classList.add(guess[index].color);
            colorToKey(guess[index].letter, guess[index].color);
        }, 500 * index)
    })
}

