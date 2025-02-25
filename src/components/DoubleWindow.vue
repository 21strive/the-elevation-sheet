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
    }
})

const measurement = ref({
    borderL: 58,
    borderR: 58,
    borderT: 58,
    borderB: 58,
    glass1X: 1084,
    dividerX: 100,
    glass2X: 1084,
    glassY: 2884,
});

// Total width = left border + glass 1 + divider + glass 2 + right border
const width = computed(() => {
    return (
        measurement.value.borderL +
        measurement.value.glass1X +
        measurement.value.dividerX +
        measurement.value.glass2X +
        measurement.value.borderR
    );
});

// Total height remains borderT + glass height + borderB
const height = computed(() => {
    return (
        measurement.value.borderT +
        measurement.value.glassY +
        measurement.value.borderB
    );
});

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
                <div class="h-full bg-blue-500/10" :style="{ width: `${measurement.glass1X / 10 * 1.5}px` }">
                </div>
                <div class="h-full" :style="{ width: `${measurement.dividerX / 10 * 1.5}px` }"></div>
                <div class="h-full bg-blue-500/10" :style="{ width: `${measurement.glass2X / 10 * 1.5}px` }">
                </div>
            </div>

            <div class="flex flex-col">
                <div class="flex flex-row">
                    <AppRuler type="borderL" measurementType="width" :value="measurement.borderL" class="w-full"
                        @update-value="updateMeasurement" />
                    <AppRuler type="glass1X" measurementType="width" barrierType="none" :value="measurement.glass1X"
                        class="w-full" @update-value="updateMeasurement" />
                    <AppRuler type="dividerX" measurementType="width" :value="measurement.dividerX" class="w-full"
                        @update-value="updateMeasurement" />
                    <AppRuler type="glass2X" measurementType="width" barrierType="none" :value="measurement.glass2X"
                        class="w-full" @update-value="updateMeasurement" />
                    <AppRuler type="borderR" measurementType="width" :value="measurement.borderR" class="w-full"
                        @update-value="updateMeasurement" />
                </div>

                <AppRuler type="width" measurementType="width" :value="width" class="w-full" />
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
            <AppRuler type="height" measurementType="height" :value="height" />
        </div>
    </div>
</template>
