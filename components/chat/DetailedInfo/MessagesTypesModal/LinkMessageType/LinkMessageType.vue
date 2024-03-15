<script setup lang="ts">

interface PropsType {
  linkMessages: any[]
}

</script>

<template>
  <div
    class="photo-message"
  />
</template>

<style scoped lang="scss">
@use '~/assets/styles/_variables.scss' as variables;

.photo-message {
  padding: 0 25px;
}

.photo-message__date {
  text-align: center;
  margin-bottom: 25px;
  font-size: 20px;
  font-weight: 400;
  color: variables.$color-black;
}

.photo-message__images-wrapper {
  display: grid;
  grid-gap: 5px;
  grid-template-columns: repeat(3, 1fr);
}

.photo-message__image {
  border-radius: 5px;
  height: 113px;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}
</style>
