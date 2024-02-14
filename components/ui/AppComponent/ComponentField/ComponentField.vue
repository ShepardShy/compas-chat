<template>
  <div class="component__field">
    <component
      :is="props.component"
      :saves="props.codeProps.saves != undefined ? props.codeProps.saves.default : null"
      :fields="props.codeProps.fields != undefined ? props.codeProps.fields.default : null"
      :tabs="props.codeProps.tabs != undefined ? props.codeProps.tabs.default : null"
      :item="props.codeProps.item != undefined ? props.codeProps.item.default : null"
      :disabled="props.codeProps.mask != undefined ? props.codeProps.disabled.default : null"
      :mask="props.codeProps.mask != undefined ? props.codeProps.mask.default : null"
      :table="props.codeProps.table != undefined ? props.codeProps.table.default : null"
      :menu="props.codeProps.menu != undefined ? props.codeProps.menu.default : null"
      :slug="props.codeProps.slug != undefined ? props.codeProps.slug.default : null"
      :is-trash="props.codeProps.isTrash != undefined ? props.codeProps.isTrash.default : null"
      :is-multiple="props.codeProps.isMultiple != undefined ? props.codeProps.isMultiple.default : null"
      :is-filtered="props.codeProps.isFiltered != undefined ? props.codeProps.isFiltered.default : null"
      :is-use-enter="props.codeProps.isUseEnter != undefined ? props.codeProps.isUseEnter.default : null"
      :is-read-only="props.codeProps.isReadOnly != undefined ? props.codeProps.isReadOnly.default : null"
      :is-show-file-name="props.codeProps.isShowFileName != undefined ? props.codeProps.isShowFileName.default : null"
      :is-one-file="props.codeProps.isOneFile != undefined ? props.codeProps.isOneFile.default : null"
      :is-can-create="props.codeProps.isCanCreate != undefined ? props.codeProps.isCanCreate.default : null"
      :is-have-null-option="props.codeProps.isHaveNullOption != undefined ? props.codeProps.isHaveNullOption.default : null"
      :enabled-autocomplete="props.codeProps.enabledAutocomplete != undefined ? props.codeProps.enabledAutocomplete.default : null"
      @show-all="(data) => emit('showAll', data)"
      @open-link="(data) => emit('openLink', data)"
      @call-action="(data) => emit('callAction', data)"
      @change-value="(data) => emit('changeValue', data)"
      @action-filter="(data) => emit('actionFilter', data)"
      @create-option="(data) => emit('createOption', data)"
      @search-options="(data) => emit('searchOptions', data)"
    />
  </div>
</template>

<script setup>
import './ComponentField.scss'

const props = defineProps({
  component: {
    default: null
  },
  codeProps: {
    default: {},
    type: () => Object
  }
})

const emit = defineEmits([
  'showAll',
  'openLink',
  'changeValue',
  'callAction',
  'actionFilter',
  'createOption',
  'searchOptions'
])
</script>
