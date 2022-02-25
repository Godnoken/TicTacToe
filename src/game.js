const Player = (name, marker) => {
    const getName = () => name;
    const getMarker = () => marker;

    return {
        getName,
        getMarker
    }
}


const gameBoard = (() => {
    let gameBoardArray = [
        "", "", "",
        "", "", "",
        "", "", ""
    ];

    const resetGameBoardArray = () => {
        for (let i = 0; i < gameBoardArray.length; i++) {
            gameBoardArray[i] = "";
        }
    }

    return {
        gameBoardArray,
        resetGameBoardArray
    }
})();


const displayController = (() => {
    const gameBoardContainer = document.querySelector(".gameBoard");

    const createGameBoardVisuals = () => {
        for (i = 0; i < gameBoard.gameBoardArray.length; i++) {
            const gameBoardTile = document.createElement("div");
            gameBoardTile.classList.add("gameBoardTile");
            gameBoardTile.dataset.index = i;
            gameBoardTile.textContent = gameBoard.gameBoardArray[i];
            gameBoardContainer.appendChild(gameBoardTile);
        }
    }

    const resetGameBoardVisuals = () => {
        for (i = 0; i < gameBoard.gameBoardArray.length; i++) {
            gameBoardContainer.children[i].textContent = "";
        }
    }

    return {
        gameBoardContainer,
        createGameBoardVisuals,
        resetGameBoardVisuals,
    }
})();


const gameController = (() => {
    displayController.createGameBoardVisuals();

    const player1 = Player("TicToe", "X")
    const player2 = Player("TacToe", "O")
    let round = 1;
    let currentPlayer = player1;

    displayController.gameBoardContainer.addEventListener("click", (event) => {
        const tile = event.target;

        if (tile.textContent !== "O" && tile.textContent !== "X") {
            console.log(currentPlayer.getName())
            if (currentPlayer.getName() === player1.getName()) {
                tile.textContent = player1.getMarker();
                gameBoard.gameBoardArray[tile.dataset.index] = player1.getMarker();
            }
            else {
                tile.textContent = player2.getMarker();
                gameBoard.gameBoardArray[tile.dataset.index] = player2.getMarker();
            }

            if (isGameOver()) resetGame();
            else {
                round++;
                getCurrentPlayer();
            }
        }
    })

    const getCurrentPlayer = () => {
        currentPlayer === player1 ? currentPlayer = player2 : currentPlayer = player1;
    };

    const isGameOver = () => {
        if (round === 9 || checkWinner(currentPlayer.getMarker())) {
            return true;
        }
    }

    const resetGame = async () => {

        if (isGameOver()) {
            displayController.gameBoardContainer.style.pointerEvents = "none";
            await new Promise(resolve => setTimeout(resolve, 1500));
        }
        
        round = 1;
        getCurrentPlayer();
        displayController.resetGameBoardVisuals();
        gameBoard.resetGameBoardArray();
        displayController.gameBoardContainer.style.pointerEvents = "auto";
    }

    const checkWinner = (mark) => {
        const GBA = gameBoard.gameBoardArray;

        const winConditions = (
            GBA[0] === mark && GBA[1] === mark && GBA[2] === mark
            ||
            GBA[3] === mark && GBA[4] === mark && GBA[5] === mark
            ||
            GBA[6] === mark && GBA[7] === mark && GBA[8] === mark
            ||
            GBA[0] === mark && GBA[3] === mark && GBA[6] === mark
            ||
            GBA[1] === mark && GBA[4] === mark && GBA[7] === mark
            ||
            GBA[2] === mark && GBA[5] === mark && GBA[8] === mark
            ||
            GBA[0] === mark && GBA[4] === mark && GBA[8] === mark
            ||
            GBA[2] === mark && GBA[4] === mark && GBA[6] === mark
        );

        if (winConditions) {
            return true;
        }
    }

    return {

    }
})();