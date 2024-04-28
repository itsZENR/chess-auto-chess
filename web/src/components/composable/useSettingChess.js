import {useFunctionsChess} from "@/components/composable/useFunctionsChess";

export function useSettingChess() {

    // Статус игры
    let gameStatus = false;

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

    const {onDrop} = useFunctionsChess()

    // Формирование доски
    const config = {
        draggable: true,
        dropOffBoard: "snapback",
        position: "7k/8/8/8/8/8/8/K7",
        sparePieces: true,
        onDrop: onDrop,
    };

    return {config};
}
