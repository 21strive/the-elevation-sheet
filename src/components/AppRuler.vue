<script setup>
import { computed } from 'vue';

const props = defineProps({
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

const computedValue = computed(() => {
    if (props.barrierType === 'none') {
        return props.value / 10 * 1.5 + 4;
    } else if (props.barrierType === 'start' && props.barrierType === 'end') {
        return (props.value - 8) / 10 * 1.5 - 2;
    } else {
        return (props.value - 16) / 10 * 1.5 - 4;
    }
})
</script>

<template>
    <div class="relative flex items-center gap-1" :class="props.measurementType === 'width' ? 'flex-col' : 'flex-row'">
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
        <span class="text-lg" :class="[props.measurementType === 'width' ? 'absolute bottom-0' : 'leading-[1px]']">{{
            props.value
        }}</span>
        <div v-if="props.measurementType === 'width'" class="h-7"></div>
    </div>
</template>