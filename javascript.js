//Game Board Module
const gameBoard = (function() {
    
    const board = [0, 0, 0,
                    0, 0, 0,
                    0, 0, 0 ];
    
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

addEventListener('DOMContentLoaded', () => {
    gameBoard.initBoard();
})

gameBoard.addMark(-1, 1);


