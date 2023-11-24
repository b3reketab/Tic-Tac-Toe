const plOne = document.querySelector('#name1')
const plTwo = document.querySelector('#name2')
const strtBtn = document.querySelector('.start')
const resBtn = document.querySelector('#res')

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
        if(checker) switchPlayer()   
    }

    return { playRound, getActive, getBoard: board.getBoard, switchPlayer }
}

function ScreenController() {
    const game = GameController(plOne.value, plTwo.value)
    const playerTurn = document.querySelector('.turn')
    const boarDiv = document.querySelector('.board')
    const msgDiv = document.querySelector('.msg')

    const updateScreen = () => {
        boarDiv.textContent = ''

        const board = game.getBoard()
        const activePlayer = game.getActive()
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
        });
        const valBoard = board.map(row => row.map(cell => cell.getValue()))

        const column = []
        for(let i = 0; i < 3; i++) {
            column[i] = []
            for(let j =0; j < 3; j++)
            column[i].push(valBoard[j][i])            
        }

        let i = 2
        const diagonal = []
        diagonal.push(valBoard.map((row, i) => row[i]))
        diagonal.push(valBoard.map(row => row[i--]))

        const winCol = column.filter(row => row.every(cell => cell === 'X') || row.every(cell => cell === 'O'))

        const winDiag = diagonal.filter(row => row.every(cell => cell === 'X') || row.every(cell => cell === 'O'))

        const winRow = valBoard.filter(row => row.every(cell => cell === 'X') || row.every(cell => cell === 'O'))

        const tiendicator = valBoard.filter(row => row.every(cell => cell !== ''))

        if(winCol.length || winRow.length || winDiag.length) {
            game.switchPlayer()
            const winner = game.getActive()
            msgDiv.textContent = `${winner.name} won!!!`
            playerTurn.textContent = ''
        } else if(tiendicator.length === 3) {
            msgDiv.textContent = 'Its a tie!!!';
            playerTurn.textContent = ''
        }
    }
    function clickHandler(e) {
        if(msgDiv.textContent) return

        const selectedCol = e.target.dataset.column
        const selectedRow = e.target.dataset.row

        game.playRound(selectedRow, selectedCol)
        updateScreen()
    }

    boarDiv.addEventListener('click', clickHandler)
    updateScreen()
}

let i = 0

strtBtn.addEventListener('click', () => {
    i == 0 ? ScreenController() : document.location.reload()
    i++
})