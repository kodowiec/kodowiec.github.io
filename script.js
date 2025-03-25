let globalData;

function generateBingoCard() {
    const lettermap = [ 'B', 'I', 'N', 'G', 'O' ];

    const table = document.createElement('table');
    table.id = 'bingo-table';

    const header = table.createTHead();
    const headerRow = header.insertRow();
    'BINGO'.split('').forEach(letter => {
        const th = document.createElement('th');
        th.textContent = letter;
        headerRow.appendChild(th);
    });

    for (let row = 0; row < 5; row++) {
        const tableRow = table.insertRow();
        for (let col = 0; col < 5; col++) {
            const cell = tableRow.insertCell();
            const letter = lettermap[col];
            const numbers = globalData[letter];
            const randomIndex = Math.floor(Math.random() * numbers.length);
            const number = numbers[randomIndex].Z;
            globalData[letter] = numbers.filter((_, index) => index !== randomIndex);
            cell.textContent = number;
            cell.addEventListener('click', () => cell.classList.add('selected'));
        }
    }

    return table;
}

document.addEventListener('DOMContentLoaded', () => {
    fetch('assets/data.json')
    .then(response => response.json())
    .then(data => {
        globalData = data;
        const bingoContainer = document.getElementById('bingo-card');
        const card = generateBingoCard();
        bingoContainer.appendChild(card);
    })
    .catch(error => {
        console.error('Error loading data:', error);
    });
});
