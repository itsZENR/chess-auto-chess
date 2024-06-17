import {nextTick, onMounted, onUnmounted, ref} from 'vue';

export function useChessScrollControl() {
    let stopScrolling = ref(false);


    function handleTouchMove(e) {
        if (!stopScrolling) {
            return;
        }
        e.preventDefault();
    }

    const onDragStart = (event) => {
        stopScrolling.value = true;
    };

    const onDragEnd = () => {
        stopScrolling.value = false;

        nextTick(() => {
            initEventListeners();
        });
    };

    const initEventListeners = () => {
        const pieces = document.querySelectorAll('.piece-417db');
        const pieceElementsDiv = document.querySelectorAll(".square-55d63");

        pieces.forEach((piece) => {
            piece.addEventListener('touchstart', onDragStart, {passive: false});
            piece.addEventListener('touchend', onDragEnd);
        });
        pieceElementsDiv.forEach((pieceElementDiv) => {
            pieceElementDiv.addEventListener("touchstart", onDragStart, {passive: false});
            pieceElementDiv.addEventListener("touchend", onDragEnd);
        });
        pieces.forEach((piece) => {
            piece.addEventListener("touchmove", handleTouchMove, {
                passive: false
            });
        });
        pieceElementsDiv.forEach((pieceElementDiv) => {
            pieceElementDiv.addEventListener("touchmove", handleTouchMove, {
                passive: false
            });
        });
    };

    const removeEventListeners = () => {
        const pieces = document.querySelectorAll('.piece-417db');
        pieces.forEach((piece) => {
            piece.removeEventListener('touchstart', onDragStart);
            piece.removeEventListener('touchend', onDragEnd);
        });
    };

    onMounted(() => {
        nextTick(() => {
            initEventListeners();
        });
    });

    onUnmounted(() => {
        removeEventListeners();
    });
}
