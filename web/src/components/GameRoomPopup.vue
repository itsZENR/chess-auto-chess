<template>
  <div class="text-center pa-4">
    <v-dialog
        v-model="isShow"
        width="auto"
        persistent
    >
      <slot>
        <v-card
            max-width="500"
        >
          <v-card-title
              class="d-flex justify-center"
          >
            Ссылка на приглашение:
          </v-card-title>
          <v-card-actions class="d-flex flex-wrap justify-center">
            <input
                ref="urlElement"
                :value="urlValue"
                type="text"
                readonly
                style="color: grey"
            >
            <v-btn
                @click="copyText()"
            >
              <v-icon>mdi-content-copy</v-icon>
            </v-btn>
            <SocialShareButtons/>
<!--            <v-btn-->
<!--                class="ms-auto"-->
<!--                text="Закрыть"-->
<!--                @click="popupClose"-->
<!--            ></v-btn>-->
          </v-card-actions>
        </v-card>
      </slot>
    </v-dialog>
  </div>
</template>

<script setup>
import {ref, toRefs} from "vue";
import {useRoute} from "vue-router";
import SocialShareButtons from "@/components/ui/SocialShareButtons";


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