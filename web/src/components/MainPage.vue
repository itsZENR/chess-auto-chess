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

function routerPush() {
  router.push("/game")
  // TODO отправка post запроса на создание комнаты
}

</script>
