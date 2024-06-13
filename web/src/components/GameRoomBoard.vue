<template>
  <v-col :cols="$vuetify.display.mdAndUp ? 6 : 12" class="board">
    <base-text>
      Игрок 1
    </base-text>
    <div ref="board" class="board"></div>
    <base-text>
      Игрок 2
    </base-text>
  </v-col>
  <audio ref="soundStep">
    <source :src="soundSrc" type="audio/mpeg">
  </audio>
</template>

<script setup>
import "@/assets/js/chessboard-1.0.0.min";
import {Chess} from "@/assets/js/chess.js";
import {onMounted, ref, toRefs, watch} from 'vue';
import {useSettingChess} from "@/components/composable/useSettingChess";
import {useLogicBoard} from "@/components/composable/useLogicBoard";
import BaseText from "@/components/ui/BaseText";
import soundPath from '@/assets/sound/moveStep.mp3';


const props = defineProps({
  isReady: Boolean,
  ws: Object,
  message: null,
  orientation: Boolean,
  gameStatus: Boolean,
});

const {isReady, ws, message, orientation, gameStatus} = toRefs(props);


const emit = defineEmits({
  'points': Number,
  'updateGameStatus': Boolean,
})


const board = ref(null);
const soundStep = ref(null);
const soundSrc = soundPath;
const game = new Chess();
const totalPoints = ref(10);
const logicBoardFunc = ref()

onMounted(() => {
  const {logicBoard} = useLogicBoard(soundStep.value)
  logicBoardFunc.value = logicBoard
  useSettingChess(board.value, soundStep.value, gameStatus.value, ws, totalPoints);
});

watch(message, () => {
  logicBoardFunc.value(message.value, board.value, game, gameStatus)
})

watch(orientation, () => {
  if (!orientation.value) {
    board.value.value.orientation("black");
  }
})

watch(totalPoints, () => {
  emit('points', totalPoints.value);
}, {immediate: true})

watch(gameStatus, () => {
  emit('updateGameStatus', gameStatus.value);
})

</script>

<style>
@import '~@/assets/css/chessboard-1.0.0.min.css';

.board {
  max-width: 500px;
}

.spare-pieces-7492f {
  display: flex;
  justify-content: center;
  padding: 0 !important;
}

.spare-pieces-7492f:first-child, .spare-pieces-7492f img:first-child {
  display: none;
}
</style>