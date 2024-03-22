<script setup lang="ts">
import { useSettingsStore } from '~/store/settings'

const settingsStore = useSettingsStore()
const { isMobileSize } = storeToRefs(settingsStore)
</script>

<template>
  <div
    class="day-separator"
    :class="{
      'day-separator_mobile':isMobileSize
    }"
  />
</template>

<style scoped lang="scss">
.day-separator {
  position: relative;
  bottom: 15px;
  width: 100%;
  background-color: #eeeff1;
  height: 1px;
  z-index: 1;
  margin-top: 35px;
  margin-bottom: 35px;
  margin-left: 50px;
}

.day-separator_mobile {
  margin-left: 5px;
}
</style>
