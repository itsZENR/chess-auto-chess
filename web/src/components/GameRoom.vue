<template>
  <v-row class="justify-center">
    <game-room-board/>
    <game-room-table/>
  </v-row>
</template>

<script setup>
import GameRoomTable from "@/components/GameRoomTable";
import GameRoomBoard from "@/components/GameRoomBoard";
import {connectWebsocket} from "@/api/websocket";
import {onBeforeRouteLeave} from "vue-router";


const {ws} = connectWebsocket()

const sendMessage = (message) => {
  ws.send(message);
}

onBeforeRouteLeave((to, from) => {
  ws.close()
})

</script>

<style>

</style>