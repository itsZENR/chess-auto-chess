<template>
  <base-button
      @btn-click="routerPush"
  >
    Играть
  </base-button>
</template>

<script setup>
import router from "@/router";
import BaseButton from "@/components/ui/BaseButton";
import {createRoom, getAuth} from "@/api";
import {ref} from "vue";

getAuth()

const idRoom = ref()

async function routerPush() {
  idRoom.value = await createRoom()
  await router.push({
    name: 'game',
    params: {idRoom: idRoom.value.room_name}
  });
}

</script>
