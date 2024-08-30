//Game Board Module
const gameBoard = (function() {
    
    const board = [];
    
    function initBoard() {
        for (let i = 0; i < 9; i++) {
            board[i] = 0;
        };
        console.log(board);
    };

    function addMark(playerMark, boardIndex) {
        if(!board[boardIndex]) {
            board.splice(boardIndex, 1, playerMark);
            return 'cell_marked';
        } else return 'cell_occupied';
    };

    function getBoardState() {
        return board.slice();
    };

    function isBoardFull() {
        return !board.includes(0);
    };

    return {
        addMark,
        getBoardState,
        initBoard,
        isBoardFull,
    };

})();

//Player Module
const playerModule = (function() {

    //Player object
    const players = {
        player_1: {
            keyName: 'player_1',
            name: 'Player 1',
            markType: 'X',
            markValue: -1,
            wins: 0,
            loss: 0,
            draws: 0,
        },

        player_2: {
            keyName: 'player_2',
            name: 'Player 2',
            markType: 'O',
            markValue: 1,
            wins: 0,
            loss: 0,
            draws: 0,
        },
    };

    const setName = function(playerKey, newName) {
        players[playerKey].name = newName;
    };

    const getPlayer = function(playerKey) {
        return { ...players[playerKey]};
    };

    const winScoreRecord = function(winningPlayer) {
        winnerKey = winningPlayer.keyName;
        loserKey = winningPlayer.keyName === players.player_1.keyName ? 
                                             players.player_2.keyName : 
                                             players.player_1.keyName;
        players[winnerKey].wins++;
        players[loserKey].loss++;
    };

    const drawsRecord = function() {
        players.player_1.draws++;
        players.player_2.draws++;
    };

    const resetScore = function() {
        players.player_1.wins = 0;
        players.player_1.loss = 0;
        players.player_1.draws = 0;
        players.player_2.wins = 0;
        players.player_2.loss = 0;
        players.player_2.draws = 0;
    };

    return {
        setName,
        getPlayer,
        winScoreRecord,
        drawsRecord,
        resetScore,
    };
})();

//Game Controller Module
const gameController = (function() {


    let player1;
    let player2;
    let maxRounds = 5;
    let currentRound = 0;
    let currentTurn = 1;
    let currentPlayer;
    let winPattern;
    let startPlayer;
    let winConditions = {
        row1: [0, 1, 2],
        row2: [3, 4, 5],
        row3: [6, 7, 8],
        column1: [0, 3, 6],
        column2: [1, 4, 7],
        column3: [2, 5, 8],
        diagonal1: [0, 4, 8],
        diagonal2: [2, 4, 6]
    };

    const updatePlayers = function() {
        player1 = playerModule.getPlayer('player_1');
        player2 = playerModule.getPlayer('player_2');
    };

//Will determine the starting player if based on argument or if empty randomly selects the starting player.
    const startingPlayer = function() {
        if(!startPlayer) {
            if(Math.random() < 0.5) {
                currentPlayer = player1;
            } else {
                currentPlayer = player2;
            }
        } else {
            currentPlayer = startPlayer;
        };
    };

    function playGame() {
        playerModule.resetScore();
        currentRound = 0;
        roundInitiator();
    }

    function roundInitiator() {
        displayController.nextRoundDisabler(roundInitiator);
        updatePlayers();
        currentRound++;
        gameBoard.initBoard();
        displayController.renderBoard();
        displayController.enableBoard();
        startingPlayer();
        currentTurn = 1;
        winStatus = undefined;
        displayController.updateRoundTextBox(`Round ${currentRound}`);
        displayController.updateMessageBox(`Current Turn: ${currentPlayer.name}`);
    };
    
    const turnInitiator = function() {
            currentPlayer = (currentPlayer === player1) ? player2 : player1;
            displayController.updateMessageBox(`Current Turn: ${currentPlayer.name}`);
    };

    const playerMove = function(cell, Element) {
        if (currentRound <= maxRounds) {
        if(gameBoard.addMark(currentPlayer.markValue, cell) === 'cell_marked') {
            displayController.updateCell(Element, currentPlayer.markType);
            winCheck();
        } else return displayController.updateMessageBox('Cell Is Already Marked');
        } else return displayController.updateMessageBox('Game Has Ended. Start New Game');
    };

    const winCheck = function() {
        const winValue = (currentPlayer.markValue * 3);
        const winCombinations = winConditions;
        const board = gameBoard.getBoardState();

        for (const key in winCombinations) {
            if (winCombinations.hasOwnProperty(key)) {
                let boardValue = 0;
                const winCombo = winCombinations[key];
                for (i = 0; i < winCombo.length; i++) {
                    const indexNum = winCombo[i];
                    boardValue += board[indexNum];
                };
                if (boardValue === winValue) {
                    winPattern = key;
                    winAction();
                    return;
                };
            };
        };

        if (gameBoard.isBoardFull()) {
            drawHandler();
        } else {
            currentTurn++;
            turnInitiator();
        };

    };

    const nextRound = function () {
        if (currentRound < maxRounds) {
            displayController.nextRoundButtonActivator(roundInitiator);
        } else {
            console.log(overallWinnerCheck()); // once game ends give option to reset
        };
        displayController.disableBoard();
    };

    const drawHandler = function() {
        playerModule.drawsRecord();
        displayController.updateMessageBox(`Round ${currentRound} is a Draw`); // text update function here
        nextRound();
    };

    const winAction = function() {
        playerModule.winScoreRecord(currentPlayer);
        displayController.updateMessageBox(`${currentPlayer.name} Wins Round: ${currentRound}.`); //call function to update the text
        nextRound();
    };

    const overallWinnerCheck = function() {
        updatePlayers();
        if (player1.wins === player2.wins) {
            return 'It\'s a Draw'; // add a function to update the message box
        };
        if (player1.wins > player2.wins) {
            return `Player: ${player1.name} Wins with ${player1.wins} Wins`;
        } else return `Player: ${player2.name} Wins with ${player2.wins} Wins`;
    };

    const quitGame = function() {
        gameBoard.resetScore();
        currentRound = 1;
    };

    return {
        playerMove,
        playGame,
        quitGame,
    };

})();

