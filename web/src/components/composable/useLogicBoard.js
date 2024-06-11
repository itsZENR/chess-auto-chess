export function useLogicBoard() {

    const logicBoard = (data, board, game, gameStatus) => {
        console.log("==New message:==", data);

        let color = undefined;
        let position = undefined;
        let playerPoint = undefined;

        if (data.message === "Готов") {
            // Записываем позицию доски
            let boardFen = board.value.fen();
            boardFen = boardFen + " " + "w - - 0 1";
            // Записываем позицию в game
            board.value.position(game.load(boardFen, {skipValidation: true}));
        }

        if (data.game_status === "GameStart") {
            console.log("gameStatus:", data.game_status);
        }

        gameResult(data.gameStatus)

        if (data.move != undefined) {
            // Обновляем статус игры
            gameStatus.value = true;

            // // Делаем кнопку неактивной
            // saveButton.disabled = true;
            //
            // console.log("move: " + data.move);
            // boardMove(data.move);
        }
    }

    function gameResult(gameStatus) {
        switch (gameStatus) {
            case "1-0":
                // White winner
                EndGame();
                break;
            case "0-1":
                // Black winner
                EndGame();
                break;
            case "1/2-1/2":
                // Tie
                EndGame();
                break;
            case "none":
                EndGame();
                break;
            default:
                break;
        }

    }

    function EndGame() {
        console.log("Игра окончена!")
    }

    return {logicBoard}
}