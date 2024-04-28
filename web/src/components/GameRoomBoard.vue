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
</template>

<script setup>
import "@/assets/js/chessboard-1.0.0.min"
import {onMounted, ref} from 'vue';
import BaseText from "@/components/ui/BaseText";
import {useSettingChess} from "@/components/composable/useSettingChess";


const board = ref(null)
const {config} = useSettingChess()

onMounted(() => {
  Chessboard(board.value, config)
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