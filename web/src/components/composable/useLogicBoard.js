import {useLogicBoardFunctions} from "@/components/composable/useLogicBoardFunctions";

export function useLogicBoard(soundStep) {

    const {updateBoard, checkGameStatus, boardMoveEngine} = useLogicBoardFunctions(soundStep)

    const logicBoard = (data, board, game, playerReady, gameStart, gameResult, allStepsMove) => {
        console.log("New message:==", data);

        if (data.message === "Готов") {
            playerReady.value = true;
        }

        if (data.game_status === "GameStart") {
            console.log("gameStatus:", data.game_status);
        }

        checkGameStatus(data.game_status, gameResult)

        if (data.move != undefined) {
            if (!gameStart.value) {
                // Записываем позицию доски
                let boardFen = board.value.fen();
                boardFen = boardFen + " " + "w - - 0 1";
                board.value.position(game.load(boardFen, {skipValidation: true}));

                gameStart.value = true
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