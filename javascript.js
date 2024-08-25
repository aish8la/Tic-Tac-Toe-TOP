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
        loserKey = winningPlayer.keyName === players.player_1.keyName ? players.player_2.keyName : players.player_1.keyName;
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
    let currentRound = 1;
    let currentTurn = 1;
    let currentPlayer;
    let winStatus;
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
        roundInitiator(player);
    };

    const roundInitiator = function(player) {
        if (currentRound <= 5) {
            gameBoard.initBoard();
            updatePlayers();
            startingPlayer(player);
            currentTurn = 1;
            winStatus = undefined;
            //remove old event listeners and attach new event listener to cells here        
        } else {
            // remove event listeners 
            // show winning player
            console.log('Game is Over Message');
        };
       
    };
    
    const turnInitiator = function() {
        if (winStatus !== 'win') {
            currentPlayer = (currentPlayer === player1) ? player2 : player1;
            //remove old event listeners and attach new event listener to cells here
        } else {
            currentRound++;
            roundInitiator();
        };
    };

    const playerMove = function(cell) {
        if(gameBoard.addMark(currentPlayer.markValue, cell) === 'cell_marked') {
            winCheck();
        } else return 'cell is occupied';// add proper error handling here
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
        currentRound++;
        roundInitiator();
    };

    const winAction = function() {
        winStatus = 'win';
        playerModule.winScoreRecord(currentPlayer);
        messageBox();// test message 
        turnInitiator();
    };

    const messageBox = function() {
        console.log('THIS IS THE START OF MESSAGE BOX')
        console.log(`Round ${currentRound}`);
        console.log(`Player: ${currentPlayer.name} is playing`);
        console.log(`It is turn ${currentTurn}`);
        console.log(winStatus);
        console.log(winPattern);
        console.log(`This is the Board ${gameBoard.getBoardState()}`);
        console.log('THIS IS THE END OF MESSAGE BOX')
    };


    return {
        startingPlayer,
        playerMove,
        messageBox,
        roundInitiator,
        playGame,
        winCheck,
    }

})();



//Initializer
addEventListener('DOMContentLoaded', () => {
    gameBoard.initBoard();
});


// win pattern game play for testing
gameController.playGame();
gameController.playerMove(0);
gameController.playerMove(1);
gameController.playerMove(2);
gameController.playerMove(3);
gameController.playerMove(4);
gameController.playerMove(5);
gameController.playerMove(6);
gameController.playerMove(7);
gameController.playerMove(8);
gameController.messageBox();
