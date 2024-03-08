<template>
    <div class="map__top map-top">
        <IconLassoRemove
            v-show="props.drawButtonActive"
            class="map-top__lasso"
            @click="() => emit('toggleDraw', false)"
        />
        <IconLasso
            v-show="!props.drawButtonActive"
            :class="props.drawButtonActive ? 'map-top__lasso_active' : ''"
            @click="() => emit('toggleDraw', true)"
        />
    </div>
</template>

<script setup>
    import './MapTop.scss'

    import IconLasso from "@/components/AppIcons/Lasso/Lasso.vue";
    import IconLassoRemove from "@/components/AppIcons/Lasso/LassoRemove/LassoRemove.vue";

    const props = defineProps({
        drawButtonActive: {
            default: false,
            type: Boolean
        }
    })

    const emit = defineEmits([
        'toggleDraw'
    ])
</script>