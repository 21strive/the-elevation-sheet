<script setup>
import { ref, computed } from 'vue'
import draggable from 'vuedraggable'
import SingleWindow from './components/SingleWindow.vue';

const Type = Object.freeze({
  SW: Symbol("Single Wndow"),
  BLUE: Symbol("blue"),
  GREEN: Symbol("green")
});

// Source items that can be cloned when dragged.
const sourceItems = ref([
  { id: 1, name: Type.SW, color: 'red', width: 1200, height: 3000 },
  { id: 2, name: 'Item 2', color: 'blue', width: 120, height: 300 },
])

// Target items start empty and will be populated by cloned items.
const targetItems = ref([
])

// Reactive search query.
const searchQuery = ref('')

// Computed property to filter source items based on the search query.
const filteredSourceItems = computed(() => {
  if (!searchQuery.value) {
    return sourceItems.value
  }
  return sourceItems.value.filter(item =>
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// Remove function: filters out the item with the provided id from the target list.
function removeItem(id) {
  targetItems.value = targetItems.value.filter(item => item.id !== id)
}
</script>

<template>
  <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button"
    class="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
    <span class="sr-only">Open sidebar</span>
    <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path clip-rule="evenodd" fill-rule="evenodd"
        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z">
      </path>
    </svg>
  </button>

  <aside id="logo-sidebar"
    class="fixed top-0 right-0 z-40 w-[400px] h-screen transition-transform translate-x-full sm:translate-x-0"
    aria-label="Sidebar">
    <div class="h-full px-3 py-4 overflow-y-hidden bg-gray-50 dark:bg-gray-800">
      <form @submit.prevent class="flex items-center max-w-sm mx-auto">
        <label for="simple-search" class="sr-only">Search</label>
        <input type="text" id="simple-search" v-model="searchQuery"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Cari nama item..." required />
        <button type="submit"
          class="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
          </svg>
          <span class="sr-only">Search</span>
        </button>
      </form>

      <draggable :list="filteredSourceItems" :group="{ name: 'items', pull: 'clone', put: false }"
        class="grid grid-cols-2 gap-4 mt-5">
        <template #item="{ element }">
          <div :key="element.id" class="flex flex-col gap-2">
            <div class="h-40 w-[180px]" :class="element.color === 'blue' ? 'bg-blue-500' : `bg-${element.color}-500`">
            </div>
            <span>{{ element.name }}</span>
          </div>
        </template>
      </draggable>
    </div>
  </aside>

  <div class="flex flex-col gap-4 p-4 sm:mr-[400px] h-screen">
    <div class="relative flex-1 p-4 border-2 border-gray-400 border-dashed rounded-lg">
      <div v-if="targetItems.length === 0"
        class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <span class="text-lg font-semibold">Target Area</span>
        <span class="text-sm text-gray-500">Gulirkan item kesini</span>
      </div>
      <draggable v-model="targetItems" group="items"
        class="flex flex-row items-center justify-center h-full w-full overflow-x-scroll">
        <template #item="{ element }">
          <SingleWindow :key="element.id" v-bind="element" :name="element.name.description" />
        </template>
      </draggable>
    </div>

    <div class="flex-none flex flex-row justify-between text-lg font-semibold">
      <span>X: 100cm</span>
      <span>Y: 100cm</span>
      <span>Jumlah: {{ targetItems.length }} Item</span>
    </div>
  </div>
</template>
