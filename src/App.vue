<script setup>
import { useElementSize } from '@vueuse/core'
import { ref, computed, watch, useTemplateRef } from 'vue'

import draggable from 'vuedraggable'
import SingleWindow from './components/SingleWindow.vue'
import DoubleWindow from './components/DoubleWindow.vue'
import AppRuler from './components/AppRuler.vue'
import Type from './lib/type'
import { useTargetItemsStore } from './stores/targetItemsStore'
import AppVerticalRuler from './components/AppVerticalRuler.vue'

// Initialize the store
const targetItemsStore = useTargetItemsStore()

const vRuler = useTemplateRef('vRuler')
const { width } = useElementSize(vRuler)

// Source items that can be cloned when dragged.
const sourceItems = ref([
  {
    name: Type.SW,
    borderL: 58,
    borderR: 58,
    glassX: 1084,
    // borderT: 58,
    // borderB: 58,
    // glassY: 2884,
  },
  {
    name: Type.DW,
    borderL: 58,
    borderR: 58,
    // borderT: 58,
    // borderB: 58,
    glass1X: 1084,
    dividerX: 58,
    glass2X: 1084,
    // glassY: 2884,
  },
])

// Watch for changes in the target items
watch(
  () => targetItemsStore.items,
  (value) => {
    if (value.length === 1) {
      targetItemsStore.resetGlobalHeight()
    }
  },
  { deep: true },
)

// Reactive search query.
const searchQuery = ref('')

