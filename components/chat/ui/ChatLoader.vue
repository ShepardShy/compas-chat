<script setup lang="ts">

</script>

<template>
  <div class="loader">
    <span />
    <span />
    <span />
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/_variables.scss' as variables;

.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.loader span {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: variables.$color-blue;
  margin: 0 4px;
  animation: loaderAnimation 1s infinite ease-in-out;
}

@keyframes loaderAnimation {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
</style>
