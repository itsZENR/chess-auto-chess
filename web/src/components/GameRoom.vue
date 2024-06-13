<template>
  <v-row v-if="!isConnected" class="justify-center">
    Websocket не подключен
  </v-row>
  <v-row v-else class="justify-center">
    <game-room-popup
        :is-show="isPopupShow"
        @popup-close="popupClose"
    />
    <game-room-board
        :isReady="isReady"
        :ws="ws"
        :message="messageWebsocket"
        :orientation="isWhitePlayer"
        :game-start="gameStart"
        @points="updateTotalPoints"
        @update-game-status="updateGameStatus"
    />
    <game-room-table
        :total-points="totalPoints"
        :game-start="gameStart"
        @click-ready="changeReady"
    />
  </v-row>
</template>

<script setup>
import {ref, watch} from "vue";
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

const isWhitePlayer = ref(true)
const isPopupShow = ref(true)

function popupClose() {
  isPopupShow.value = false
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