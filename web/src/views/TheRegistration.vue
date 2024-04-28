<template>
  <div class="form-wrap w-100">
    <form
        @submit.prevent="submit"
        class="mb-2"
    >
      <v-card>
        <v-card-title class="text-h6 font-weight-regular justify-space-between">
          <span>{{ currentTitle }}</span>
        </v-card-title>

        <v-window v-model="step">
          <v-window-item :value="1">
            <v-card-text>
              <base-text-field
                  :label="'Email'"
                  :type="'email'"
                  :placeholder="'example@google.com'"
                  :required-field="true"
              />
              <span class="text-caption text-grey-darken-1"></span>
            </v-card-text>
          </v-window-item>

          <v-window-item :value="2">
            <v-card-text>
              <base-text-field
                  :label="'Пароль'"
                  :type="'password'"
                  :placeholder="'1234567%'"
                  :required-field="true"
              />
              <base-text-field
                  :label="'Повторите пароль'"
                  :type="'password'"
                  :required-field="true"
              />
              <span class="text-caption text-grey-darken-1">
          </span>
            </v-card-text>
          </v-window-item>

          <v-window-item :value="3">
            <div class="pa-4 text-center">
              <h2 class="text-h6 font-weight-light mb-2">
                Спасибо, что зарегистрировались!
              </h2>
            </div>
          </v-window-item>
        </v-window>

        <v-divider></v-divider>

        <v-card-actions>
          <base-button
              v-if="step > 1"
              :size="'small'"
              :variant-btn="'text'"
              @click="step--"
          >
            Назад
          </base-button>
          <v-spacer></v-spacer>
          <base-button
              v-if="step < 3"
              :size="'small'"
              :variant-btn="'flat'"
              @click="step++"
          >
            Вперед
          </base-button>
        </v-card-actions>
      </v-card>
    </form>
    <div>
      <base-button
          @btn-click="routerPush"
          :size="'small'"
          class="w-100 d-flex"
      >
        Вернуться на главную
      </base-button>
    </div>
  </div>

</template>

<script setup>
import {ref, computed} from 'vue';
import router from "@/router";
import BaseButton from "@/components/ui/BaseButton";
import BaseTextField from "@/components/ui/BaseInputField";


const step = ref(1)
const loading = ref(false)


const submit = () => {
  load()
};

const load = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 3000)
};

const currentTitle = computed(() => {
  switch (step.value) {
    case 1:
      return 'Регистрация'
    case 2:
      return 'Создание пароля'
    default:
      return 'Аккаунт создан!'
  }
})

function routerPush() {
  router.push("/")
}

</script>

<style scoped>

</style>
