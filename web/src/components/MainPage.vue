<template>
  <base-button
      @btn-click="routerPush"
      :disabled="isDisable"
      :loading="loading"
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
const isDisable = ref(false)
const loading = ref(false)

async function routerPush() {
  loading.value = true
  isDisable.value = true
  idRoom.value = await createRoom()
  await router.push({
    name: 'game',
    params: {idRoom: idRoom.value.room_name}
  });
  loading.value = false
}

</script>
