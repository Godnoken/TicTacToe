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
        document.querySelector(".appContainer").appendChild(winOrDrawWindow);

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
    const restartButton = document.querySelector(".restartButton");
    const swithOpponentButton = document.querySelector(".switchOpponentButton");

    let playerOpponent = "player";
    let player1 = Player("TicToe", "X");
    let player2 = Player("TacToe", "O");
    let round = 1;
    let currentPlayer = player1;

    player1Name.addEventListener("change", () => player1 = getNewPlayer(player1Name.value, player1Marker.value, "TicToe", "X"));
    player1Marker.addEventListener("change", () => player1 = getNewPlayer(player1Name.value, player1Marker.value, "TicToe", "X"));
    player2Name.addEventListener("change", () => player2 = getNewPlayer(player2Name.value, player2Marker.value, "TacToe", "O"));
    player2Marker.addEventListener("change", () => player2 = getNewPlayer(player2Name.value, player2Marker.value, "TacToe", "O"));
    restartButton.addEventListener("click", () => handleRestart());
    swithOpponentButton.addEventListener("click", () => handleSwitchOpponent());
    displayController.gameBoardContainer.addEventListener("mousedown", (event) => handleMoves(event))

    const handleMoves = (event) => {
        displayController.playerInformation.style.pointerEvents = "none";
        const tile = event.target;

        if (tile.textContent === "") {
            const visualMarker = document.createElement("div");
            visualMarker.classList.add("gameBoardTileMarker");
            tile.appendChild(visualMarker);
            if (playerOpponent === "player") {
                if (currentPlayer === player1) {
                    visualMarker.textContent = player1.getMarker();
                    gameBoard.gameBoardArray[tile.dataset.index] = player1.getMarker();
                }
                else {
                    visualMarker.textContent = player2.getMarker();
                    gameBoard.gameBoardArray[tile.dataset.index] = player2.getMarker();
                }
                
                if (isGameOver()) resetGame();
                else {
                    round++;
                    getCurrentPlayer();
                    showCurrentPlayer();
                }
            }
            else if (playerOpponent === "cpu") {
                if (currentPlayer === player1) {
                    visualMarker.textContent = player1.getMarker();
                    gameBoard.gameBoardArray[tile.dataset.index] = player1.getMarker();

                    if (isGameOver()) {
                        (async () => {
                            resetGame();
                            await new Promise(resolve => setTimeout(resolve, 2500));
                            makeCPUMove();
                            startNextRound();
                        })();
                    }
                    else {
                        (async () => {
                            startNextRound();
                            await new Promise(resolve => setTimeout(resolve, 500));
                            makeCPUMove();
                            if (isGameOver()) resetGame();
                            else startNextRound();
                        })();
                    }
                }
            }
        }
    }

    const handleRestart = () => {
        resetGame();
        restartButton.style.animation = "none";
        restartButton.offsetWidth;
        restartButton.style.animation = "moveButton 1s";
    }

    const handleSwitchOpponent = () => {
        if (playerOpponent === "player") {
            swithOpponentButton.textContent = "Player vs Player";
            playerOpponent = "cpu";
        } else {
            swithOpponentButton.textContent = "Player vs CPU";
            playerOpponent = "player";
        }
        swithOpponentButton.style.animation = "none";
        swithOpponentButton.offsetWidth;
        swithOpponentButton.style.animation = "moveButton 1s";
    }

    const startNextRound = () => {
        round++;
        getCurrentPlayer();
        showCurrentPlayer();
    }

    const getEmptyTiles = () => {
        const emptyTiles = [];
        for (let i = 0; i < gameBoard.gameBoardArray.length; i++) {
            if (gameBoard.gameBoardArray[i] === "") {
                emptyTiles.push(i);
            }
        }
        return emptyTiles;
    }

    const makeCPUMove = () => {
        const emptyTiles = getEmptyTiles();
        //const cpuMove = emptyTiles[Math.floor(gsap.utils.random(0, emptyTiles.length))];
        const cpuMove = findBestMove(gameBoard.gameBoardArray);
        const visualMarker = document.createElement("div");
        visualMarker.classList.add("gameBoardTileMarker");
        displayController.gameBoardContainer.children[cpuMove].appendChild(visualMarker);
        visualMarker.textContent = player2.getMarker();
        gameBoard.gameBoardArray[cpuMove] = player2.getMarker();
    }

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
        if (checkWinner(currentPlayer.getMarker()) === player1.getMarker()
        || checkWinner(currentPlayer.getMarker()) === player2.getMarker()
        || checkWinner() === "draw"
        ) {
            return true;
        }
    }

    const resetGame = async () => {
        displayController.playerInformation.style.pointerEvents = "auto";

        if (isGameOver()) {
            if (checkWinner(currentPlayer.getMarker()) === currentPlayer.getMarker()) displayController.createWinOrDrawWindow("win", currentPlayer.getName());
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
            if (mark === player1.getMarker()) return player1.getMarker();
            else if (mark === player2.getMarker()) return player2.getMarker();
        } else if (GBA.filter(tile => tile === "").length === 0) {
            return "draw";
        }
    }

    const findBestMove = (board) => {
        let bestScore = -Infinity;
        let bestMove;

        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                
                board[i] = player2.getMarker();

                let score = minimax(board, 0, -Infinity, Infinity, false);

                board[i] = "";

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }

        return bestMove;
    }

    const minimax = (board, depth, alpha, beta, isMaximizingPlayer) => {

        if (checkWinner(player1.getMarker()) === player1.getMarker()) return -10;
        else if (checkWinner(player2.getMarker()) === player2.getMarker()) return 10;
        else if (checkWinner() === "draw") return 0;

        if (isMaximizingPlayer) {
            let bestScore = -Infinity;

            for (let i = 0; i < 9; i++) {
                
                if (board[i] === "") {

                    board[i] = player2.getMarker();
                    
                    let score = minimax(board, depth + 1, alpha, beta, false);

                    board[i] = "";

                    bestScore = Math.max(score, bestScore);

                    alpha = Math.max(alpha, bestScore);
                    if (beta <= alpha) break;
                }
            }
            return bestScore;
        }
        else {
            let bestScore = Infinity;
            
            for (let i = 0; i < 9; i++) {

                if (board[i] === "") {

                    board[i] = player1.getMarker();

                    let score = minimax(board, depth + 1, alpha, beta, true);

                    board[i] = "";

                    bestScore = Math.min(score, bestScore);
                    
                    beta = Math.min(beta, bestScore);
                    if (beta <= alpha) break;
                }
            }
            return bestScore;
        }
    }

    showCurrentPlayer();

    return {
        resetGame,
        playerOpponent
    }
})();



/* Helper Functions */

function randomColorValue() {
    return `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`
}