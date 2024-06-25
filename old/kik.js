// initializing game & basic functions

const board = document.getElementById('board');
const resetButton = document.getElementById('resetBtn');
const cells = Array.from({ length: 9 }, (_, i) => i + 1);

let clickable = true;
let clickedCells = 0;
let currentPlayer = 'X';

let localMulti = false;

let difficultyEasy = true;

// tablica zawierająca stan gry
let cellState = Array(9).fill('');

function resetCanvas()
{
    board.innerHTML = "";
    resetButton.style.visibility = "hidden";

    const startSingleBtn = document.createElement('button');
    startSingleBtn.onclick = function(){startGame(false, true)};
    startSingleBtn.innerText = "Graj z komputerem - ŁATWY";
    board.appendChild(startSingleBtn);

    const startSingleHard = document.createElement('button');
    startSingleHard.onclick = function(){startGame(false, false)};
    startSingleHard.innerText = "Graj z komputerem - TRUDNY";
    board.appendChild(startSingleHard);

    const startLocalMulti = document.createElement('button');
    startLocalMulti.onclick = function(){startGame(true)};
    startLocalMulti.innerText = "Graj z drugim graczem";
    board.appendChild(startLocalMulti);
}

function checkWinner() {
    const winningPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (const pattern of winningPatterns) {
        const [a, b, c] = pattern;
        if (cellState[a] && cellState[a] === cellState[b] && cellState[a] === cellState[c]) {
            return true; // We have a winner!
        }
    }

    return false; // No winner yet
}

function handleCellClick(index) {
    if (!clickable) return;
    const cell = document.getElementById(`cell-${index}`);
    if (!cell.textContent) {
        cell.textContent = currentPlayer;
        cellState[index] = currentPlayer;
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        clickedCells += 1;
        // Check for a winner after each move
        if (checkWinner()) {
            alert(`Gracz ${currentPlayer === 'X' ? 'O' : 'X'} wygrywa!`);
            clickable = false;
            resetButton.style.visibility = "visible";
        }
        else
        {
            if (clickedCells < 9)
            {
                if (!localMulti && difficultyEasy) calculateComputerMoveEasy();
                else if (!localMulti) calculateComputerMoveHard();
            }
            if (clickedCells > 5) {
                resetButton.style.visibility = "visible";
            }
        }
    }
}

function startGame(localMultiplayer = false, easyMode = false) {
    clickable = true;
    clickedCells = 0;
    resetButton.style.visibility = "hidden";
    currentPlayer = 'X';
    cellState = Array(9).fill('');

    localMulti = localMultiplayer;
    difficultyEasy = easyMode;

    board.innerHTML = "";
    cells.forEach((_, index) => {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.id = `cell-${index}`;
        cell.addEventListener('click', () => handleCellClick(index));
        board.appendChild(cell);
    });
}

resetCanvas();

// sztuczna inteligencja komputera

function calculateComputerMoveEasy()
{
    let computerHasClicked = false;

    let index = -1;

    while (index == -1)
    {
        let randomInt = Math.floor(Math.random() * 9);
        console.log(randomInt);
        var cell = document.getElementById(`cell-${randomInt}`);

        if (!cell.textContent)
        {
            index = randomInt;
        }
    }

    var cell = document.getElementById(`cell-${index}`);

    if (!cell.textContent)
        {
            computerHasClicked = true;
            cell.textContent = currentPlayer;
            cellState[index] = currentPlayer;
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            clickedCells += 1;
            // Check for a winner after each move
            if (checkWinner()) {
                alert(`Komputer wygrywa!`);
                clickable = false;
                resetButton.style.visibility = "visible";
            }
            else
            {
                if (clickedCells > 5) {
                    resetButton.style.visibility = "visible";
                }
            }
        }


}

// teraz ta trudna część
function evaluateBoard(state, player) {

    for (let i = 0; i < 9; i += 3) {
        if (state[i] === player && state[i + 1] === player && state[i + 2] === player) {
            return player === 'O' ? 10 : -10;
        }
    }

    for (let i = 0; i < 3; i++) {
        if (state[i] === player && state[i + 3] === player && state[i + 6] === player) {
            return player === 'O' ? 10 : -10;
        }
    }

    if ((state[0] === player && state[4] === player && state[8] === player) ||
        (state[2] === player && state[4] === player && state[6] === player)) {
        return player === 'O' ? 10 : -10;
    }

    if (!state.includes('')) {
        return 0;
    }

    return 0;
}

function minimax(state, depth, isMaximizingPlayer) {
    const currentPlayer = 'O';

    const score = evaluateBoard(state, currentPlayer);

    if (score === 10 || score === -10) {
        return score;
    }

    if (!state.includes('')) {
        return 0;
    }

    // Przeszukaj dostępne ruchy
    const availableMoves = state.reduce((acc, val, index) => {
        if ((val != "X") && (val != "O")) {
            acc.push(index);
        }
        return acc;
    }, []);

    let bestMove;
    let bestScore = isMaximizingPlayer ? -Infinity : Infinity;

    for (const move of availableMoves) {
        const newState = [...state];
        newState[move] = currentPlayer;

        const moveScore = minimax(newState, depth + 1, !isMaximizingPlayer);

        if (isMaximizingPlayer) {
            if (moveScore > bestScore) {
                bestScore = moveScore;
                bestMove = move;
            }
        } else {
            if (moveScore < bestScore) {
                bestScore = moveScore;
                bestMove = move;
            }
        }
    }

    return depth === 0 ? bestMove : bestScore;
}

function calculateComputerMoveHard()
{
    const bestMove = minimax(cellState, 0, true);
    var cell = document.getElementById(`cell-${bestMove}`);

    computerHasClicked = true;
    cell.textContent = currentPlayer;
    cellState[bestMove] = currentPlayer;
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    clickedCells += 1;
    // Check for a winner after each move
    if (checkWinner()) {
        alert(`Komputer wygrywa!`);
        clickable = false;
        resetButton.style.visibility = "visible";
    }
    else
    {
        if (clickedCells > 5) {
            resetButton.style.visibility = "visible";
        }
    }
}