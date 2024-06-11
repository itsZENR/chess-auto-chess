export function useFunctionsChess() {

    // Возвращает фигуры
    const snapbackMove = () => {
        return "snapback";
    }

    // Функция на проверку передвижение фигуры
    function isTargetRow(target, piece, orientation) {
        const targetRow = parseInt(target.charAt(1), 10);
        const targetColor = piece.charAt(0);

        if (
            (orientation === "white" && targetColor === "b") ||
            (orientation === "black" && targetColor === "w")
        ) {
            return true; // Фигура не соответствует ориентации игрока
        }

        if (
            (orientation === "white" && targetRow > 4) ||
            (orientation === "black" && targetRow < 5)
        ) {
            return true; // Позиция фигуры не соответствует ориентации игрока
        }

        return false;
    }

    // Функция на проверку занятости ячейки
    function isExistingPiece(target, board) {
        // Получаем элемент на целевой клетке
        const targetPiece = board.position()[target];
        return !!targetPiece;
    }

    // Функция на проверку количество очков у черного и белого
    function isEnoughPoints(piece, pieceValue, totalPoints) {
        // Получаем тип фигуры
        let pieceType = piece.charAt(1);
        let pieceVal = pieceValue[pieceType]; // Получаем значение фигуры из объекта pieceValue

        if (totalPoints - pieceVal < 0) {
            console.log("Недостаточно очков для добавления фигуры.");
            return true;
        }
    }

    function counterPointsForPiece(pieceValue, points, pieceType, source, target) {
        // Очки игрока
        let totalPoints = Number(points);

        // Получаем тип фигуры
        pieceType = pieceType.charAt(1);
        let pieceVal = pieceValue[pieceType]; // Получаем значение фигуры

        if (target === "offboard") {
            totalPoints += pieceVal;
            return totalPoints;
        }

        if (source === "spare") {
            totalPoints -= pieceVal; // Вычитаем очки за фигуру
            return totalPoints;
        } else {
            return totalPoints;
        }

    }

    function playPlacementSound(soundStep) {
        const audio = soundStep;
        audio.volume = 0.1;
        audio.play();
    }


    return {snapbackMove, isTargetRow, isExistingPiece, isEnoughPoints, counterPointsForPiece, playPlacementSound}
}
