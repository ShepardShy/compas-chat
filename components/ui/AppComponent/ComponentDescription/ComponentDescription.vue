<template>
  <div class="component__description">
    <details class="component__details component-details">
      <summary class="component-details__title">
        {{ props.title }}
      </summary>
      <div
        ref="contentRef"
        class="component-details__content"
      >
        <pre class="component-details__code">
{{ props.code }}
</pre>
        <figure
          class="ibg ibg_copy"
          @click="(event) => copyToClipboard(event)"
        >
          <img
            v-if="copyState"
            src="/public/icons/componentSuccess.svg"
            alt=""
          >
          <img
            v-else
            src="/public/icons/copy.svg"
            alt=""
          >
        </figure>
      </div>
    </details>
  </div>
</template>

<script setup>
import './ComponentDescription.scss'

import { ref } from 'vue'

const copyState = ref(false)
const contentRef = ref(null)

const copyToClipboard = (event) => {
  const range = document.createRange()
  range.selectNode(contentRef.value)
  console.log(range)
  window.getSelection().removeAllRanges()
  window.getSelection().addRange(range)
  document.execCommand('copy')
  window.getSelection().removeAllRanges()
  copyState.value = true

  setTimeout(() => {
    copyState.value = false
  }, 5000)
}

const props = defineProps({
  title: {
    default: '',
    type: String
  },
  code: {
    default: {},
    type: () => Object
  }
})
</script>
