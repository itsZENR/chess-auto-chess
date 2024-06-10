<template>
  <v-col :cols="$vuetify.display.mdAndUp ? 3 : 12">
    <v-row class="d-flex align-center">
      <v-col>
        <base-button
            @btn-click="submit"
            :loading="loading"
            :color="isBtnColor"
            :variantBtn="isBtnVariants"
        >
          Готов
        </base-button>
      </v-col>
      <v-col>
        <span><strong>{{ point }}</strong> point </span>
      </v-col>
    </v-row>
    <v-divider class="my-4"/>
    <v-table
        height="300px"
        fixed-header
    >
      <thead>
      <tr>
        <th class="ma-0 pa-0">
          <base-text
              :min-size="18"
              :max-size="22"
          >
            Ходы
          </base-text>
          <v-divider class="mt-4"/>
        </th>
      </tr>

      </thead>
      <tbody>
      <tr
          v-for="(item, index) in desserts"
          :key="index"
      >
        <td
            class="ma-0 pa-0"
            style="height: 35px"
        >
          <base-text>
            {{ item.step }}
          </base-text>
        </td>
        <!--          <td>{{ item.calories }}</td>-->
      </tr>
      </tbody>
    </v-table>
  </v-col>
</template>

<script setup>
import BaseButton from "@/components/ui/BaseButton";
import BaseText from "@/components/ui/BaseText"
import {ref} from "vue";


const emit = defineEmits(['clickReady'])


const desserts = ref([
  {
    step: 'a1a2',
  },
  {
    step: 'b2b3',
  },
  {
    step: 'a3a4',
  },
  {
    step: 'a3a4',
  },
  {
    step: 'b3',
  },
  {
    step: 'b3',
  },
  {
    step: 'b3',
  },
  {
    step: 'b3',
  },
  {
    step: 'b3',
  },
])
const loading = ref(false)
const point = ref(10)
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

const load = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1000)
};

</script>