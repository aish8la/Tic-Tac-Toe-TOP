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
            mark: 'O',
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
    const startingPlayer = function(player) {
        if(!player) {
            if(Math.random() < 0.5) {
                currentPlayer = player1;
            } else {
                currentPlayer = player2;
            }
        } else {
            currentPlayer = player;
        };
    };

    const playGame = function(player) {
        playerModule.resetScore();
        currentRound = 0;
        roundInitiator(player);
    };

    const roundInitiator = function(player) {
        updatePlayers();
        currentRound++;
        if (currentRound <= maxRounds) {
            gameBoard.initBoard();
            startingPlayer(player);
            currentTurn = 1;
            winStatus = undefined;
            console.log(`Round ${currentRound}`); // round text updater function
            //remove old event listeners and attach new event listener to cells here        
        } else {
            // remove event listeners 
            console.log(overallWinnerCheck()); // once game ends give option to reset
        };
       
    };
    
    const turnInitiator = function() {
            currentPlayer = (currentPlayer === player1) ? player2 : player1;
            //remove old event listeners and attach new event listener to cells here
            console.log(`Current Turn: ${currentPlayer.name}`);// call the function to update the text here
    };

    const playerMove = function(cell) {
        if (currentRound <= maxRounds) {
        if(gameBoard.addMark(currentPlayer.markValue, cell) === 'cell_marked') {
            winCheck();
        } else console.log( 'cell is occupied');// add proper error handling here
        } else console.log('Game has ended. Please Quit to start a new game'); // add a proper error handler here
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

    const drawHandler = function() {
        playerModule.drawsRecord();
        console.log(`Round ${currentRound} is a Draw`); // text update function here
        roundInitiator();
    };

    const winAction = function() {
        playerModule.winScoreRecord(currentPlayer);
        console.log(`${currentPlayer.name} Wins Round: ${currentRound}.`); //call function to update the text
        roundInitiator();
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
    
    
    const toggleDisplay = function () {
        titleContainer.classList.toggle('hidden-ctn');
        gameContainer.classList.toggle('hidden-ctn');
    };

    startButton.addEventListener('click', function startGame() {
        toggleDisplay();
        startButton.removeEventListener('click', startButton);
    });
})(); 



//Initializer
addEventListener('DOMContentLoaded', () => {
    gameBoard.initBoard();
});


// win pattern game play for testing
let drawArray = [0, 1, 2, 4, 3, 5, 7, 6, 8,   // Draw Combination 1
    0, 1, 2, 3, 4, 6, 5, 8, 7,   // Draw Combination 2
    0, 1, 2, 4, 3, 5, 7, 6, 8,   // Draw Combination 1
    0, 1, 2, 3, 4, 6, 5, 8, 7, 
    0, 1, 2, 5, 3, 4, 6, 8, 7,   // Draw Combination 1
    0, 1, 2, 3, 4, 6, 5, 8, 7, 
];   // Draw Combination 4
   

gameController.playGame();
for (let i = 0; i < drawArray.length; i++) {
    gameController.playerMove(drawArray[i]);
}