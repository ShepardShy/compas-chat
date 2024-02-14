<template>
  <div class="filter__menu">
    <Fields
      @action-filter="(data) => emit('actionFilter', data)"
    />
    <Saves
      @action-saves="(data) => emit('actionSaves', data)"
    />
    <Actions
      @action-saves="(data) => emit('actionSaves', data)"
      @action-filter="(data) => emit('actionFilter', data)"
    />
  </div>
</template>

<script setup>
import './FilterMenu.scss'

import Saves from './Saves/Saves.vue'
import Fields from './Fields/Fields.vue'
import Actions from './Actions/Actions.vue'

const emit = defineEmits([
  'actionSaves',
  'actionFilter'
])

</script>
