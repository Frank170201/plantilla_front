<template>
    <v-card style="background-color: transparent; height: 100%" :rounded="false">
        <div class="d-flex flex-column flex-lg-row justify-space-between" style="height: 100%;">
            <v-hover v-slot="{ isHovering, props: hoverProps }">
                <v-card v-bind="hoverProps" class="flex-grow-0 flex-shrink-0 anuncio__imagen-card" :rounded="false">
                    <v-img :src="props.anuncio.imagen" style="height: 100%" cover />
                    <v-overlay
                        :model-value="!!isHovering"
                        class="align-center justify-center"
                        scrim="#036358"
                        contained
                        >
                        <v-btn variant="outlined" color="white" rounded @click.stop="abrirModalDetalle(null)">
                            Ver detalles
                        </v-btn>
                    </v-overlay>
                </v-card>
            </v-hover>

            <div style="height: 100%; overflow: auto;" class="flex-grow-1 flex-shrink-1 px-4 py-4">
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
        </div>

        <v-dialog v-model="modalDetalleAbierta" width="1200px">
            <v-card style="position: relative;">
                <v-card-title style="position: sticky; top: 0; z-index: 100; background: #FFF;" class="px-0 py-0">
                    <div class="px-2 py-2">
                        <v-btn icon variant="text" @click.stop="cerrarModalDetalle">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </div>
                    <v-divider />
                </v-card-title>
                <v-card-text>
                    <VueMagnifier :src="props.anuncio.imagen"  mg-shape="square" zoom-factor="1.5" />
                </v-card-text>
            </v-card>
        </v-dialog>

        <ModalVerAnuncio 
            v-model="modalVerAnuncioAbierta"
            :anuncio="anuncio"
        />
    </v-card>
</template>
<script setup>
import VueMagnifier from '@websitebeaver/vue-magnifier';
import '@websitebeaver/vue-magnifier/styles.css';
import { ref } from 'vue';
import ModalVerAnuncio from './ModalVerAnuncio.vue';

const props = defineProps({
    anuncio: { type: Object },
});

const modalDetalleAbierta = ref(false);
const modalVerAnuncioAbierta = ref(false);

const abrirModalDetalle = () => {
    modalDetalleAbierta.value = true;
}

const abrirModalVerAnuncio = () => {
    modalVerAnuncioAbierta.value = true;
}

const cerrarModalDetalle = () => {
    modalDetalleAbierta.value = false;
}
</script>
<style scoped>
.anuncio__imagen-card {
    flex-basis: 175px;
}

@media(min-width: 1264px ) {
    .anuncio__imagen-card {
        flex-basis: 30%;
    }
}
</style>