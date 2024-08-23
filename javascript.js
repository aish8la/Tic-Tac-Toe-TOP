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
    const players = {
        player1: {
            name: 'Player 1',
            mark: 'X',
        },

        player2: {
            name: 'Player 2',
            mark: 'O',
        },
    };

    const setName = function(playerKey, newName) {
        players[playerKey].name = newName;
        console.log(players);
    };

    const getPlayer = function(playerKey) {
        console.log(players[playerKey]);
        return { ...players[playerKey]};
    };

    return {
        setName,
        getPlayer,
    };
})();


//Initializer
addEventListener('DOMContentLoaded', () => {
    gameBoard.initBoard();
});

