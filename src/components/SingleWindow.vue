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

const emit = defineEmits(['removeItem', 'update'])

const measurement = ref({
    borderL: props.borderL,
    borderR: props.borderB,
    glassX: props.glassX,
    borderT: props.borderT,
    borderB: props.borderB,
    glassY: props.glassY,
})

const width = computed(() => measurement.value.borderL + measurement.value.glassX + measurement.value.borderR)
const height = computed(() => measurement.value.borderT + measurement.value.glassY + measurement.value.borderB)

const Type = Object.freeze({
    SW: Symbol("Single Window"),
    DW: Symbol("Double Window"),
});

const updateMeasurement = ({ type, value }) => {
    console.log(type, value)

    measurement.value[type] = value
    emit('update', {
        id: 1,
        name: Type.SW, ...measurement.value
    }, props.id)
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
                <div class="bg-blue-500/10 border border-black" :style="{
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
