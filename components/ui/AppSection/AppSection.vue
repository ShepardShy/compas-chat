<template>
  <section ref="sectionRef">
    <slot />
  </section>
</template>

<script setup>
import './AppSection.scss'

import { ref } from 'vue'

const sectionRef = ref()

defineExpose({
  sectionRef
})
</script>