const displayController = (function() {
    let titleContainer = document.querySelector('.title-ctn');
    let gameContainer = document.querySelector('.game-ctn');
    let startButton = document.querySelector('[data-btn="start-btn"]');
    let playerNameInputs = document.querySelectorAll('input.player-name');
    let gameBoardElement = document.querySelector('#game-board-ctn');
    let messageBox = document.querySelector('#msg-box');
    const roundTextBox = document.querySelector('.round-indicator');
    const nextRoundBtn = document.querySelector('#next-round');
    const resetBtn = document.querySelector('#reset');
    
    startButton.addEventListener('click', function startGame() {
        let startPlayer;
        updateNames(playerNameInputs);
        gameController.playGame(startPlayer);
        toggleDisplay();
        startButton.removeEventListener('click', startGame);
    });

    const enableBoard = function() {
        gameBoardElement.addEventListener('click', markCell);
    };

    const disableBoard = function() {
        gameBoardElement.removeEventListener('click', markCell);
    };

    const nextRoundButtonActivator = function(func) {
        nextRoundBtn.classList.remove('disable-btn');
        nextRoundBtn.addEventListener('click', func);
    };

    const nextRoundDisabler = function(func) {
        nextRoundBtn.classList.add('disable-btn');
        nextRoundBtn.removeEventListener('click', func);
    };

    let updateNames = function(inputElements) {
      for (input of inputElements) {
        if(input.value) {
            playerModule.setName(input.name, input.value);
        };
      };
    };

    const toggleDisplay = function () {
        titleContainer.classList.toggle('hidden-ctn');
        gameContainer.classList.toggle('hidden-ctn');
    };

    const markCell = function(e) {
        const targetElement = e.target;
        if (targetElement.getAttribute('data-type') === 'cell') {
            const cellNum = targetElement.getAttribute('data-cell-num');
            gameController.playerMove(cellNum, targetElement) === 'cellMarked';
        };
    };

    const updateCell = function(cellElement, mark) {
        cellElement.textContent = mark;
    };

    const updateMessageBox = function(message) {
        messageBox.textContent = message;
    };

    const updateRoundTextBox = function(message) {
        roundTextBox.textContent = message;
    };

    const renderBoard = function() {
        const boardArray = gameBoard.getBoardState();
        const valueRef = {
            '1': 'O',
            '-1': 'X'
        };

        for (let i = 0; i < boardArray.length; i++) {
            const currentCell = gameBoardElement.querySelector(`[data-cell-num="${i}"`);
            const markType = valueRef[boardArray[i].toString()];
            if (!!markType) {
                currentCell.textContent = markType;
            } else currentCell.textContent = '';
        };
    };

    return {
        updateCell,
        updateMessageBox,
        renderBoard,
        nextRoundButtonActivator,
        nextRoundDisabler,
        enableBoard,
        disableBoard,
        updateRoundTextBox,
    };

})(); 



//Initializer
addEventListener('DOMContentLoaded', () => {
    gameBoard.initBoard();
});


// win pattern game play for testing
// let drawArray = [0, 1, 2, 4, 3, 5, 7, 6, 8,   // Draw Combination 1
//     0, 1, 2, 3, 4, 6, 5, 8, 7,   // Draw Combination 2
//     0, 1, 2, 4, 3, 5, 7, 6, 8,   // Draw Combination 1
//     0, 1, 2, 3, 4, 6, 5, 8, 7, 
//     0, 1, 2, 5, 3, 4, 6, 8, 7,   // Draw Combination 1
//     0, 1, 2, 3, 4, 6, 5, 8, 7, 
// ];   // Draw Combination 4
   

// gameController.playGame();
// for (let i = 0; i < drawArray.length; i++) {
//     gameController.playerMove(drawArray[i]);
// }