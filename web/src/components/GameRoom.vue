<template>
  <v-row v-if="!isConnected" class="justify-center">
    Websocket не подключен
  </v-row>
  <v-row v-else class="justify-center">
    <game-room-popup
        :is-show="isPopupInvite"
        @popup-close="popupClose"
    />
    <game-room-popup
        :is-show="isPopupGameFinish"
        @popup-close="popupClose"
    >
      <v-card
          max-width="500"
          min-width="300"
          color="green-darken-3"
      >
        <v-card-title>
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
        @points="updateTotalPoints"
        @update-game-status="updateGameStatus"
        @update-game-result="updateGameResult"
    />
    <game-room-table
        :total-points="totalPoints"
        :game-start="gameStart"
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
import {connectRoom, getAuth} from "@/api/index.js";
import {useAuthorization} from "@/components/composable/useAuthorization";


const {authorization} = useAuthorization()
authorization()

const route = useRoute();

connectRoom(route.params.idRoom)

const {ws, isConnected} = connectWebsocket(route.params.idRoom)
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
  console.log("Игра окончена!:", gameResult.value)
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