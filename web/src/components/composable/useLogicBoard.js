import {useLogicBoardFunctions} from "@/components/composable/useLogicBoardFunctions";

export function useLogicBoard(soundStep) {

    const {updateBoard, checkGameStatus, boardMoveEngine} = useLogicBoardFunctions(soundStep)

    const logicBoard = (data, board, game, gameStart, gameResult) => {
        console.log("New message:==", data);

        if (data.message === "Готов") {
            gameStart.value = true;

            // Записываем позицию доски
            let boardFen = board.value.fen();
            boardFen = boardFen + " " + "w - - 0 1";
            // Записываем позицию в game
            board.value.position(game.load(boardFen, {skipValidation: true}));
        }

        if (data.game_status === "GameStart") {
            console.log("gameStatus:", data.game_status);
        }

        checkGameStatus(data.game_status, gameResult)

        if (data.move != undefined) {
            boardMoveEngine(data.move, game, board);
        }

        if (data.message != undefined) {
            const position = data.message[3]
            updateBoard(board, position)
        }


    }

    return {logicBoard}
}