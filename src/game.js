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
    const playerInformation = document.querySelector(".playerInformation");

    const createGameBoardVisuals = (() => {
        for (i = 0; i < gameBoard.gameBoardArray.length; i++) {
            const gameBoardTile = document.createElement("div");
            gameBoardTile.classList.add("gameBoardTile");
            gameBoardTile.dataset.index = i;
            gameBoardContainer.appendChild(gameBoardTile);
        }
    })();

    const resetGameBoardVisuals = () => {
        for (i = 0; i < gameBoard.gameBoardArray.length; i++) {
            gameBoardContainer.children[i].textContent = "";
        }
    }

    const createWinOrDrawWindow = async (result, player) => {
        const winOrDrawWindow = document.createElement("div");
        winOrDrawWindow.classList.add("winOrDrawWindow");
        document.body.appendChild(winOrDrawWindow);

        if (result === "draw") {
            winOrDrawWindow.textContent = "Draw!";
        }
        else {
            winOrDrawWindow.textContent = `${player} wins!`;
        }

        await new Promise(resolve => setTimeout(resolve, 2500));
        winOrDrawWindow.remove();
    }

    const createAnimatedBackground = (() => {
        const svg = document.querySelector("svg");
        const svgns = "http://www.w3.org/2000/svg";

        const color = randomColorValue();
        const windowInnerHeight = window.innerHeight;
        const windowInnerWidth = window.innerWidth;
        const amountOfRects = windowInnerWidth / 50;

        for (let i = 0; i < amountOfRects; i++) {
            let newRect = document.createElementNS(svgns, "rect");
            const x = randomNumber(windowInnerWidth);
            const y = randomNumber(windowInnerHeight);

            gsap.set(newRect, {
                x: x,
                y: y,
                width: randomNumber(40),
                height: randomNumber(300),
                rotation: randomNumber(360),
                fill: color,
                stroke: randomColorValue(),
                strokeWidth: randomNumber(5),
            });

            gsap.to(newRect, {
                x: `+=${-windowInnerWidth + randomNumber(windowInnerWidth) * 2}`,
                y: `+=${-windowInnerHeight + randomNumber(windowInnerHeight) * 2}`,
                modifiers: {
                    x: gsap.utils.unitize(x => parseFloat(x) % windowInnerWidth),
                    y: gsap.utils.unitize(y => parseFloat(y) % windowInnerHeight)
                },
                rotation: randomNumber(1000),
                repeat: -1,
                yoyo: true,
                duration: 180,
                ease: "none",
            });

            svg.appendChild(newRect);
        }  
    })();

    return {
        gameBoardContainer,
        playerInformation,
        resetGameBoardVisuals,
        createWinOrDrawWindow,
    }
})();


const gameController = (() => {
    const player1Name = document.querySelector(".player1Name");
    const player1Marker = document.querySelector(".player1Marker");
    const player2Name = document.querySelector(".player2Name");
    const player2Marker = document.querySelector(".player2Marker");
    
    let player1 = Player("TicToe", "X");
    let player2 = Player("TacToe", "O");
    let round = 1;
    let currentPlayer = player1;

    player1Name.addEventListener("change", () => player1 = getNewPlayer(player1Name.value, player1Marker.value, "TicToe", "X"));
    player1Marker.addEventListener("change", () => player1 = getNewPlayer(player1Name.value, player1Marker.value, "TicToe", "X"));
    player2Name.addEventListener("change", () => player2 = getNewPlayer(player2Name.value, player2Marker.value, "TacToe", "O"));
    player2Marker.addEventListener("change", () => player2 = getNewPlayer(player2Name.value, player2Marker.value, "TacToe", "O"));

    displayController.gameBoardContainer.addEventListener("mousedown", (event) => {
        displayController.playerInformation.style.pointerEvents = "none";
        const tile = event.target;
        
        if (tile.textContent !== player1.getMarker() && tile.textContent !== player2.getMarker()) {

            if (currentPlayer === player1) {
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
                showCurrentPlayer();
            }
        }
    })

    const getNewPlayer = (playerNameValue, playerMarkerValue, playerDefaultName, playerDefaultMarker) => {
        return Player(
            playerNameValue !== "" ? playerNameValue : playerDefaultName,
            playerMarkerValue !== "" ? playerMarkerValue : playerDefaultMarker
            );
    };

    const getCurrentPlayer = () => {
        currentPlayer === player1 ? currentPlayer = player2 : currentPlayer = player1;
    };

    const showCurrentPlayer = () => {
        if (currentPlayer !== player1) {
            player2Name.classList.add("currentPlayer");
            player2Marker.classList.add("currentPlayer");
            player1Name.classList.remove("currentPlayer");
            player1Marker.classList.remove("currentPlayer");
        }
        else {
            player1Name.classList.add("currentPlayer");
            player1Marker.classList.add("currentPlayer");
            player2Name.classList.remove("currentPlayer");
            player2Marker.classList.remove("currentPlayer");
        }
    };

    const isGameOver = () => {
        if (round === 9 || checkWinner(currentPlayer.getMarker())) {
            return true;
        }
    }

    const resetGame = async () => {
        displayController.playerInformation.style.pointerEvents = "auto";

        if (isGameOver()) {
            if (round === 9) displayController.createWinOrDrawWindow("draw");
            else displayController.createWinOrDrawWindow("win", currentPlayer.getName());
            displayController.gameBoardContainer.style.pointerEvents = "none";
            await new Promise(resolve => setTimeout(resolve, 2500));
            getCurrentPlayer();
        }
        else currentPlayer = player1;

        round = 1;
        displayController.resetGameBoardVisuals();
        gameBoard.resetGameBoardArray();
        showCurrentPlayer();
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

    showCurrentPlayer();

    return {
        resetGame,
    }
})();

/* Helper Functions */

function randomColorValue() {
    return `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`
}

function randomNumber(size) {
    return Math.floor(Math.random() * size)
}

/* Event Listeners */

const restartButton = document.querySelector(".restartButton");
restartButton.addEventListener("click", () => {
    gameController.resetGame();
    restartButton.style.animation = "none";
    restartButton.offsetWidth;
    restartButton.style.animation = "moveButton 1s";
});