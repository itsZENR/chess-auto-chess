<template>
  <v-app>
    <v-main>
      <component :is="layoutComponent">
        <router-view/>
      </component>
    </v-main>
  </v-app>
</template>

<script setup>
import {computed} from "vue";
import {useRoute} from "vue-router";
import {postAuth} from "@/api";
import BaseLayout from '@/layouts/BaseLayout.vue';
import LoginLayout from '@/layouts/LoginLayout.vue';

postAuth()

const route = useRoute();

const metaLayout = computed(() => {
  if (route.meta)
    return route.meta.layout;
});

const layoutComponent = computed(() => {
  const layout = metaLayout.value;
  switch (layout) {
    case 'LoginLayout':
      return LoginLayout;
    case 'BaseLayout':
      return BaseLayout;
    default:
      return BaseLayout;
  }
});

</script>

<style lang="css">
@import '~@/assets/css/main.module.css';

</style>