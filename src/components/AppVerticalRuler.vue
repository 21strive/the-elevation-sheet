<script setup>
import { computed, ref } from 'vue'
import RulerDialog from './RulerDialog.vue'
import { useTargetItemsStore } from '@/stores/targetItemsStore'

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  barrierType: {
    type: String,
    default: 'both',
    validator: (value) => ['none', 'start', 'end', 'both'].includes(value),
  },
  position: {
    type: String,
    default: 'down',
    validator: (value) => ['up', 'down'].includes(value),
  },
  value: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['updateValue'])

const targetItemsStore = useTargetItemsStore()

const scaleFactor = 0.15 // 1.5px for every 10mm

const computedValue = computed(() => {
  if (props.barrierType === 'none') {
    return Math.round(props.value * scaleFactor) - 1
  } else {
    return Math.round(props.value * scaleFactor) - 4
  }
})

const openDialog = ref(false)

const handleSubmit = (value) => {
  emit('updateValue', { type: props.type, value })
}
</script>

<template>
  <div
    class="relative flex items-center gap-1"
    :class="{
      'flex-row-reverse': !targetItemsStore.isRulerReverse,
    }"
  >
    <button
      v-if="props.position === 'up'"
      @click="openDialog = true"
      class="text-lg hover:underline leading-[1px]"
    >
      {{ props.value }}
    </button>

    <div v-if="props.barrierType === 'none'" class="w-[11px]"></div>

    <div class="flex flex-col items-center">
      <div
        v-if="props.barrierType === 'start' || props.barrierType === 'both'"
        class="h-0.5 w-8 bg-black"
      ></div>
      <div class="w-0.5 bg-black" :style="{ height: `${computedValue}px` }"></div>
      <div
        v-if="props.barrierType === 'end' || props.barrierType === 'both'"
        class="h-0.5 w-8 bg-black"
      ></div>
    </div>

    <button
      v-if="props.position === 'down'"
      @click="openDialog = true"
      class="text-lg hover:underline leading-[1px]"
    >
      {{ props.value }}
    </button>
  </div>

  <RulerDialog
    :value="props.value"
    :is-open="openDialog"
    @close="openDialog = false"
    @update-value="handleSubmit"
  />
</template>
