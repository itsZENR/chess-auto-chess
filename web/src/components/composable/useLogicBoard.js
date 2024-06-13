import {useLogicBoardFunctions} from "@/components/composable/useLogicBoardFunctions";

export function useLogicBoard(soundStep) {

    const {updateBoard, gameResult, boardMoveEngine} = useLogicBoardFunctions(soundStep)

    const logicBoard = (data, board, game, gameStatus) => {
        console.log("==New message:==", data);

        let color = undefined;
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

            // console.log("move: " + data.move);
            boardMoveEngine(data.move, game, board);
        }

        if (data.message != undefined) {
            const position = data.message[3]
            updateBoard(board, position)
        }


    }

    return {logicBoard}
}