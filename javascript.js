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


    const player1 = playerModule.getPlayer('player_1');
    const player2 = playerModule.getPlayer('player_2');
    let currentRound = 1;
    let currentTurn = 1;
    let currentPlayer;
    let winStatus;

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

    const playerGame = function(player) {
        roundInitiator(player);
    };

    const roundInitiator = function(player) {
        gameBoard.initBoard();
        startingPlayer(player);
        currentTurn = 1;
        //attach event listener to cells here
    };
    
    const turnInitiator = function() {
        if (winStatus !== 'win') {
            currentPlayer = (currentPlayer === player1) ? player2 : player1;
            messageBox();
        } else {
            currentRound++;
            roundInitiator();
        };
    };

    const playerMove = function(cell) {
        if(gameBoard.addMark(currentPlayer.markValue, cell) === 'cell_marked') {
            currentTurn++;
            turnInitiator();
        } else return 'cell is occupied';// add proper error handling here
    };


    const messageBox = function() {
        console.log(`Round ${currentRound}`);
        console.log(`Player: ${currentPlayer.name} is playing`);
        console.log(`It is turn ${currentTurn}`);
        console.log(`This is the Board ${gameBoard.getBoardState()}`);
    };


    return {
        startingPlayer,
        playerMove,
        messageBox,
        roundInitiator
    }

})();



//Initializer
addEventListener('DOMContentLoaded', () => {
    gameBoard.initBoard();
});

