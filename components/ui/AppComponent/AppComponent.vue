<template>
  <div class="component">
    <AppH3
      v-show="![null, undefined].includes(props.title) && props.title != ''"
      class="component__title"
    >
      {{ props.title }}
    </AppH3>

    <ComponentField
      :component="props.component"
      :code-props="props.codeProps"
      @show-all="(data) => emit('showAll', data)"
      @open-link="(data) => emit('openLink', data)"
      @call-action="(data) => emit('callAction', data)"
      @change-value="(data) => emit('changeValue', data)"
      @action-filter="(data) => emit('actionFilter', data)"
      @create-option="(data) => emit('createOption', data)"
      @search-options="(data) => emit('searchOptions', data)"
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
import './AppComponent.scss'

import ComponentField from './ComponentField/ComponentField.vue'
import ComponentDescription from './ComponentDescription/ComponentDescription.vue'
import AppH3 from '@/components/AppH3/AppH3.vue'

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
    type: () => Object
  },
  codeEmits: {
    default: () => ({}),
    type: () => Object
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
