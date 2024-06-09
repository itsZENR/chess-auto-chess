<template>
  <v-row v-if="!isConnected" class="justify-center">
    Websocket не подключен
  </v-row>
  <v-row v-else class="justify-center">
    <game-room-popap/>
    <game-room-board
        :isReady="isReady"
        :ws="ws"
    />
    <game-room-table
        @click-ready="clickReady"
    />
  </v-row>
</template>

<script setup>
import {ref} from "vue";
import {connectWebsocket} from "@/api/websocket";
import {onBeforeRouteLeave, useRoute} from "vue-router";
import GameRoomBoard from "@/components/GameRoomBoard";
import GameRoomTable from "@/components/GameRoomTable";
import GameRoomPopap from "@/components/GameRoomPopap";
import {useWebsocket} from "@/components/composable/useWebsocket";


const route = useRoute();

const {ws, isConnected} = connectWebsocket(route.params.idRoom)
const {sendMessageToServer} = useWebsocket()

const isReady = ref(false)
const clickReady = () => {
  isReady.value = !isReady.value
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