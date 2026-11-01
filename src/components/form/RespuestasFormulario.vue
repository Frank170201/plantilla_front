<template>
    <div style="width: 100%;">
        <h4 class="text-uppercase text-h5 text-center font-weight-bold">
            {{ props.formulario.nombre }}
        </h4>
        <div class="mt-8 d-flex flex-column" style="gap: 32px;">
            <JerarquiaRespuestas 
                v-for="(respuesta, index) in respuestas"
                :respuesta="respuesta"
                :correlativo="index + 1"
                :key="index"
            />
        </div>
    </div>
</template>
<script setup>
import JerarquiaRespuestas from './JerarquiaRespuestas.vue';

const props = defineProps({
    formulario: {
        type: Object,
    },
    respuestas: {
        type: Array,
    }
})
</script>