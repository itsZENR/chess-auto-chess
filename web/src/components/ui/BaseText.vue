<template>
  <component
      :is="tag"
      :style="{
      fontSize: calcSize ? calcSize: size,
      fontWeight: weight,
    }"
  >
    <slot></slot>
  </component>
</template>

<script setup>
import {computed} from 'vue';


const props = defineProps({
  size: {
    type: String,
    default: '16px',
  },
  minSize: {
    type: Number,
    default: 0,
    required: false,
  },
  maxSize: {
    type: Number,
    default: 0,
    required: false,
  },
  weight: {
    type: String,
    default: "400",
  },
  text: {
    type: [String, Number],
    default: "",
  },
  tag: {
    type: String,
    default: "p",
  },
})

const calcSize = computed(() => {
  if (props.minSize == 0) {
    return null
  }
  return `calc(${props.minSize}px + ${props.maxSize - props.minSize} * ((100vw - 320px) / 1920))`;
})


</script>
