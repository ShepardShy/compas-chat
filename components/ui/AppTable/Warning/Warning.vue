<template>
    <WarningDelete 
        v-if="isShow.state && isShow.type == 'delete'"
    />

    <WarningRestore 
        v-else-if="isShow.state && isShow.type == 'restore'"
    />

    <WarningValidation 
        v-else-if="isShow.state && isShow.type == 'validation'"
    />
</template>

<script setup>
    import './Warning.scss';
    
    import { inject } from 'vue'

    import WarningDelete from './Delete/Delete.vue'
    import WarningRestore from './Restore/Restore.vue'
    import WarningValidation from './Validation/Validation.vue'

    const isShow = inject('isShow')

</script>
