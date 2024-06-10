<template>
  <div class="text-center pa-4">
    <v-dialog
        v-model="isShow"
        width="auto"
        persistent
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
              @click="popupClose"
          ></v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import {ref, toRefs} from "vue";
import {useRoute} from "vue-router";


const props = defineProps({
  isShow: Boolean,
});

const {isShow} = toRefs(props);

const emit = defineEmits({
  'popupClose': null
})


function popupClose() {
  emit("popupClose")
}

const route = useRoute();

const urlValue = ref(`${window.location.origin}${route.fullPath}`);
const urlElement = ref()

function copyText() {
  let textToCopy = urlElement.value
  textToCopy.select();
  textToCopy.setSelectionRange(0, 99999); /* For mobile devices */
  document.execCommand("copy");
}

</script>