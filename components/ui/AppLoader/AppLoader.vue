<template>
  <div
    ref="loaderRef"
    class="loader"
  />
</template>

<script setup>
import './AppLoader.scss'

import { ref } from 'vue'

const loaderRef = ref(null)
</script>
