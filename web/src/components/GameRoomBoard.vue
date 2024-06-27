<template>
  <v-col :cols="$vuetify.display.mdAndUp ? 6 : 12" class="board">
    <div class="d-flex justify-space-between flex-wrap">
      <base-text>
        Игрок {{ !orientation ? "1" : "2" }}
      </base-text>
      <span
          v-if="playerReady && !gameStart"
          class="text-grey-darken-1"
      >
        ожидаем готовности 2-го игрока...
      </span>
    </div>
    <div
        ref="board"
        class="board"
        :class="{'block-board': gameStart || playerReady}"
    ></div>
    <base-text>
      Игрок {{ orientation ? "1" : "2" }}
    </base-text>
  </v-col>
  <audio class="position-absolute" ref="soundStep">
    <source :src="soundSrc" type="audio/mpeg">
  </audio>
  <vue3-snackbar bottom right :duration="5000">
  </vue3-snackbar>
</template>

<script setup>
import "@/assets/js/chessboard-1.0.0.min";
import {Chess} from "@/assets/js/chess.js";
import {onMounted, ref, toRefs, watch} from 'vue';
import {useSettingChess} from "@/components/composable/useSettingChess";
import {useLogicBoard} from "@/components/composable/useLogicBoard";
import BaseText from "@/components/ui/BaseText";
import soundPath from '@/assets/sound/moveStep.mp3';
import {useChessScrollControl} from "@/components/composable/useChessScrollControl";
import {useSnackbar, Vue3Snackbar} from "vue3-snackbar";


const props = defineProps({
  isReady: Boolean,
  ws: Object,
  message: null,
  orientation: Boolean,
});

const {isReady, ws, message, orientation} = toRefs(props);


const emit = defineEmits({
  'updatePoints': Number,
  'updateGameStatus': Boolean,
  'updateGameResult': String,
  'updateGameSteps': Array,
})

const {initEventListeners} = useChessScrollControl()

const board = ref(null);
const soundStep = ref(null);
const soundSrc = soundPath;
const game = new Chess();
const totalPoints = ref(10);
const playerReady = ref(false);
const gameStart = ref(false)
const gameResult = ref(null)
const allStepsMove = ref([]);

const logicBoardFunc = ref()
const snackbar = useSnackbar();

onMounted(() => {
  const {logicBoard} = useLogicBoard(soundStep.value)
  logicBoardFunc.value = logicBoard
  useSettingChess(board.value, soundStep.value, playerReady, ws, totalPoints, successMessage);
});

const successMessage = (message, status = 'info') => {
  snackbar.add({
    type: status,
    text: message
  })
}

watch(playerReady, () => {
  if (playerReady.value) {
    const divPieces = document.querySelectorAll('.spare-pieces-7492f');
    divPieces.forEach(divPiece => {
      divPiece.style.display = 'none';
    });
  }
})

watch(message, () => {
  logicBoardFunc.value(message.value, board.value, game, playerReady, gameStart, gameResult, allStepsMove)
})

watch(orientation, () => {
  if (!orientation.value) {
    board.value.value.orientation("black");
  }
  initEventListeners()
})

watch(totalPoints, () => {
  emit('updatePoints', totalPoints.value);
}, {immediate: true})

watch(playerReady, () => {
  emit('updateGameStatus', playerReady.value);
})

watch(gameResult, () => {
  emit('updateGameResult', gameResult.value);
})

watch(allStepsMove.value, () => {
  emit('updateGameSteps', allStepsMove.value);
})

</script>

<style>
@import '~@/assets/css/chessboard-1.0.0.min.css';

.chessboard-63f37 {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #3e3e3e;
}

.spare-pieces-7492f {
  display: flex;
  justify-content: center;
  padding: 0 !important;
}

.spare-pieces-7492f:first-child, .spare-pieces-7492f img:first-child {
  opacity: 0;
  visibility: hidden;
  position: absolute;
  top: 0;
  left: 0;
}

.block-board {
  position: relative;
}

.block-board:after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
}

.board {
  max-width: 500px;
}

@media (max-width: 960px) {
  .notation-322f9 {
    font-size: 8px;
  }
}


</style>