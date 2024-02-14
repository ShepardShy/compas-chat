<template>
    <div class="loader" ref="loaderRef"></div>
</template>

<script setup>
    import './AppLoader.scss';
    
    import { ref } from 'vue'

    const loaderRef = ref(null)
</script>
