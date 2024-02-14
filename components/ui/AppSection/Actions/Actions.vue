<template>
  <div
    v-if="actionState != null"
    class="actions"
  >
    <ButtonsEdit
      v-if="actionState == 'editting'"
      @call-action="(data) => emit('callAction', data)"
    />

    <ButtonsSave
      v-else-if="actionState == 'saving'"
      @call-action="(data) => emit('callAction', data)"
    />

    <ButtonsRestore
      v-else-if="actionState == 'restoring'"
      @call-action="(data) => emit('callAction', data)"
    />
  </div>
</template>

<script setup>
import './Actions.scss'

import ButtonsEdit from './Edit/Edit.vue'
import ButtonsSave from './Save/Save.vue'
import ButtonsRestore from './Restore/Restore.vue'

const emit = defineEmits([
  'callAction'
])

const props = defineProps({
  actionState: {
    default: null,
    type: String
  }
})
</script>
