<template>
    <div class="component">
        <AppH3 class="component__title" v-show="![null, undefined].includes(props.title) && props.title != ''">
            {{ props.title }}
        </AppH3>

        <componentAlternative 
            :type="props.type"
            :method="props.method"
        />

        <ComponentDescription 
            v-if="props.request != null"
            :title="'Request'"
            :code="props.request"
        />
        <ComponentDescription 
            :title="'Response'"
            :code="props.response"
        />
    </div>
</template>

<script setup>
    import './Backend.scss';
    

    import AppH3 from '@/components/AppH3/AppH3.vue'
    import componentAlternative from './componentAlternative/componentAlternative.vue';
    import ComponentDescription from '../ComponentDescription/ComponentDescription.vue';

    const props = defineProps({
        type: {
            default: '',
            type: String
        },
        method: {
            default: '',
            type: String
        },
        title: {
            default: '',
            type: String
        },
        request: {
            default: {},
            type: Object
        },
        response: {
            default: {},
            type: Object
        }
    })

</script>
