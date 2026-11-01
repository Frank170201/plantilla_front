<template>
    <div v-if="cargando" :class="`d-flex align-center ${center ? 'justify-center' : ''}`" style="gap: 16px; width: 100%;">
        <v-progress-circular
            indeterminate 
            color="primario-1" 
            :size="24" 
            :width="2" 
        />
        <span class="text-caption d-block text-uppercase font-weight-bold color-primario-1" style="font-size: 20px !important;">
            {{ texto }}
        </span>
    </div>
</template>
<script setup>
const { cargando, texto, center } = defineProps({
    cargando: {
        type: Boolean,
        default: true,
    },
    texto: {
        type: String,
        default: 'Cargando...',
    },
    center: {
        type: Boolean,
        default: false,
    },
});
</script>
