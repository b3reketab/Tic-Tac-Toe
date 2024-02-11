const playerOnes = [{name: 'X'}];
const playerTwos = [{name: 'O'}];

function Player(name) {
    this.name = name;
}

function addPlayerOne() {
    const plOne = document.getElementById('player-one');
    const playerOne = new Player(plOne.value);
    playerOnes.push(playerOne);
    closeInput();
}

function addPlayerTwo() {
    const plTwo = document.getElementById('player-two');
    const playerTwo = new Player(plTwo.value);
    playerTwos.push(playerTwo);
    closeInput();
}

function closeInput() {
    document.getElementById('firstForm').style.display = 'none';
    document.getElementById('secondForm').style.display = 'none';
}

function displayFirstForm() {
    document.getElementById('firstForm').style.display = 'block';
}

function displaySecondForm() {
    document.getElementById('secondForm').style.display = 'block';
}

const cell = function() {
    let value = '';
    const addMarker = (token) => { value = token};
    const getValue = () => value;
    return { addMarker, getValue };
};

const gameBoard = (function() {
    let board = [];

    for(let i = 0; i < 3; i++) {
        board[i] = [];
        for(let j = 0; j < 3; j++) {
            board[i].push(cell());
        }
    }

    const getBoard = () => board;

    const putMarker = (row, column, marker) => {
        if(board[row][column].getValue() === '') {
            board[row][column].addMarker(marker);
            return true;
        }
        return false;
    }

    return { getBoard, putMarker };
})();

const gameControl = function(playerOne, playerTwo) {
    const players = [
        { name: playerOne, token: 'X'},
        { name: playerTwo, token: 'O'}
    ];

    let activePlayer = players[0];

    const getActivePLayer = () => activePlayer;

    const switchTurn = () => activePlayer = activePlayer === players[0] ? players[1] : players[0];

    const checkWinner = () => {
        const board = gameBoard.getBoard().map(row => row.map(cell => cell.getValue()));
        let columns = [];
        let rightDiagonal = [];
        let leftDiagonal = [];

        for(let i = 0; i < 3; i++) {
            columns[i] = board.map(row => row[i]);
            for(let j = 2; j >= 0; j--) {
                if(i == 1 && j == 1) {
                    rightDiagonal.push(board[i][j]);
                    leftDiagonal.push(board[j][i]);
                } else if(i === j) {
                    rightDiagonal.push(board[i][j]);
                } else if((i + j) === 2) {
                    leftDiagonal.push(board[j][i]);
                }
            }
        }

        let win = board.concat(columns, [rightDiagonal], [leftDiagonal]).filter(row => row.every(cell => cell === 'X') || row.every(cell => cell === 'O'));

        if(win.length > 0) {
            return `${getActivePLayer().name} wins !!`;
        } else if(win.length === 0 && board.every(row => !row.includes(''))) {
            return `It's a tie !`;
        } else return false;
    };

    const playRound = (row, col) => {
        let valid = gameBoard.putMarker(row, col, activePlayer.token);       
        let result = checkWinner();

        if(result) {
            return result;   
        }

        if(valid) switchTurn();
    };

    return { playRound, checkWinner, getActivePLayer };
}

const displayController = function() {
    const boardDiv = document.getElementById('gameboard');
    const playerTurn = document.getElementById('player-turn');
    const resultNode = document.getElementById('result');
    const game = gameControl(playerOnes[playerOnes.length - 1].name, playerTwos[playerTwos.length - 1].name);
    let winner = '';
    
    const updateScreen = function() {
        const activePlayer = game.getActivePLayer();

        boardDiv.textContent = '';
        playerTurn.textContent = `${activePlayer.name}'s turn`;

        gameBoard.getBoard().forEach((item, i) => item.forEach((cell, k) => {
            const cellBtn = document.createElement('button');
            cellBtn.classList.add('cell');
            cellBtn.dataset.row = i;
            cellBtn.dataset.col = k;
            cellBtn.innerText = cell.getValue();
            boardDiv.appendChild(cellBtn);
        }));

        if(document.getElementById('start')) document.getElementById('btn').removeChild(document.getElementById('start'));

        if(winner) {
            playerTurn.textContent = '';
            resultNode.textContent = winner;

            const restartBtn = document.createElement('button');
            restartBtn.innerText = 'Restart';
            restartBtn.addEventListener('click', () => {
                resultNode.textContent = '';

                gameBoard.getBoard().forEach((item, i) => item.forEach((cell, k) => {
                    cell.addMarker('');
                }));

                document.getElementById('btn').removeChild(restartBtn);
                displayController();
            });
            document.getElementById('btn').appendChild(restartBtn);
        }
    
        boardDiv.addEventListener('click', (e) => clickHandler(e));
    };

    const clickHandler = function(e) {
        if(winner) return;

        let row = e.target.dataset.row;
        let col = e.target.dataset.col;

        winner = game.playRound(row, col);
        updateScreen();
    };
    
    updateScreen();
};