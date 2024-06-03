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
import {computed, onMounted} from "vue";
import {useRoute} from "vue-router";

import BaseLayout from '@/layouts/BaseLayout.vue';
import LoginLayout from '@/layouts/LoginLayout.vue';
import {getUsers} from "@/api";


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

onMounted(async () => {
  const listUsers = await getUsers()
  console.log("Все пользователи", listUsers)
})

</script>

<style lang="css">
@import '~@/assets/css/main.module.css';

</style>