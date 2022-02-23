const Player = (name, marker) => {
    const getName = () => name;
    const getMarker = () => marker;

    return {
        getName,
        getMarker
    }
}


const gameBoard = (() => {
    const gameBoardArray = [
        "", "", "",
        "", "", "",
        "", "", ""
    ];

    return {
        gameBoardArray,
    }
})();


const displayController = (() => {


    return {

    }
})();


const gameController = (() => {
    const gameBoardContainer = document.querySelector(".gameBoard");

    const player1 = Player("TicToe", "X")
    const player2 = Player("TacToe", "O")
    let round = 1;
    let gameOver = false;
    let currentPlayer = player1.getName();
    
    const getCurrentPlayerName = () => {
        return round % 2 === 1 ? player1.getName() : player2.getName();
    };

    gameBoardContainer.addEventListener("click", (event) => {
        const tile = event.target;

        if (tile.textContent !== "O" && tile.textContent !== "X") {

            if (currentPlayer === player1.getName()) {
                tile.textContent = player1.getMarker();
            }
            else {
                tile.textContent = player2.getMarker();
            }

            round++;
            currentPlayer = getCurrentPlayerName();
        }
    })


    return {
        
    }
})();


const renderGameBoard = (() => {
    const gameBoardContainer = document.querySelector(".gameBoard");

    for (i = 0; i < gameBoard.gameBoardArray.length; i++) {
        const gameBoardTile = document.createElement("div");
        gameBoardTile.classList.add("gameBoardTile");
        gameBoardTile.textContent = gameBoard.gameBoardArray[i];
        gameBoardContainer.appendChild(gameBoardTile);
    }

})();