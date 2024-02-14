<template>
    <div class="component">
        <AppH3 class="component__title" v-show="![null, undefined].includes(props.title) && props.title != ''">
            {{ props.title }}
        </AppH3>

        <ComponentField 
            :component="props.component"
            :codeProps="props.codeProps"
            @showAll="(data) => emit('showAll', data)"
            @openLink="(data) => emit('openLink', data)"
            @callAction="(data) => emit('callAction', data)"
            @changeValue="(data) => emit('changeValue', data)"
            @actionFilter="(data) => emit('actionFilter', data)"
            @createOption="(data) => emit('createOption', data)"
            @searchOptions="(data) => emit('searchOptions', data)"
        />

        <ComponentDescription 
            :title="'Props'"
            :code="props.codeProps"
        />
        <ComponentDescription 
            :title="'Emits'"
            :code="props.codeEmits"
        />
    </div>
</template>

<script setup>
    import './AppComponent.scss';
    
    import AppH3 from '@/components/AppH3/AppH3.vue'
    import ComponentField from './ComponentField/ComponentField.vue';
    import ComponentDescription from './ComponentDescription/ComponentDescription.vue';

    const props = defineProps({
        title: {
            default: '',
            type: String
        },
        component: {
            default: null
        },
        codeProps: {
            default: {},
            type: Object
        },
        codeEmits: {
            default: {},
            type: Object
        }
    })

    const emit = defineEmits([
        'showAll',
        'openLink',
        'callAction',
        'changeValue',
        'actionFilter',
        'createOption',
        'searchOptions'
    ])
</script>
