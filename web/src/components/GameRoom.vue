<template>
  <v-row class="justify-center">
    <game-room-popap/>
    <game-room-board
        :isReady="isReady"
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


const route = useRoute();

const {ws} = connectWebsocket(route.params.idRoom)

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