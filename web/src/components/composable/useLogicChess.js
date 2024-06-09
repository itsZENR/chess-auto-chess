import {useFunctionsChess} from "@/components/composable/useFunctionsChess";
import {useWebsocket} from "@/components/composable/useWebsocket";

export function useLogicChess(board, soundStep, gameStatus, whitePoints, blackPoints, source, target, piece, newPos, oldPos, orientation, ws) {

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
    if (gameStatus) {
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
        if (isEnoughPoints(piece, pieceValue, whitePoints.value, blackPoints.value)) {
            return snapbackMove();
        }
    }

    // подсчет очков
    if (orientation === "white") {
        let points = counterPointsForPiece(
            pieceValue,
            whitePoints.value,
            piece,
            source,
            target
        );
        whitePoints.value = points;
        const message = [source, piece, target, newPos, whitePoints.value];
        sendMessageToServer(ws, message)
    }

    if (orientation === "black") {
        let points = counterPointsForPiece(
            pieceValue,
            blackPoints.value,
            piece,
            source,
            target
        );
        blackPoints.value = points;
        const message = [source, piece, target, newPos, blackPoints.value];
        sendMessageToServer(ws, message)
    }

    // Проверка на выброс фигуры
    if (isTargetOutside) {
        return "trash";
    }

    playPlacementSound(soundStep);
}
