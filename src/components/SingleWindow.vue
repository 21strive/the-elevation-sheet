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

const updateMeasurement = ({ type, value }) => {
    console.log(type, value)

    measurement.value[type] = value
}
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
            <div class="flex border border-black"
                :style="{ width: `${width / 10 * 1.5}px`, height: `${height / 10 * 1.5}px`, paddingLeft: `${measurement.borderL / 10 * 1.5}px`, paddingRight: `${measurement.borderR / 10 * 1.5}px`, paddingTop: `${measurement.borderT / 10 * 1.5}px`, paddingBottom: `${measurement.borderB / 10 * 1.5}px` }">
                <div class="w-9 h-9 bg-blue-500/10 border border-black" :style="{
                    width: `${(width - (measurement.borderL + measurement.borderR)) / 10 * 1.5}px`, height: `${(height - (measurement.borderT + measurement.borderB)) / 10 * 1.5}px`
                }"></div>
            </div>

            <div class="flex flex-col">
                <div class="flex flex-row">
                    <AppRuler type="borderL" measurementType="width" :value="measurement.borderL" class="w-full"
                        @update-value="updateMeasurement" />
                    <AppRuler type="glassX" measurementType="width" barrierType="none" :value="measurement.glassX"
                        class="w-full" @update-value="updateMeasurement" />
                    <AppRuler type="borderR" measurementType="width" :value="measurement.borderR" class="w-full"
                        @update-value="updateMeasurement" />
                </div>

                <AppRuler measurementType="width" :value="width" class="w-full" />
            </div>
        </div>

        <div class="flex flex-row items-start mt-10">
            <div class="flex flex-col">
                <AppRuler type="borderT" measurementType="height" :value="measurement.borderT"
                    @update-value="updateMeasurement" />
                <AppRuler type="glassY" measurementType="height" barrierType="none" :value="measurement.glassY"
                    @update-value="updateMeasurement" />
                <AppRuler type="borderB" measurementType="height" :value="measurement.borderB"
                    @update-value="updateMeasurement" />
            </div>
            <AppRuler measurementType="height" :value="height" />
        </div>
    </div>
</template>
