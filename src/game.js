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


(function renderGameBoard() {
    const gameBoardContainer = document.querySelector(".gameBoard");

    for (i = 0; i < gameBoard.gameBoardArray.length; i++) {
        const gameBoardTile = document.createElement("div");
        gameBoardTile.classList.add("gameBoardTile");
        gameBoardTile.textContent = gameBoard.gameBoardArray[i];
        gameBoardContainer.appendChild(gameBoardTile);
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