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
import {createRoom} from "@/api";
import {ref} from "vue";


const idRoom = ref()

async function routerPush() {
  await router.push("/game")
  idRoom.value = await createRoom()
  console.log("idRoom", idRoom.value)
}

</script>
