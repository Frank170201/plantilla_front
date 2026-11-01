<template>
    <component :is="componente" :anuncio="anuncio" />
</template>
<script setup>
import { computed } from 'vue';
import AnuncioConImagen from './AnuncioConImagen.vue';
import AnuncioSoloImagen from './AnuncioSoloImagen.vue';
import AnuncioTextual from './AnuncioTextual.vue';

const props = defineProps({
    anuncio: { type: Object },
});

const componente = computed(() => {
    if (!props.anuncio.imagen && !props.anuncio.titulo && !props.anuncio.descripcion) return null;

    if (!props.anuncio.imagen) return AnuncioTextual;

    if (!props.anuncio.titulo && !props.anuncio.descripcion) {
        return AnuncioSoloImagen;
    }

    return AnuncioConImagen;
});
</script>