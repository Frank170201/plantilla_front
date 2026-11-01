<template>
<div>
    <h3 
      class="text-uppercase text-center font-weight-bold" 
      :style="`color: #003734; ${display.mdAndDown.value ? 'font-size: 38px; line-height: 44px;' : 'font-size: 70px; line-height: 84px;'} text-transform: none !important;`"
    >
      Anuncios
    </h3>

    <ListadoAnuncios id-categoria="2" />
    <ListarMercadosPlazas/>
</div>
</template>
<script setup>
import ListadoAnuncios from '@/views/anunciosPublicos/components/ListadoAnuncios.vue';
import ListarMercadosPlazas from '@/views/anunciosPublicos/components/ListarMercadosPlazas.vue';
import { useDisplay } from 'vuetify/lib/framework.mjs';

const display = useDisplay();
</script>
