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

    return {
        addMark,
        getBoardState,
        initBoard,
    }

})();

//Player Module
const playerModule = (function() {

    //Player object
    const players = {
        player_1: {
            name: 'Player 1',
            markType: 'X',
            markValue: -1,
        },

        player_2: {
            name: 'Player 2',
            mark: 'O',
            markValue: 1,
        },
    };

    const setName = function(playerKey, newName) {
        players[playerKey].name = newName;
        console.log(players);
    };

    const getPlayer = function(playerKey) {
        return { ...players[playerKey]};
    };

    return {
        setName,
        getPlayer,
    };
})();

//Game Controller Module
const gameController = (function() {


    let player1 = playerModule.getPlayer('player_1');
    let player2 = playerModule.getPlayer('player_2');
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

    const startingPlayer = function(player) {
        if(!player) {
            if(Math.random() < 0.5) {
                currentPlayer = player1;
            } else {
                currentPlayer = player2;
            }
        } else {
            currentPlayer = player;
        }
    };

    const playGame = function(player) {
        roundInitiator(player);
    };

    const roundInitiator = function(player) {
        gameBoard.initBoard();
        startingPlayer(player);
        currentTurn = 1;
        winStatus = undefined;
        //attach event listener to cells here
    };
    
    const turnInitiator = function() {
        if (winStatus !== 'win') {
            currentPlayer = (currentPlayer === player1) ? player2 : player1;
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
        currentTurn++;
        turnInitiator();
    };

    const winAction = function() {
        winStatus = 'win';
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
gameController.playerMove(5);
gameController.playerMove(1);
gameController.playerMove(6);
gameController.playerMove(2);
gameController.messageBox();