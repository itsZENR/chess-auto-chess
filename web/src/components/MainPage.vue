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
import {useAuthorization} from "@/components/composable/useAuthorization";


const {authorization} = useAuthorization()
authorization()

const idRoom = ref()

async function routerPush() {
  idRoom.value = await createRoom()
  await router.push({
    name: 'game',
    params: {idRoom: idRoom.value.room_name}
  });
}

</script>