// Computed property to filter source items based on the search query.
const filteredSourceItems = computed(() => {
  if (!searchQuery.value) {
    return sourceItems.value
  }
  // Convert Symbol to string for searching
  return sourceItems.value.filter((item) =>
    String(item.name.description).toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

// Add this near your other refs
const scale = ref(100) // Default scale is 100%

// Method to handle scale change
const handleScaleChange = (value) => {
  scale.value = parseInt(value)
}
</script>

<template>
  <button
    data-drawer-target="logo-sidebar"
    data-drawer-toggle="logo-sidebar"
    aria-controls="logo-sidebar"
    type="button"
    class="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
  >
    <span class="sr-only">Open sidebar</span>
    <svg
      class="w-6 h-6"
      aria-hidden="true"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clip-rule="evenodd"
        fill-rule="evenodd"
        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
      ></path>
    </svg>
  </button>

  <aside
    id="logo-sidebar"
    class="fixed top-0 right-0 z-10 w-[400px] h-screen transition-transform translate-x-full sm:translate-x-0"
    aria-label="Sidebar"
  >
    <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50">
      <form @submit.prevent class="flex items-center max-w-sm mx-auto">
        <label for="simple-search" class="sr-only">Search</label>
        <input
          type="text"
          id="simple-search"
          v-model="searchQuery"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Cari nama item..."
          required
        />
        <button
          type="submit"
          class="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
        >
          <svg
            class="w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
          <span class="sr-only">Search</span>
        </button>
      </form>

      <draggable
        :list="filteredSourceItems"
        :group="{ name: 'items', pull: 'clone', put: false }"
        class="grid grid-cols-2 gap-4 mt-5"
      >
        <template #item="{ element }">
          <div
            :key="element.id"
            class="flex flex-col gap-2 cursor-grab p-2 hover:bg-gray-100 rounded-lg"
          >
            <div
              v-if="element.name === Type.SW"
              class="h-40 w-[180px] bg-blue-100 border border-blue-500 flex items-center justify-center"
            >
              <div class="text-blue-800 font-medium">{{ element.name.description }}</div>
            </div>
            <div
              v-if="element.name === Type.DW"
              class="h-40 w-[180px] bg-green-100 border border-green-500 flex items-center justify-center"
            >
              <div class="text-green-800 font-medium">{{ element.name.description }}</div>
            </div>
            <span class="text-sm font-medium">{{ element.name.description }}</span>
          </div>
        </template>
      </draggable>
    </div>
  </aside>

  <div class="flex flex-col gap-4 p-4 sm:mr-[400px] h-screen">
    <div
      class="relative flex-1 flex flex-col p-4 border-2 border-gray-400 border-dashed rounded-lg"
    >
      <div
        v-if="targetItemsStore.items.length === 0"
        class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex flex-col items-center"
      >
        <span class="text-lg font-semibold">Target Area</span>
        <span class="text-sm text-gray-500">Gulirkan item kesini</span>
      </div>
      <draggable
        v-model="targetItemsStore.items"
        group="items"
        class="flex flex-row items-center h-full w-full overflow-x-auto origin-center"
        :style="{
          'justify-content': 'safe center',
          transform: `scale(${scale / 100})`,
          'transform-origin': 'center',
        }"
      >
        <template #item="{ element, index }">
          <div :key="index" class="flex-shrink-0">
            <!-- Vertical measurement rulers -->
            <div
              ref="vRuler"
              v-if="element.name === Type.R && targetItemsStore.items.length > 1"
              class="flex gap-2 items-start place-items-start mb-44"
              :class="{
                'mt-[72px]': targetItemsStore.count === 2,
                'mt-10': targetItemsStore.count !== 2,
                'flex-row-reverse ml-4': targetItemsStore.isRulerReverse,
                'flex-row mr-4': !targetItemsStore.isRulerReverse,
              }"
            >
              <AppVerticalRuler type="height" :value="targetItemsStore.height" />
              <div class="flex flex-col">
                <AppVerticalRuler
                  type="borderT"
                  :value="targetItemsStore.globalHeight.borderT"
                  @update-value="targetItemsStore.updateMeasurement"
                />
                <AppVerticalRuler
                  type="glassY"
                  barrierType="none"
                  :value="targetItemsStore.globalHeight.glassY"
                  @update-value="targetItemsStore.updateMeasurement"
                />
                <AppVerticalRuler
                  type="borderB"
                  :value="targetItemsStore.globalHeight.borderB"
                  @update-value="targetItemsStore.updateMeasurement"
                />
              </div>
            </div>
            <SingleWindow
              v-if="element.name === Type.SW"
              :index="index"
              v-bind="element"
              :name="element.name.description"
              :border-t="targetItemsStore.globalHeight.borderT"
              :border-b="targetItemsStore.globalHeight.borderB"
              :glass-y="targetItemsStore.globalHeight.glassY"
              @update="targetItemsStore.updateItem"
              @remove="targetItemsStore.removeItem"
            />
            <DoubleWindow
              v-if="element.name === Type.DW"
              :index="index"
              v-bind="element"
              :name="element.name.description"
              :border-t="targetItemsStore.globalHeight.borderT"
              :border-b="targetItemsStore.globalHeight.borderB"
              :glass-y="targetItemsStore.globalHeight.glassY"
              @update="targetItemsStore.updateItem"
              @remove="targetItemsStore.removeItem"
            />
          </div>
        </template>
      </draggable>

      <div
        v-if="targetItemsStore.items.length > 2"
        class="flex flex-col self-center"
        :style="{
          marginLeft: targetItemsStore.isRulerReverse ? '0px' : `${Math.floor(width) + 16}px`,
          marginRight: targetItemsStore.isRulerReverse ? `${Math.floor(width) + 16}px` : '0px',
        }"
      >
        <AppRuler measurementType="width" :value="targetItemsStore.width" />
      </div>

      <div class="absolute bottom-4 right-4 max-w-xs mx-auto">
        <select
          v-model="scale"
          @change="handleScaleChange($event.target.value)"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        >
          <option v-for="option in [50, 75, 100, 125, 150]" :key="option" :value="option">
            {{ option }}%
          </option>
        </select>
      </div>
    </div>

    <div
      class="flex-none flex flex-row justify-between text-lg font-semibold bg-gray-100 p-4 rounded-lg"
    >
      <!-- <span>Width: {{ totalWidth }}cm</span>
      <span>Height: {{ totalHeight }}cm</span> -->
      <span>Jumlah: {{ targetItemsStore.count }} Item</span>
    </div>
  </div>
</template>
