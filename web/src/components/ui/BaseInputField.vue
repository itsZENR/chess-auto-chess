<template>
  <v-text-field
      v-model="nameValue"
      :required="requiredField"
      :append-inner-icon="appendInnerIcon"
      :type="type"
      :label="label"
      :placeholder="placeholderValue"
      @input="handleInput"
  />
</template>

<script setup>
import {ref} from 'vue';


const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  placeholderValue: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    default: 'text',
    required: false,
  },
  appendInnerIcon: {
    type: String
  },
  requiredField: {
    type: Boolean,
    required: false,
  },
})


const emit = defineEmits({
  'input': [String, Number]
})

const nameValue = ref('');

function handleInput() {
  // При изменении значения nameValue вызываем событие input и передаем текущее значение
  emit('input', nameValue.value);
}

</script>