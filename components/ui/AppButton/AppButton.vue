<template>
    <button :disabled="props.disabled">
        <span>
            <slot> </slot>
        </span>
    </button>
</template>

<script setup>
    import './AppButton.scss';
    
    const props = defineProps({
        disabled: {
            default: false,
            type: Boolean
        }
    })
</script>
