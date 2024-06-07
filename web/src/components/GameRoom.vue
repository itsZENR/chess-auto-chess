<template>
  <v-row class="justify-center">
    <game-room-board
        :isReady="isReady"
    />
    <game-room-table
        @click-ready="clickReady"
    />
  </v-row>
</template>

<script setup>
import GameRoomTable from "@/components/GameRoomTable";
import GameRoomBoard from "@/components/GameRoomBoard";
import {connectWebsocket} from "@/api/websocket";
import {onBeforeRouteLeave} from "vue-router";
import {ref} from "vue";


const {ws} = connectWebsocket()

const isReady = ref(false)

const clickReady = () => {
  isReady.value = !isReady.value
}

const sendMessage = (message) => {
  ws.send(message);
}

onBeforeRouteLeave((to, from) => {
  ws.close()
})

</script>

<style>

</style>