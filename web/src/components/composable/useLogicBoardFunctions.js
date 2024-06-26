import {useFunctionsChess} from "@/components/composable/useFunctionsChess";
import {ref} from "vue"

export function useLogicBoardFunctions(soundStep) {

    function updateBoard(board, position) {
        if (typeof position === 'object') {
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
    }


    let updatePiece = "q";
    const {playPlacementSound} = useFunctionsChess()

    const moveQueue = ref([]);
    const isProcessingQueue = ref(false);
    const gameStat = ref('');
    const gameRes = ref();

    function addToMoveQueue(move, game, board, allStepsMove, game_status = '', gameResult = '') {

        if (move === 'endGame' && game_status !== '') {
            gameStat.value = game_status
            gameRes.value = gameResult
        }
        moveQueue.value.push(move);

        if (!isProcessingQueue.value) {
            isProcessingQueue.value = true;
            processQueue(game, board, allStepsMove);
        }
    }


    function processQueue(game, board, allStepsMove) {
        if (moveQueue.value.length === 0) {
            isProcessingQueue.value = false;
            return;
        }

        const move = moveQueue.value.shift();
        if (move == 'endGame') {
            checkGameStatus(gameStat.value, gameRes.value)
        }

        boardMoveEngine(move, game, board, allStepsMove);

        setTimeout(() => processQueue(game, board, allStepsMove), 500);
    }

    function boardMoveEngine(move, game, board, allStepsMove) {

        // Проверяем длину строки, чтобы убедиться, что она корректна
        if (move.length == 5) {
            updatePiece = move.charAt(4);
        } else if (move.length !== 4) {
            return "Некорректный ход";
        }

        if (!allStepsMove || !allStepsMove.value) {
            console.error("allStepsMove не инициализирован.");
            return;
        }

        // Массив всех сделанных движком ходов
        allStepsMove.value.push(move);

        // Разбиваем строку на начальное и конечное положение фигуры
        const source = move.substring(0, 2);
        const target = move.substring(2, 4);

        // Ход на доске
        game.move({
            from: source,
            to: target,
            promotion: updatePiece,
        });
        board.value.position(game.fen());

        // Воспроизводим звук после выполнения хода
        playPlacementSound(soundStep);
    }


    return {updateBoard, addToMoveQueue}
}