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
      },
    ],
    globalHeight: {
      borderT: 58,
      borderB: 58,
      glassY: 2884,
    },
  }),

  getters: {
    height: (state) =>
      state.globalHeight.borderT + state.globalHeight.glassY + state.globalHeight.borderB,

    width: (state) => {
      // Calculate the total width of all windows
      return state.items
        .filter((item) => item.name !== Type.R)
        .reduce((total, item) => {
          if (item.name === Type.SW) {
            return total + item.borderL + item.glassX + item.borderR
          } else if (item.name === Type.DW) {
            return total + item.borderL + item.glass1X + item.dividerX + item.glass2X + item.borderR
          }
          return total
        }, 0)
    },

    count: (state) => state.items.length,

    isRulerReverse: (state) => {
      // return state.items.length % 2 !== 0
      // check if the last item is a ruler
      return state.items[state.items.length - 1].name === Type.R
    },
  },

  actions: {
    updateItem(updatedItem, index) {
      if (index !== -1 && index < this.items.length) {
        this.items[index] = { ...this.items[index], ...updatedItem }
      }
    },

    removeItem(index) {
      this.items = this.items.filter((_, itemIndex) => itemIndex !== index)
    },

    addItem(item) {
      this.items.push(item)
    },

    updateMeasurement({ type, value }) {
      if (value < 10) value = 10 // Minimum dimension

      this.globalHeight[type] = value
    },

    setItems(items) {
      this.items = items
    },

    resetGlobalHeight() {
      this.globalHeight = {
        borderT: 58,
        borderB: 58,
        glassY: 2884,
      }
    },
  },
})
