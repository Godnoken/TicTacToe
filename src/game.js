const gameBoard = (() => {
    const gameBoardArray = [
        "X", "X", "O",
        "O", "O", "X",
        "O", "X", "O"
    ];

    return {
        gameBoardArray,

    }
})();


const displayController = (() => {


    return {

    }
})();


const Player = (name) => {
    const getName = () => name;

    return {
        getName,

    }
}


const ticToe = Player("TicToe");
const tacToe = Player("TacToe");