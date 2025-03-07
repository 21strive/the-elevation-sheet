// stores/targetItemsStore.js
import { defineStore } from 'pinia'
import Type from '../lib/type'

export const useTargetItemsStore = defineStore('targetItems', {
  state: () => ({
    items: [
      {
        name: Type.R,
        borderT: 58,
        borderB: 58,
        glassY: 2884,
      }
    ],
    globalHeight: {
      borderT: 58,
      borderB: 58,
      glassY: 2884,
    }
  }),

  getters: {
    height: (state) =>
      state.globalHeight.borderT + state.globalHeight.glassY + state.globalHeight.borderB,

    count: (state) => state.items.length
  },

  actions: {
    updateItem(updatedItem, index) {
      if (index !== -1 && index < this.items.length) {
        this.items[index] = { ...this.items[index], ...updatedItem };
      }
    },

    removeItem(index) {
      this.items = this.items.filter((_, itemIndex) => itemIndex !== index);
    },

    addItem(item) {
      this.items.push(item);
    },

    updateMeasurement({ type, value }) {
      if (value < 10) value = 10; // Minimum dimension

      this.globalHeight[type] = value;
    },

    setItems(items) {
      this.items = items;
    },

    resetGlobalHeight() {
      this.globalHeight = {
        borderT: 58,
        borderB: 58,
        glassY: 2884,
      };
    }
  }
})