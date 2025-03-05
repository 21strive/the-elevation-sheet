<script setup>
import { computed, ref } from 'vue';
import RulerDialog from './RulerDialog.vue';

const props = defineProps({
    type: {
        type: String,
        required: true
    },
    measurementType: { // Renamed from `type` to `measurementType`
        type: String,
        default: 'width',
        validator: (value) => ['width', 'height'].includes(value)
    },
    barrierType: {
        type: String,
        default: 'both',
        validator: (value) => ['none', 'start', 'end', 'both'].includes(value)
    },
    value: {
        type: Number,
        required: true
    }
})

const emit = defineEmits(['updateValue'])

const scaleFactor = 0.15; // 1.5px for every 10mm

const computedValue = computed(() => {
    if (props.barrierType === 'none') {
        return Math.round(props.value * scaleFactor) - 2;
    } else {
        return Math.round(props.value * scaleFactor) - 3;
    }
    // if (props.barrierType === 'none') {
    //     return props.value * scaleFactor + 4;
    // } else if (props.barrierType === 'start' && props.barrierType === 'end') {
    //     return (props.value - 8) * scaleFactor - 2;
    // } else {
    //     return (props.value - 16) * scaleFactor - 4;
    // }
})

const openDialog = ref(false)

const handleSubmit = (value) => {
    emit('updateValue', { type: props.type, value })
}
</script>

<template>
    <div class="relative flex items-center gap-1"
        :class="props.measurementType === 'width' ? 'flex-col' : 'flex-row-reverse'">
        <div v-if="props.measurementType === 'height' && props.barrierType === 'none'" class="w-[11px]"></div>
        <div v-if="props.measurementType === 'width' && props.barrierType === 'none'" class="h-[11px]"></div>

        <div v-if="props.measurementType === 'height'" class="flex flex-col items-center">
            <div v-if="props.barrierType === 'start' || props.barrierType === 'both'" class="h-0.5 w-8 bg-black"></div>
            <div class="w-0.5 bg-black" :style="{ height: `${computedValue}px` }"></div>
            <div v-if="props.barrierType === 'end' || props.barrierType === 'both'" class="h-0.5 w-8 bg-black"></div>
        </div>
        <div v-else class="flex flex-row items-center w-full">
            <div v-if="props.barrierType === 'start' || props.barrierType === 'both'" class="w-0.5 h-8 bg-black"></div>
            <div class="h-0.5 bg-black" :style="{ width: `${computedValue}px` }"></div>
            <div v-if="props.barrierType === 'end' || props.barrierType === 'both'" class="w-0.5 h-8 bg-black"></div>
        </div>
        <button @click="openDialog = true" class="text-lg hover:underline"
            :class="[props.measurementType === 'width' ? 'absolute bottom-0' : 'leading-[1px]']">
            {{ props.value }}
        </button>
        <div v-if="props.measurementType === 'width'" class="h-7"></div>
    </div>

    <RulerDialog :value="props.value" :is-open="openDialog" @close="openDialog = false" @update-value="handleSubmit" />
</template>