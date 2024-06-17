<template>
  <v-app-bar
      scroll-behavior="hide"
      scroll-threshold="100"
      :elevation="8"
  >
    <v-container class="d-flex">
      <v-row no-gutters class="d-flex align-center">
        <v-sheet class="mx-2">
          <v-app-bar-title>
            <router-link to="/">
              <base-icon
                  fill="#ffffff"
                  width="50px"
              />
            </router-link>
          </v-app-bar-title>
        </v-sheet>
        <v-sheet class="d-flex mx-2">
          <nav>
            <router-link to="/" class="router-link mx-2">Главная</router-link>
          </nav>
          <nav>
            <router-link to="/about" class="router-link mx-2">О нас</router-link>
          </nav>
        </v-sheet>
      </v-row>

      <div
          v-if="false"
          class="pa-2"
      >
        <base-button
            @btn-click="routerPush"
            :size="'small'"
        >
          Войти
        </base-button>
      </div>
    </v-container>

  </v-app-bar>
</template>

<script setup>
import router from "@/router";
import BaseButton from "@/components/ui/BaseButton";
import BaseIcon from "@/components/ui/BaseIcon";


function routerPush() {
  router.push("/login")
}

</script>

<style>
.router-link:hover {
  text-decoration: underline;
}

</style>