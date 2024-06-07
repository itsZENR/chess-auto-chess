<template>
  <div class="text-center pa-4">
    <v-dialog
        v-model="dialog"
        width="auto"
    >
      <v-card
          max-width="500"
          title="Ссылка на приглашение:"
      >
        <template v-slot:actions>
          <input
              ref="urlElement"
              :value="urlValue"
              type="text"
              readonly
              style="color: grey"
          >
          <v-btn
              class="mr-2"
              @click="copyText()"
          >
            <v-icon>mdi-content-copy</v-icon>
          </v-btn>
          <v-btn
              class="ms-auto"
              text="Закрыть"
              @click="dialog = false"
          ></v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import {ref} from "vue";
import {useRoute} from "vue-router";


const route = useRoute();

const dialog = ref(true)
const urlValue = ref(`${window.location.origin}${route.fullPath}`);
const urlElement = ref()

function copyText() {
  let textToCopy = urlElement.value
  textToCopy.select();
  textToCopy.setSelectionRange(0, 99999); /* For mobile devices */
  document.execCommand("copy");
}

</script>