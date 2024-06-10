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
    />
    <game-room-table
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


const route = useRoute();

const {ws, isConnected} = connectWebsocket(route.params.idRoom)
const {sendMessageToServer, receivedWebsocket, messageWebsocket} = useWebsocket()
receivedWebsocket(ws)

const isWhitePlayer = ref(false)
const isPopupShow = ref(true)

function popupClose() {
  isPopupShow.value = false
}

watch(messageWebsocket, () => {
  if (messageWebsocket.value.color_is_white === true) {
    console.log("color_is_white", messageWebsocket.value.color_is_white)
    isWhitePlayer.value = true
  }
  if (messageWebsocket.value.gameStatus === "GameStart") {
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