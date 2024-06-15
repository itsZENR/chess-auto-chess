<template>
  <v-col :cols="$vuetify.display.mdAndUp ? 3 : 12">
    <v-row class="d-flex align-center">
      <v-col>
        <base-button
            @btn-click="submit"
            :loading="loading"
            :color="isBtnColor"
            :variantBtn="isBtnVariants"
            :disabled="gameStart"
        >
          Готов
        </base-button>
      </v-col>
      <v-col>
        <span><strong>{{ totalPoints }}</strong> очков </span>
      </v-col>
    </v-row>
    <v-divider class="my-4"/>
    <v-table
        height="400px"
        fixed-header
    >
      <thead>
      <tr>
        <th
            v-if="allStepsMove.length"
            class="ma-0 pa-0">
          <base-text

              :min-size="18"
              :max-size="22"
          >
            Ход: {{ stepsInPairs.length }}
          </base-text>
          <v-divider class="mt-4"/>
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(pair, index) in stepsInPairs" :key="index">

        <td class="d-flex ma-0 pa-0" style="height: 35px">
          <base-text
              style="color: grey; width: 35px"
          >
            {{ index + 1 }}.
          </base-text>
          <base-text>
            <template v-for="(move, moveIndex) in pair" :key="moveIndex">
              <span
                  v-if="moveIndex > 0"
                  class="mr-6"
              ></span>
              <span
                  style="display: inline-block;width: 65px"
              >
                {{ formatMove(move) }}
              </span>
            </template>
          </base-text>
        </td>
      </tr>
      </tbody>
    </v-table>
  </v-col>
</template>

<script setup>
import BaseButton from "@/components/ui/BaseButton";
import BaseText from "@/components/ui/BaseText"
import {ref, toRefs, watch, computed} from "vue";


const props = defineProps({
  totalPoints: Number,
  gameStart: Boolean,
  allStepsMove: Array,
});

const {totalPoints, gameStart, allStepsMove} = toRefs(props);

const emit = defineEmits(['clickReady'])


const loading = ref(false)
const isReady = ref(false)
const isBtnVariants = ref('outlined')
const isBtnColor = ref('primary')

const submit = () => {
  emit("clickReady");
  load()
  changeActiveBtn(isReady, isBtnVariants, isBtnColor)
};

const changeActiveBtn = (isReady, isBtnVariants, isBtnColor) => {
  isReady.value = !isReady.value
  if (isReady.value) {
    isBtnVariants.value = 'elevated'
    isBtnColor.value = 'green-darken-3'
  } else {
    isBtnVariants.value = 'outlined'
    isBtnColor.value = 'primary'
  }
}

watch(gameStart, () => {
  if (gameStart.value) {
    isBtnVariants.value = 'outlined'
    isBtnColor.value = 'primary'
  }
})

const load = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1000)
};

const stepsInPairs = computed(() => {
  const pairs = [];
  for (let i = 0; i < allStepsMove.value.length; i += 2) {
    const pair = allStepsMove.value.slice(i, i + 2);
    pairs.push(pair);
  }
  return pairs;
});

function formatMove(move) {
  const parts = move.match(/.{2}/g);
  return `${parts[0]} -> ${parts[1]}`;
}

</script>
