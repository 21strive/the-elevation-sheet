<script setup>
import { computed, ref } from 'vue';
import AppRuler from './AppRuler.vue';

const props = defineProps({
    name: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        required: true
    },
    // width: {
    //     type: Number,
    //     required: true
    // },
    // height: {
    //     type: Number,
    //     required: true
    // }
})

const measurement = ref({
    borderL: 58,
    borderR: 58,
    glassX: 1084,
    borderT: 58,
    borderB: 58,
    glassY: 2884,
})

const width = computed(() => measurement.value.borderL + measurement.value.glassX + measurement.value.borderR)
const height = computed(() => measurement.value.borderT + measurement.value.glassY + measurement.value.borderB)
</script>

<template>
    <div class="flex flex-row items-start gap-4">
        <div class="flex flex-col items-center gap-4">
            <div class="space-x-2">
                <span>{{ props.name }}</span>
                <button @click="removeItem(props.id)"
                    class="p-1 text-xs leading-none bg-white rounded-full text-red-500 hover:bg-red-100">
                    ✕
                </button>
            </div>
            <div class="bg-blue-500"
                :style="{ width: `${width / 10 * 1.5}px`, height: `${height / 10 * 1.5}px`, borderTopWidth: `${measurement.borderT / 10 * 1.5}px`, borderRightWidth: `${measurement.borderR / 10 * 1.5}px`, borderBottomWidth: `${measurement.borderB / 10 * 1.5}px`, borderLeftWidth: `${measurement.borderL / 10 * 1.5}px` }">
            </div>

            <div class="flex flex-col">
                <div class="flex flex-row">
                    <AppRuler measurementType="width" :value="measurement.borderR" class="w-full" />
                    <AppRuler measurementType="width" barrierType="none" :value="measurement.glassX" class="w-full" />
                    <AppRuler measurementType="width" :value="measurement.borderL" class="w-full" />
                </div>

                <AppRuler measurementType="width" :value="width" class="w-full" />
            </div>
        </div>

        <div class="flex flex-row items-start mt-10">
            <div class="flex flex-col">
                <AppRuler measurementType="height" :value="measurement.borderT" />
                <AppRuler measurementType="height" barrierType="none" :value="measurement.glassY" />
                <AppRuler measurementType="height" :value="measurement.borderB" />
            </div>
            <AppRuler measurementType="height" :value="height" />
        </div>
    </div>
</template>