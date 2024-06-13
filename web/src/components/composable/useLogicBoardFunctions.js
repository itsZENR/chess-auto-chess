import {ref} from "vue";
import {useFunctionsChess} from "@/components/composable/useFunctionsChess";

export function useLogicBoardFunctions(soundStep) {

    function updateBoard(board, position) {
        if (typeof position === 'object') {
            console.log("position:", position);

            board.value.position(position);
            // Хранение позиций в sessionStorage
            // SessionManager.storageBoardPosition(position);
        }
    }

    function checkGameStatus(gameStatus, gameResult) {
        switch (gameStatus) {
            case "1-0":
                // White winner
                EndGame(gameStatus, gameResult);
                break;
            case "0-1":
                // Black winner
                EndGame(gameStatus, gameResult);
                break;
            case "1/2-1/2":
                // Tie
                EndGame(gameStatus, gameResult);
                break;
            case "none":
                EndGame(gameStatus, gameResult);
                break;
            default:
                break;
        }

    }

    function EndGame(gameStatus, gameResult) {
        gameResult.value = gameStatus
        console.log("Игра окончена!", gameResult.value)
    }


    // Все ходы сделанные движком
    const moveArray = ref([]);
    let updatePiece = "q";
    const {playPlacementSound} = useFunctionsChess()

    function boardMoveEngine(move, game, board) {

        // Проверяем длину строки, чтобы убедиться, что она корректна
        if (move.length == 5) {
            updatePiece = move.charAt(4);
        } else if (move.length !== 4) {
            return "Некорректный ход";
        }

        playPlacementSound(soundStep);

        // Массив всех сделанных движком ходов
        moveArray.value.push(move);

        // Разбиваем строку на начальное и конечное положение фигуры
        const source = move.substring(0, 2);
        const target = move.substring(2, 4);

        // Ходы в истории HTML, после начала игры
        // createStepElement(source, target, moveArray.length);

        // ход на доске
        game.move({
            from: source,
            to: target,
            promotion: updatePiece,
        });
        board.value.position(game.fen());
    }

    return {updateBoard, checkGameStatus, boardMoveEngine}
}