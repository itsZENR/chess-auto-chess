<template>
  <v-btn
      @click="handleClick"
      :color="color"
      rounded="0"
      :variant="variantBtn"
      :size="size"
  >
    <slot></slot>
  </v-btn>
</template>

<script setup>

const props = defineProps({
  size: {
    String,
    default: "large",
    required: false
  },
  color: {
    String,
    default: "primary",
    required: false
  },
  variantBtn: {
    String,
    default: "outlined",
    required: false
  },
  colorText: {
    String,
    default: "text-primary",
    required: false
  }
})


const emit = defineEmits({
  'btnClick': null
})

function handleClick() {
  emit("btnClick")
}

</script>