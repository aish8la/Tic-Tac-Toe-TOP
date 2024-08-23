//Game Board Module
const gameBoard = (function() {
    
    const board = [0, 0, 0,
                    0, 0, 0,
                    0, 0, 0 ];
                    

    function addMark(playerMark, boardIndex) {
        board.splice(boardIndex, 1, playerMark);
        return getBoardState();
    };

    function getBoardState() {
        return board.slice();
    };

    return {
        addMark,
        getBoardState
    }

})();



