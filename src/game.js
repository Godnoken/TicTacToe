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
        const random = gsap.utils.random;
        const color = randomColorValue();
        const windowInnerHeight = window.innerHeight;
        const windowInnerWidth = window.innerWidth;
        const maxAmountOfRectsOnScreen = windowInnerWidth / 50;
        const amountOfRectsOnScreen = [];

        // Creates and animates new SVG figures and amount is based on viewport width.
        // Amount is limited by utilizing an array
        const createSVGFigures = () => {
            for (let i = amountOfRectsOnScreen.length; i < maxAmountOfRectsOnScreen; i++) {
                let newRect = document.createElementNS(svgns, "rect");
                const x = random(0, windowInnerWidth);
                const y = random(0, windowInnerHeight);
                const animationDuration = random(30, 140);
    
                // With the use of gsap we have randomly created rects moving randomly on the screen
                const timeline = gsap.timeline();

                // Initializes position, size, color etc
                timeline.set(newRect, {
                    x: x,
                    y: y,
                    width: random(0, 40),
                    height: random(0, 300),
                    rotation: random(0, 360),
                    fill: color,
                    stroke: randomColorValue(),
                    strokeWidth: random(0, 5),
                    opacity: 0,
                });
    
                // Makes new rects visible after 6 seconds
                timeline.to(newRect, {
                    duration: 6,
                    opacity: 1,
                })
    
                // Rects move to random destination based on viewport and spins
                timeline.to(newRect, {
                    x: `+=${-windowInnerWidth + random(0, windowInnerWidth) * 2}`,
                    y: `+=${-windowInnerHeight + random(0, windowInnerHeight) * 2}`,
                    rotation: random(0, 1000),
                    duration: animationDuration,
                    ease: "none",
                }, 0);
    
                // Sets opacity to 0 after delay and deletes rect on animation completion
                timeline.to(newRect, {
                    delay: animationDuration - 6,
                    opacity: 0,
                    duration: 6,
                    onComplete: removeSVGFigures,
                    onCompleteParams: [newRect]
                }, 0)
                
                svg.appendChild(newRect);
                amountOfRectsOnScreen.push("");
            }
        }

        const removeSVGFigures = (rect) => {
            rect.remove();
            amountOfRectsOnScreen.pop();
        }

        createSVGFigures();

        setInterval(() => {
            createSVGFigures();
        }, 2000)

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
            if (checkWinner(currentPlayer.getMarker())) displayController.createWinOrDrawWindow("win", currentPlayer.getName());
            else displayController.createWinOrDrawWindow("draw");
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

/* Event Listeners */

const restartButton = document.querySelector(".restartButton");
restartButton.addEventListener("click", () => {
    gameController.resetGame();
    restartButton.style.animation = "none";
    restartButton.offsetWidth;
    restartButton.style.animation = "moveButton 1s";
});