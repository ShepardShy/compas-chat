<script setup lang="ts">
import { useChatsStore } from '~/store/chats'
import { useSettingsStore } from '~/store/settings'

import CameraIcon from '~/assets/icons/camera-icon.svg'
import { imagesTypes } from '~/shared'

/**
 * Входящие пропсы
 */
interface PropsType {
  chatId: number | string | undefined
  isPinned?: boolean | undefined
  isActive?: boolean | undefined
  photo: string | undefined
  chatName: string
  isGroupChat: boolean
  isDetailedMenu?: boolean
  isOpenDialogImage?: boolean
  isPhotoCanBaChanged?: boolean
  groupPhoto?: unknown
}
const props = defineProps<PropsType>()
const { chatId, isPinned, isActive, photo, chatName, isGroupChat, isDetailedMenu, isOpenDialogImage, isPhotoCanBaChanged, groupPhoto } = toRefs(props)

/**
 * Событие компонента
 */
const emit = defineEmits<{(emit: 'update:groupPhoto', loadedPhoto: unknown):void }>()

/**
 * Подключение стора с чатами
 */
const chatsStore = useChatsStore()
const { openedChatId, isGroupChatEditModalOpen, isGroupChatCreateModalOpen } = storeToRefs(chatsStore)
/**
 * Подключение стора с настройками
 */
const settingsStore = useSettingsStore()
const { isMobileSize } = storeToRefs(settingsStore)

/**
 *  Загруженное фото
 */
const loadedPhoto = ref()

/**
 * Инпут для загрузки фото
 */
const $uploadDocuments = ref<HTMLInputElement>()

/**
 * Открыто ли модака для реадктирования или создания
 */
const isEditableMode = computed(() => isGroupChatEditModalOpen.value || isGroupChatCreateModalOpen.value)
/**
 * Фон для кружка индикатора активности на изображении чата
 */
const activeCircleBackgroundColor = computed<string>(() => {
  if (isDetailedMenu.value) {
    return '#fff'
  }

  if (chatId.value === openedChatId.value) {
    return '#eef3f9'
  } else if (isPinned.value) {
    return '#eeeff1'
  } else {
    return '#fff'
  }
})
/**
 * Значения фона для чата
 */
const chatPhoto = computed<string>(() => {
  if (photo.value) {
    return `url(${photo.value})`
  }

  if (isGroupChat.value) {
    return 'linear-gradient(to bottom, #aeee90 2%, #65dd78 100%)'
  } else {
    return 'linear-gradient(to bottom, #71d2fc 2%, #9490ff 100%)'
  }
})

/**
 * Подписка на изменение фото
 */
watch(
  () => loadedPhoto.value,
  () => {
    emit('update:groupPhoto', loadedPhoto.value)
  })

/**
 * При демонтировании компоненты зачищаем значение загруженного фото
 */
onBeforeUnmount(() => loadedPhoto.value = '')

/**
 * Обработка фото
 * @param _event
 */
const onChangeChooseFiles = (_event: unknown) => {
  const _files = _event.target.files

  for (let i = 0; i < _files.length; i++) {
    const _file = _files[i]
    const _imageUrl = URL.createObjectURL(_file)

    if (_file.type.includes('image')) {
      loadedPhoto.value = _imageUrl
    }
  }
}

/**
 * Загрузка фото
 */
const loadPhoto = () => {
  if (isEditableMode.value) {
    $uploadDocuments.value.click()
  }
}
</script>

<template>
  <div
    class="chat__photo"
    :class="{
      'group__photo': isGroupChat,
      'group__photo_edit': isEditableMode,
      'chat__photo_big': isDetailedMenu,
      'chat__photo_mobile': isMobileSize && isOpenDialogImage
    }"
    :style="{
      backgroundImage: chatPhoto
    }"
    @click="loadPhoto"
  >
    <div
      v-if="!photo && !isPhotoCanBaChanged"
      class="chat__photo-name"
      :class="{
        'chat__photo-name_big':isDetailedMenu,
        'chat__photo-name_mobile': isMobileSize && isOpenDialogImage
      }"
    >
      {{ chatName ? chatName[0] : '' }}
    </div>

    <CameraIcon
      v-if="isEditableMode && isPhotoCanBaChanged && !groupPhoto"
      class="chat__camera-icon"
    />
    <input
      ref="$uploadDocuments"
      class="chat__load-photo"
      type="file"
      multiple
      :accept="imagesTypes.join(',')"
      @change="onChangeChooseFiles($event)"
    >

    <div
      v-if="isActive"
      class="chat__active"
      :class="{
        'chat__active-big': isDetailedMenu,
        'chat__active-mobile': isMobileSize && isOpenDialogImage
      }"
      :style="{
        backgroundColor: activeCircleBackgroundColor
      }"
    >
      <div
        class="chat__active-circle"
        :class="{
          'chat__active-circle-big':isDetailedMenu,
          'chat__active-circle-mobile':isMobileSize && isOpenDialogImage
        }"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import './ChatPhoto.scss';
</style>
