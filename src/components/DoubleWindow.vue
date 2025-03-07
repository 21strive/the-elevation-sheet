<script setup>
import { computed, ref, watch } from 'vue';
import AppRuler from './AppRuler.vue';
import { useTargetItemsStore } from '@/stores/targetItemsStore';

const props = defineProps({
    name: {
        type: String,
        required: true
    },
    index: {
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
    borderT: {
        type: Number,
        required: true,
    },
    borderB: {
        type: Number,
        required: true,
    },
    glass1X: {
        type: Number,
        required: true,
    },
    dividerX: {
        type: Number,
        required: true,
    },
    glass2X: {
        type: Number,
        required: true,
    },
    glassY: {
        type: Number,
        required: true,
    },
})

const emit = defineEmits(['remove', 'update']);

const targetItemsStore = useTargetItemsStore();

const measurement = ref({
    borderL: props.borderL,
    borderR: props.borderR,
    borderT: props.borderT,
    borderB: props.borderB,
    glass1X: props.glass1X,
    dividerX: props.dividerX,
    glass2X: props.glass2X,
    glassY: props.glassY,
});

// Watch for prop changes and update local state
watch(() => props, (newProps) => {
    measurement.value = {
        borderL: newProps.borderL,
        borderR: newProps.borderR,
        borderT: newProps.borderT,
        borderB: newProps.borderB,
        glass1X: newProps.glass1X,
        dividerX: newProps.dividerX,
        glass2X: newProps.glass2X,
        glassY: newProps.glassY,
    };
}, { deep: true });

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

// Scale factor for visualization (mm to pixels)
const scaleFactor = 0.15; // 1.5px for every 10mm

const updateMeasurement = ({ type, value }) => {
    if (value < 10) value = 10; // Minimum dimension

    measurement.value[type] = value;

    // Create a new object with all measurement properties
    const updatedItem = {
        borderL: measurement.value.borderL,
        borderR: measurement.value.borderR,
        glassX: measurement.value.glassX,
        borderT: measurement.value.borderT,
        borderB: measurement.value.borderB,
        glassY: measurement.value.glassY
    };

    emit('update', updatedItem, props.index);
};

const removeItem = () => {
    emit('remove', props.index);
};
</script>

<template>
    <div class="flex flex-row items-start gap-4">
        <div class="flex flex-col items-center gap-4">
            <div class="space-x-2">
                <span class="font-semibold text-blue-700">{{ props.name }}</span>
                <button @click="removeItem"
                    class="p-1 text-xs leading-none bg-white rounded-full text-red-500 hover:bg-red-100 hover:text-red-700 transition-colors">
                    ✕
                </button>
            </div>
            <div class="flex border border-black" :style="{
                width: `${width * scaleFactor}px`,
                height: `${height * scaleFactor}px`,
                padding: `${measurement.borderT * scaleFactor}px ${measurement.borderR * scaleFactor}px ${measurement.borderB * scaleFactor}px ${measurement.borderL * scaleFactor}px`
            }">
                <div class="border border-black h-full bg-cover bg-no-repeat bg-center"
                    style="background-image: url('/assets/illustration/glass.png');"
                    :style="{ width: `${measurement.glass1X * scaleFactor}px` }">
                </div>
                <div class="h-full" :style="{ width: `${measurement.dividerX * scaleFactor}px` }"></div>
                <div class="border border-black h-full bg-cover bg-no-repeat bg-center"
                    style="background-image: url('/assets/illustration/glass.png');"
                    :style="{ width: `${measurement.glass2X * scaleFactor}px` }">
                </div>
            </div>

            <div class="flex flex-col">
                <div class="flex flex-row" :class="[targetItemsStore.count > 2 && props.index % 2 === 1 && 'mt-8']">
                    <AppRuler type="borderL" measurementType="width" :position="props.index % 2 === 0 ? 'up' : 'down'"
                        :value="measurement.borderL" class="w-full" @update-value="updateMeasurement" />
                    <AppRuler type="glass1X" measurementType="width" :position="props.index % 2 === 0 ? 'up' : 'down'"
                        barrierType="none" :value="measurement.glass1X" class="w-full"
                        @update-value="updateMeasurement" />
                    <AppRuler type="dividerX" measurementType="width" :position="props.index % 2 === 0 ? 'up' : 'down'"
                        :value="measurement.dividerX" class="w-full" @update-value="updateMeasurement" />
                    <AppRuler type="glass2X" measurementType="width" :position="props.index % 2 === 0 ? 'up' : 'down'"
                        barrierType="none" :value="measurement.glass2X" class="w-full"
                        @update-value="updateMeasurement" />
                    <AppRuler type="borderR" measurementType="width" :position="props.index % 2 === 0 ? 'up' : 'down'"
                        :value="measurement.borderR" class="w-full" @update-value="updateMeasurement" />
                </div>

                <AppRuler type="width" measurementType="width" :value="width" class="w-full" />
            </div>
        </div>

        <!-- <div class="flex flex-row items-start mt-10">
            <div class="flex flex-col">
                <AppRuler type="borderT" measurementType="height" :value="measurement.borderT"
                    @update-value="updateMeasurement" />
                <AppRuler type="glassY" measurementType="height" barrierType="none" :value="measurement.glassY"
                    @update-value="updateMeasurement" />
                <AppRuler type="borderB" measurementType="height" :value="measurement.borderB"
                    @update-value="updateMeasurement" />
            </div>
            <AppRuler type="height" measurementType="height" :value="height" />
        </div> -->
    </div>
</template>
