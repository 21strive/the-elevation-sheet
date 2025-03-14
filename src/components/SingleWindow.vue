<script setup>
import { computed, ref, watch } from 'vue'

import { useTargetItemsStore } from '@/stores/targetItemsStore'
import AppRuler from './AppRuler.vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  borderL: {
    type: Number,
    required: true,
  },
  borderR: {
    type: Number,
    required: true,
  },
  glassX: {
    type: Number,
    required: true,
  },
  borderT: {
    type: Number,
    required: true,
  },
  borderB: {
    type: Number,
    required: true,
  },
  glassY: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['remove', 'update'])

const targetItemsStore = useTargetItemsStore()

const measurement = ref({
  borderL: props.borderL,
  borderR: props.borderR, // Fixed: was using borderB
  glassX: props.glassX,
  borderT: props.borderT,
  borderB: props.borderB,
  glassY: props.glassY,
})

// Watch for prop changes and update local state
watch(
  () => props,
  (newProps) => {
    measurement.value = {
      borderL: newProps.borderL,
      borderR: newProps.borderR,
      glassX: newProps.glassX,
      borderT: newProps.borderT,
      borderB: newProps.borderB,
      glassY: newProps.glassY,
    }
  },
  { deep: true },
)

const width = computed(
  () => measurement.value.borderL + measurement.value.glassX + measurement.value.borderR,
)
const height = computed(
  () => measurement.value.borderT + measurement.value.glassY + measurement.value.borderB,
)

// Scale factor for visualization (mm to pixels)
const scaleFactor = 0.15 // 1.5px for every 10mm

const updateMeasurement = ({ type, value }) => {
  if (value < 10) value = 10 // Minimum dimension

  measurement.value[type] = value

  // Create a new object with all measurement properties
  const updatedItem = {
    borderL: measurement.value.borderL,
    borderR: measurement.value.borderR,
    glassX: measurement.value.glassX,
    borderT: measurement.value.borderT,
    borderB: measurement.value.borderB,
    glassY: measurement.value.glassY,
  }

  emit('update', updatedItem, props.index)
}

const removeItem = () => {
  emit('remove', props.index)
}
</script>

<template>
  <div class="flex flex-row items-start gap-4">
    <div class="flex flex-col items-center gap-4">
      <div class="space-x-2">
        <span class="font-semibold text-blue-700">{{ props.name }}</span>
        <button
          @click="removeItem"
          class="p-1 text-xs leading-none bg-white rounded-full text-red-500 hover:bg-red-100 hover:text-red-700 transition-colors"
        >
          ✕
        </button>
      </div>

      <!-- Window visualization -->
      <div
        class="border border-black"
        :style="{
          width: `${width * scaleFactor}px`,
          height: `${height * scaleFactor}px`,
          padding: `${measurement.borderT * scaleFactor}px ${measurement.borderR * scaleFactor}px ${measurement.borderB * scaleFactor}px ${measurement.borderL * scaleFactor}px`,
        }"
      >
        <div
          class="border border-black w-full h-full bg-cover bg-no-repeat bg-center"
          style="background-image: url('/assets/illustration/glass.png')"
        ></div>
      </div>

      <!-- Dimensions display -->
      <!-- <div class="text-xs text-gray-600">
                <div>Total: {{ (width / 10).toFixed(1) }}cm × {{ (height / 10).toFixed(1) }}cm</div>
                <div>Glass: {{ (measurement.glassX / 10).toFixed(1) }}cm × {{ (measurement.glassY / 10).toFixed(1) }}cm
                </div>
            </div> -->

      <!-- Horizontal measurement rulers -->
      <div
        class="flex flex-col"
        :class="[targetItemsStore.count > 2 && props.index % 2 === 1 && 'mt-8']"
      >
        <div class="flex flex-row">
          <AppRuler
            type="borderL"
            measurementType="width"
            :position="targetItemsStore.count > 2 && props.index % 2 === 0 ? 'up' : 'down'"
            :value="measurement.borderL"
            class="w-full"
            @update-value="updateMeasurement"
          />
          <AppRuler
            type="glassX"
            measurementType="width"
            barrierType="none"
            :position="targetItemsStore.count > 2 && props.index % 2 === 0 ? 'up' : 'down'"
            :value="measurement.glassX"
            class="w-full"
            @update-value="updateMeasurement"
          />
          <AppRuler
            type="borderR"
            measurementType="width"
            :position="targetItemsStore.count > 2 && props.index % 2 === 0 ? 'up' : 'down'"
            :value="measurement.borderR"
            class="w-full"
            @update-value="updateMeasurement"
          />
        </div>

        <AppRuler measurementType="width" :value="width" class="w-full" />
      </div>
    </div>
    <!-- Vertical measurement rulers -->
    <!-- <div class="flex flex-row items-start mt-10">
            <div class="flex flex-col">
                <AppRuler type="borderT" measurementType="height" :value="measurement.borderT"
                    @update-value="updateMeasurement" />
                <AppRuler type="glassY" measurementType="height" barrierType="none" :value="measurement.glassY"
                    @update-value="updateMeasurement" />
                <AppRuler type="borderB" measurementType="height" :value="measurement.borderB"
                    @update-value="updateMeasurement" />
            </div>
            <AppRuler measurementType="height" :value="height" />
        </div> -->
  </div>
</template>
