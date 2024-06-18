import {useLogicBoardFunctions} from "@/components/composable/useLogicBoardFunctions";

export function useLogicBoard(soundStep) {

    const {updateBoard, checkGameStatus, boardMoveEngine} = useLogicBoardFunctions(soundStep)

    let gameSavePosition = true
    const logicBoard = (data, board, game, gameStart, gameResult, allStepsMove) => {
        console.log("New message:==", data);

        if (data.message === "Готов") {
            gameStart.value = true;
        }

        if (data.game_status === "GameStart") {
            console.log("gameStatus:", data.game_status);
        }

        checkGameStatus(data.game_status, gameResult)

        if (data.move != undefined) {
            if (gameSavePosition) {
                // Записываем позицию доски
                let boardFen = board.value.fen();
                boardFen = boardFen + " " + "w - - 0 1";
                board.value.position(game.load(boardFen, {skipValidation: true}));

                gameSavePosition = false
            }


            boardMoveEngine(data.move, game, board, allStepsMove);
        }

        if (data.message != undefined) {
            const position = data.message[3]
            updateBoard(board, position)
        }


    }

    return {logicBoard}
}