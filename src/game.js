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
    const appContainer = document.querySelector(".appContainer");
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

    const createBotDifficultiesContainer = () => {
        const botDifficultyContainer = document.createElement("div");
        const easyBot = document.createElement("button");
        const beatableBot = document.createElement("button");
        const hardBot = document.createElement("button");
        const unbeatableBot = document.createElement("button");

        botDifficultyContainer.classList.add("botDifficultyContainer");
        easyBot.classList.add("button");
        beatableBot.classList.add("button");
        hardBot.classList.add("button");
        unbeatableBot.classList.add("button");

        easyBot.textContent = "Easy";
        beatableBot.textContent = "Beatable";
        hardBot.textContent = "Hard";
        unbeatableBot.textContent = "Impossible";

        easyBot.addEventListener("click", () => { useAnimation(easyBot, "moveButton 1s"); gameController.setCpuDifficulty(0); removeBotDifficultiesContainer() });
        beatableBot.addEventListener("click", () => { useAnimation(beatableBot, "moveButton 1s"); gameController.setCpuDifficulty(80); removeBotDifficultiesContainer() });
        hardBot.addEventListener("click", () => { useAnimation(hardBot, "moveButton 1s"); gameController.setCpuDifficulty(95); removeBotDifficultiesContainer() });
        unbeatableBot.addEventListener("click", () => { useAnimation(unbeatableBot, "moveButton 1s"); gameController.setCpuDifficulty(100); removeBotDifficultiesContainer() });

        gameBoardContainer.style.pointerEvents = "none";

        appContainer.appendChild(botDifficultyContainer);
        botDifficultyContainer.appendChild(easyBot);
        botDifficultyContainer.appendChild(beatableBot);
        botDifficultyContainer.appendChild(hardBot);
        botDifficultyContainer.appendChild(unbeatableBot);
        useAnimation(botDifficultyContainer, "animateDifficultyContainer 0.5s reverse");
    }

    const removeBotDifficultiesContainer = () => {
        const container = document.querySelector(".botDifficultyContainer");

        setTimeout(() => {
            useAnimation(container, "animateDifficultyContainer 0.5s");
            setTimeout(() => {
                container.remove();
                gameBoardContainer.style.pointerEvents = "auto";
            }, 500);
        }, 500);
    }

    const useAnimation = (element, animation) => {
        element.style.animation = "none";
        element.offsetWidth;
        element.style.animation = animation;
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
        createBotDifficultiesContainer,
        useAnimation,
        removeBotDifficultiesContainer
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
    let currentPlayer = player1;
    let cpuDifficulty = 0;

    player1Name.addEventListener("change", () => { player1 = getNewPlayer(player1Name.value, player1Marker.value, "TicToe", "X"); getCurrentPlayer() });
    player1Marker.addEventListener("input", () => { player1 = getNewPlayer(player1Name.value, player1Marker.value, "TicToe", "X"); getCurrentPlayer() });
    player2Name.addEventListener("change", () => { player2 = getNewPlayer(player2Name.value, player2Marker.value, "TacToe", "O"); getCurrentPlayer() });
    player2Marker.addEventListener("input", () => { player2 = getNewPlayer(player2Name.value, player2Marker.value, "TacToe", "O"); getCurrentPlayer() });
    restartButton.addEventListener("click", () => handleRestart());
    swithOpponentButton.addEventListener("click", () => handleSwitchOpponent());
    displayController.gameBoardContainer.addEventListener("mousedown", (event) => handleMoves(event))

    const handleMoves = (event) => {
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
                    startNextRound();
                }
            }
            else if (playerOpponent === "cpu") {
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
                        displayController.gameBoardContainer.style.pointerEvents = "none";
                        await new Promise(resolve => setTimeout(resolve, 500));
                        makeCPUMove();
                        displayController.gameBoardContainer.style.pointerEvents = "auto";
                        if (isGameOver()) resetGame();
                        else startNextRound();
                    })();
                }
            }
        }
    }

    const handleRestart = () => {
        resetGame();
        displayController.useAnimation(restartButton, "moveButton 1s");
        if (playerOpponent === "cpu" && document.querySelector(".botDifficultyContainer") === null) displayController.createBotDifficultiesContainer();
    }

    const handleSwitchOpponent = () => {
        if (playerOpponent === "player") {
            swithOpponentButton.textContent = "Player vs Player";
            playerOpponent = "cpu";
            if (document.querySelector(".botDifficultyContainer") === null) displayController.createBotDifficultiesContainer();
        } else {
            swithOpponentButton.textContent = "Player vs CPU";
            playerOpponent = "player";
            if (document.querySelector(".botDifficultyContainer") !== null) displayController.removeBotDifficultiesContainer();
        }
        resetGame();
        displayController.useAnimation(swithOpponentButton, "moveButton 1s");
    }

    const startNextRound = () => {
        displayController.playerInformation.style.pointerEvents = "none";
        switchCurrentPlayer();
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
        let cpuMove;
        const emptyTiles = getEmptyTiles();

        // If cpuDifficulty threshold is greater than a random number between 0, 100
        // CPU will make the best possible move. If not, CPU chooses a random available tile as its move
        if (Math.floor(gsap.utils.random(0, 101) <= cpuDifficulty)) {
            cpuMove = findBestMove(gameBoard.gameBoardArray);
        }
        else {
            cpuMove = emptyTiles[Math.floor(gsap.utils.random(0, emptyTiles.length))];
        }

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

    const switchCurrentPlayer = () => {
        currentPlayer === player1 ? currentPlayer = player2 : currentPlayer = player1;
    };

    const getCurrentPlayer = () => {
        player1Name.classList.contains("currentPlayer") ? currentPlayer = player1 : currentPlayer = player2;
    }

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

        if (isGameOver()) {
            if (checkWinner(currentPlayer.getMarker()) === currentPlayer.getMarker()) displayController.createWinOrDrawWindow("win", currentPlayer.getName());
            else displayController.createWinOrDrawWindow("draw");
            displayController.gameBoardContainer.style.pointerEvents = "none";
            await new Promise(resolve => setTimeout(resolve, 2500));
            switchCurrentPlayer();
        }
        else currentPlayer = player1;

        displayController.resetGameBoardVisuals();
        gameBoard.resetGameBoardArray();
        showCurrentPlayer();
        displayController.gameBoardContainer.style.pointerEvents = "auto";
        displayController.playerInformation.style.pointerEvents = "auto";
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

    const setCpuDifficulty = (difficulty) => {
        cpuDifficulty = difficulty;
    };

    // When calling findBestMove, the function will look through the gameboard's empty tiles
    // and utilize the minimax algorithm to find out ALL the possible ways this game could go.
    // It returns the best possible move it can make, and in the case of a tictactoe game,
    // this makes the bot impossible to beat, although you can draw the game and cheer for that.
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

                    // This is alpha-beta pruning. It greatly reduces the amount of times
                    // minimax has to recursively call itself, by ignoring "branches" of the "tree"
                    // because it has already found the best possible score for that "branch",
                    // thus improving the algorithm's performance.
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
        setCpuDifficulty
    }
})();



/* Helper Functions */

function randomColorValue() {
    return `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`
}