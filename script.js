const plOne = document.querySelector('#name1')
const plTwo = document.querySelector('#name2')
const strtBtn = document.querySelector('.start')

function Gameboard() {
    const board = []
    for(let i = 0; i < 3; i++) {
        board[i] = []
        for(let j = 0; j < 3; j++) {
            board[i].push(Cell())
        }
    }
    const getBoard = () => board
    const setValue = (row, column, token) => {
        if(board[row][column].getValue() === '') {
            board[row][column].addToken(token)
            return true
        }
    }
    return { getBoard, setValue }
}

function Cell() {
    let value = ''
    const addToken = (token) => {
        value = token
    }
    const getValue = () => value
    return { getValue, addToken }
}

function GameController(a, b) {
    const board = Gameboard()
    const player = [{
            name: a || 'X',
            token: 'X',
        }, {
            name: b || 'O',
            token: 'O',
        }]
    let activePlayer = player[0]
    const getActive = () => activePlayer
    const switchPlayer = () => getActive() === player[0] 
                                    ? activePlayer = player[1] 
                                    : activePlayer = player[0]   
    const playRound = (row, column) => {
        const checker = board.setValue(row, column, getActive().token)
        const valBoard = board.getBoard().map(row => row.map(cell => cell.getValue()))
        let diagcol = []
        diagcol[3] = []
        diagcol[4] = []
        for(let i = 0; i < 3; i++) {
            diagcol[i] = []
            for(let j = 2; j >= 0; j--) {
                diagcol[i].push(valBoard[j][i])
                if(i === j) diagcol[3].push(valBoard[i][j])
                diagcol[4].push(valBoard[i][j])
            }  
        }
        const winFill = valBoard.concat(diagcol).filter(row => row.every(cell => cell === 'X') || row.every(cell => cell === 'O'))
        if(winFill.length) {
            return `${getActive().name} wins!!`
        } else if(!valBoard.filter(row => row.includes('')).length) {
            return `It's a tie!`
        }
        if(checker) switchPlayer()   
    }
    return { playRound, getActive, getBoard: board.getBoard }
}

function ScreenController() {
    const game = GameController(plOne.value, plTwo.value)
    const playerTurn = document.querySelector('.turn')
    const boarDiv = document.querySelector('.board')
    const result = document.querySelector('.msg')
    let winner = ''
    const updateScreen = () => {
        const board = game.getBoard()
        const activePlayer = game.getActive()
        boarDiv.textContent = ''
        playerTurn.textContent = `${activePlayer.name}'s turn...`
        board.forEach((row, index) => {
            row.forEach((cell, indx) => {
                const cellBtn = document.createElement('button')
                cellBtn.classList.add('cell')
                cellBtn.dataset.column = indx
                cellBtn.dataset.row = index
                cellBtn.textContent = cell.getValue()
                boarDiv.appendChild(cellBtn)
            })
        })
        boarDiv.addEventListener('click', (e) => {
            if(winner) {
                playerTurn.textContent = ''
                result.textContent = winner
            } else {
                clickHandler(e)
            }
        })
    }
    const clickHandler = (e) => {
        const selectedCol = e.target.dataset.column
        const selectedRow = e.target.dataset.row
        winner = game.playRound(selectedRow, selectedCol)
        updateScreen()
    }
    updateScreen()
}
let i = 0
strtBtn.addEventListener('click', () => {
    i === 0 ? ScreenController() : document.location.reload()
    i++
})