export function useFunctionsChess() {

    // Возвращает фигуры
    const snapbackMove = () => {
        return "snapback";
    }

    // Функция на проверку передвижение фигуры
    function checkTargetRow(target, piece, orientation) {
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
    function checkExistingPiece(target, board) {
        // Получаем элемент на целевой клетке
        const targetPiece = board.position()[target];
        return !!targetPiece;
    }

    // Функция срабатывает после отпуска фигуры
    function onDrop(source, target, piece, newPos, oldPos, orientation) {
        // Если игры начата, запрещаем двиграть фигуры
        if (gameStatus) {
            return snapbackMove();
        }

        if (target === "offboard" && source === "spare") {
            return snapbackMove();
        }

        // Проверка для короля
        if (target === "offboard" && piece.charAt(1) === "K") {
            return snapbackMove();
        }

        if (checkTargetRow(target, piece, orientation)) {
            return snapbackMove();
        }

        if (checkExistingPiece(target, board)) {
            return snapbackMove();
        }


    }

    return {onDrop}
}
