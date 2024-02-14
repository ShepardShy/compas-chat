<template>
    <div class="component__field">
        <div class="component__type">
            {{ props.type }}
        </div>
        <div class="component__method">
            {{ props.method }}
        </div>
    </div>
</template>

<script setup>
    import './componentAlternative.scss';
    
    const props = defineProps({
        type: {
            default: null,
            type: String
        },
        method: {
            default: null,
            type: String
        }
    })
</script>
