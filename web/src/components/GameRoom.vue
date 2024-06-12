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
        @points="updateTotalPoints"
    />
    <game-room-table
        :total-points="totalPoints"
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
import {getAuth} from "@/api/index.js";
import {getAccessToken} from "@/api/authCookie";

function authorization() {
  const token = getAccessToken();
  if (!token) {
    getAuth()
  }
}
authorization()

const route = useRoute();

const {ws, isConnected} = connectWebsocket(route.params.idRoom)
const {sendMessageToServer, receivedWebsocket, messageWebsocket} = useWebsocket()
receivedWebsocket(ws)

const totalPoints = ref(null)
const updateTotalPoints = (points) => {
  totalPoints.value = points
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