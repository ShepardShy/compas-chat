<template>
    <main class="main">
        <AppH1 class="main__title">
            {{ props.activeLink.name }}
        </AppH1>

        <div class="main__content" :class="`main__content_${props.activeLink.slug}`">
            <component 
                :is="props.activeLink.component"
            />
        </div>
    </main>
</template>

<script setup>
    import './AppMain.scss';
    
    import AppH1 from '@/components/AppH1/AppH1.vue';

    const props = defineProps({
        activeLink: {
            default: {},
            type: Object
        }
    })
</script>
