import {useLogicChess} from "@/components/composable/useLogicChess";
import {ref} from "vue";

export function useSettingChess(board, soundStep, gameStatus) {

    const whitePoints = ref(10);
    const blackPoints = ref(10);

    // Формирование доски
    const config = {
        draggable: true,
        dropOffBoard: "snapback",
        position: "7k/8/8/8/8/8/8/K7",
        sparePieces: true,
        onDrop: onDrop,
    };

    board.value = Chessboard(board, config)

    // Функция срабатывает после отпуска фигуры
    function onDrop(source, target, piece, newPos, oldPos, orientation) {
        return useLogicChess(board.value, soundStep, gameStatus, whitePoints, blackPoints, source, target, piece, newPos, oldPos, orientation)
    }


    return {config};
}
