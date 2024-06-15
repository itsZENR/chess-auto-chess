import {useFunctionsChess} from "@/components/composable/useFunctionsChess";
import {useWebsocket} from "@/components/composable/useWebsocket";

export function useLogicChess(board, soundStep, gameStart, totalPoints, source, target, piece, newPos, oldPos, orientation, ws) {

    const {sendMessageToServer} = useWebsocket()

    // Очки фигур
    const pieceValue = {
        P: 1, // пешка
        N: 3, // конь
        B: 3, // слон
        R: 5, // ладья
        Q: 9, // ферзь
        p: 1, // пешка
        n: 3, // конь
        b: 3, // слон
        r: 5, // ладья
        q: 9, // ферзь
    };

    const isTargetOutside = target === "offboard"
    const isTargetSpare = source === "spare"

    const {
        snapbackMove,
        isTargetRow,
        isExistingPiece,
        isEnoughPoints,
        counterPointsForPiece,
        playPlacementSound
    } = useFunctionsChess()


    // Если игры начата, запрещаем двиграть фигуры
    if (gameStart) {
        return snapbackMove();
    }

    if (isTargetOutside && isTargetSpare) {
        return snapbackMove();
    }

    // Проверка для короля
    if (isTargetOutside && piece.charAt(1) === "K") {
        return snapbackMove();
    }

    if (isTargetRow(target, piece, orientation)) {
        return snapbackMove();
    }

    if (isExistingPiece(target, board)) {
        return snapbackMove();
    }

    if (!isTargetOutside && isTargetSpare) {
        if (isEnoughPoints(piece, pieceValue, totalPoints.value)) {
            return snapbackMove();
        }
    }

    // подсчет очков
    totalPoints.value = counterPointsForPiece(
        pieceValue,
        totalPoints.value,
        piece,
        source,
        target
    );
    const message = [source, piece, target, newPos, totalPoints.value];
    sendMessageToServer(ws, message)


    // Проверка на выброс фигуры
    if (isTargetOutside) {
        return "trash";
    }

    playPlacementSound(soundStep);
}
