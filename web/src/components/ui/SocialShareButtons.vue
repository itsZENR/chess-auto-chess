<template>
  <div class="d-flex justify-center mb-2 mt-3">
    <v-btn icon @click="share('vk')">
      <v-icon>mdi-vk</v-icon>
    </v-btn>
    <v-btn icon @click="share('telegram')">
      <v-icon>mdi-telegram</v-icon>
    </v-btn>
    <v-btn icon @click="share('facebook')">
      <v-icon>mdi-facebook</v-icon>
    </v-btn>
    <v-btn icon @click="share('twitter')">
      <v-icon>mdi-twitter</v-icon>
    </v-btn>
  </div>
</template>

<script setup>
import {ref} from 'vue';

const urlToShare = ref(window.location.href);

const share = (platform) => {
  let url = '';
  const encodedUrl = encodeURIComponent(urlToShare.value);

  switch (platform) {
    case 'facebook':
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      break;
    case 'twitter':
      url = `https://twitter.com/intent/tweet?url=${encodedUrl}`;
      break;
    case 'vk':
      url = `https://vk.com/share.php?url=${encodedUrl}`;
      break;
    case 'telegram':
      url = `https://t.me/share/url?url=${encodedUrl}`;
      break;
    default:
      return;
  }

  window.open(url, '_blank');
};
</script>

<style scoped>

</style>
