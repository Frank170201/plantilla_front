<template>
    <v-card style="background-color: transparent; height: 100%; overflow: auto;">
        <div style="height: 100%;" class="px-4 py-4">
            <h4 v-if="props.anuncio.titulo" class="text-h5 font-weight-bold text-uppercase" style="color: #fff; word-break: break-word;">
                {{ props.anuncio.titulo }}
            </h4>

            <p v-if="props.anuncio.descripcion" class="mt-4 mb-0 text-body-2" style="color: #fff; word-break: break-word;">
                {{ props.anuncio.descripcion }}
            </p>

            <v-card-actions class="px-0 py-4">
                <v-btn variant="outlined" rounded small class="mt-4 px-4 py-2" color="white" @click.stop="abrirModalVerAnuncio">
                    Ver anuncio
                </v-btn>
            </v-card-actions>
        </div>
        <ModalVerAnuncio
            v-model="modalVerAnuncioAbierta"
            :anuncio="anuncio"
        />
    </v-card>
</template>
<script setup>
import { ref } from 'vue';
import ModalVerAnuncio from './ModalVerAnuncio.vue';

const props = defineProps({
    anuncio: { type: Object },
});

const modalVerAnuncioAbierta = ref(false);

const abrirModalVerAnuncio = () => {
    modalVerAnuncioAbierta.value = true;
}
</script>