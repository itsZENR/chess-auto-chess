<template>
  <div class="w-100">
    <form
        @submit.prevent="submit"
        class="mb-4"
    >
      <base-text-field
          :label="'Логин'"
          :type="'text'"
          :required-field="true"
      />
      <base-text-field
          :label="'Пароль'"
          :type="'password'"
          :required-field="true"
      />

      <!--    <v-checkbox-->
      <!--        v-model="checkboxValue"-->
      <!--        required-->
      <!--        :error-messages="v$.checkboxValue.$errors.map(e => e.$message)"-->
      <!--        label="Согласие на обработку персональных данных"-->
      <!--        type="checkbox"-->
      <!--        value="1"-->
      <!--        @blur="v$.checkboxValue.$touch"-->
      <!--        @change="v$.checkboxValue.$touch"-->
      <!--    ></v-checkbox>-->

      <base-button
          :loading="loading"
          type="submit"
          class="d-flex justify-center w-100"
      >
        Войти
      </base-button>
    </form>
    <div>
      <base-button
          @btn-click="routerPush('registration')"
          :size="'small'"
          class="w-100 mb-2"
      >
        Регистрация
      </base-button>
      <base-button
          @btn-click="routerPush"
          :size="'small'"
          class="w-100"
      >
        Вернуться на главную
      </base-button>
    </div>
  </div>

</template>

<script setup>
import {ref} from 'vue';
import {useVuelidate} from '@vuelidate/core';
import {required, email} from '@vuelidate/validators';
import router from "@/router";
import BaseButton from "@/components/ui/BaseButton";
import BaseTextField from "@/components/ui/BaseInputField";

// Инициализация состояния для каждого поля формы
const nameValue = ref('');
const passwordValue = ref('');
const emailValue = ref('');
const checkboxValue = ref(false);

const loading = ref(false)

// Определение правил проверки для каждого поля
const rules = {
  nameValue: {required},
  passwordValue: {required},
  emailValue: {required, email},
  checkboxValue: {required}
};

// Создание объекта правил проверки с использованием Vuelidate
const v$ = useVuelidate(rules, {nameValue, passwordValue, emailValue, checkboxValue});

// Функция для обработки отправки формы
const submit = () => {
  load()


  // Выполняем проверку валидности формы
  v$.value.$touch();
  // Если форма валидна, выполняем отправку данных
  if (!v$.value.$error) {
    console.log('Form submitted successfully!');
  }
};

const load = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 3000)
};

function routerPush(routerName) {
  if (routerName) {
    router.push(`/${routerName}`)
  } else {
    router.push(`/`)
  }
}

</script>

<style scoped>

</style>
