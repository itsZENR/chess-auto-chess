<template>
  <v-row v-if="!isConnected" class="justify-center">
    <loader object="#4c00ff" color1="#000000" color2="#4b6aa3" size="15" speed="2" bg="#343a40" objectbg="#999793"
            opacity="80" disableScrolling="false" name="dots"></loader>
  </v-row>
  <v-row v-else class="justify-center">
    <game-room-popup
        class="position-absolute"
        :is-show="isPopupInvite"
        @popup-close="popupClose"
    />
    <game-room-popup
        class="position-absolute"
        :is-show="isPopupGameFinish"
        @popup-close="popupClose"
    >
      <v-card
          max-width="500"
          min-width="260"
          color="green-darken-3 pt-5"
      >
        <v-card-title
            class="d-flex justify-center"
        >
          {{ resultMessage }}
        </v-card-title>
        <v-card-actions class="d-flex justify-end">
          <v-btn
              class="ms-auto"
              text="Закрыть"
              @click="popupClose"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </game-room-popup>
    <game-room-board
        :isReady="isReady"
        :ws="ws"
        :message="messageWebsocket"
        :orientation="isWhitePlayer"
        :game-start="gameStart"
        :game-result="gameResult"
        :all-steps-move="allStepsMove"
        @update-points="updateTotalPoints"
        @update-game-status="updateGameStatus"
        @update-game-result="updateGameResult"
        @update-game-steps="updateSteps"
    />
    <game-room-table
        :total-points="totalPoints"
        :game-start="gameStart"
        :all-steps-move="allStepsMove"
        @click-ready="changeReady"
    />
  </v-row>
</template>

<script setup>
import {ref, watch, computed} from "vue";
import {connectWebsocket} from "@/api/websocket";
import {onBeforeRouteLeave, useRoute} from "vue-router";
import GameRoomBoard from "@/components/GameRoomBoard";
import GameRoomTable from "@/components/GameRoomTable";
import GameRoomPopup from "@/components/GameRoomPopup";
import {useWebsocket} from "@/components/composable/useWebsocket";
import {connectRoom} from "@/api/index.js";
import {useAuthorization} from "@/components/composable/useAuthorization";


const {authorization} = useAuthorization()
authorization()

const route = useRoute();

connectRoom(route.params.idRoom)

const domain = ref('');
domain.value = window.location.hostname;

const {ws, isConnected} = connectWebsocket(route.params.idRoom, domain.value)
const {sendMessageToServer, receivedWebsocket, messageWebsocket} = useWebsocket()
receivedWebsocket(ws)

const totalPoints = ref(null)
const updateTotalPoints = (points) => {
  totalPoints.value = points
}

const gameStart = ref(false);
const updateGameStatus = (v) => {
  gameStart.value = v
}

const gameResult = ref(null)
const updateGameResult = (v) => {
  gameResult.value = v
  isPopupGameFinish.value = true
}

const resultList = {
  "1-0": "Победа белых!",
  "0-1": "Победа черных!",
  "1/2-1/2": "Ничья!",
  "none": "Игра окончилась бесконечьностью!"
};

const resultMessage = computed(() => {
  return resultList[gameResult.value] || "Неизвестный результат";
});

const allStepsMove = ref([]);
const updateSteps = (v) => {
  allStepsMove.value = v
};

const isWhitePlayer = ref(true)
const isPopupInvite = ref(true)
const isPopupGameFinish = ref(false)

function popupClose() {
  isPopupInvite.value = false
  isPopupGameFinish.value = false
}

watch(messageWebsocket, () => {
  if (messageWebsocket.value.color_is_white === false) {
    isWhitePlayer.value = false
  }
  if (messageWebsocket.value.game_status === "GameStart") {
    popupClose()
  }
})

const isReady = ref(false)
const changeReady = () => {
  isReady.value = !isReady.value
  if (isReady) {
    sendMessage("Готов")
  }
}

const sendMessage = (message) => {
  sendMessageToServer(ws, message)
}

onBeforeRouteLeave((to, from) => {
  ws.close()
})

</script>

<style>

</style>