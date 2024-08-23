//Game Board Module
const gameBoard = (function() {
    
    const board = [];
    
    function initBoard() {
        for (let i = 0; i < 9; i++) {
            board[i] = 0;
        };
        console.log(board);
    };

    function illegalMove(mark) {
        console.log(`that cell already contains a ${mark}`);
        getBoardState();
    };

    function addMark(playerMark, boardIndex) {
        if(!board[boardIndex]) {
            board.splice(boardIndex, 1, playerMark);
            return getBoardState();
        } else illegalMove(board[boardIndex]);
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
            mark: 'X',
        },

        player_2: {
            name: 'Player 2',
            mark: 'O',
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
    let currentTurn = 1;
    let currentPlayer;


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
        console.log(currentPlayer);
    };





    return {
        startingPlayer,
    }

})();


//Initializer
addEventListener('DOMContentLoaded', () => {
    gameBoard.initBoard();
    gameController.startingPlayer();
});

