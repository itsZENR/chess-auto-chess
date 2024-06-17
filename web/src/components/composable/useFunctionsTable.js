import {computed, ref} from "vue";

export function useFunctionsTable() {

    const loading = ref(false)
    const isReady = ref(false)

    const changeActiveBtn = (isReady, isBtnVariants, isBtnColor) => {
        isReady.value = !isReady.value
        if (isReady.value) {
            isBtnVariants.value = 'elevated'
            isBtnColor.value = 'green-darken-3'
        } else {
            isBtnVariants.value = 'outlined'
            isBtnColor.value = 'primary'
        }
    }

    const load = () => {
        loading.value = true
        setTimeout(() => {
            loading.value = false
        }, 1000)
    };

    const stepsInPairs = computed(() => {
        const pairs = [];
        for (let i = 0; i < allStepsMove.value.length; i += 2) {
            const pair = allStepsMove.value.slice(i, i + 2);
            pairs.push(pair);
        }
        return pairs;
    });

    function formatMove(move) {
        const parts = move.match(/.{2}/g);
        return `${parts[0]} -> ${parts[1]}`;
    }


    return {load, changeActiveBtn, isReady, stepsInPairs, formatMove}
}