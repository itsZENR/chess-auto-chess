export function useLogicBoard() {

    const logicBoard = (data, board, game) => {
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
    }

    return {logicBoard}
}