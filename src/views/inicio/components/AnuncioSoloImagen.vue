<template>
    <v-hover v-slot="{ isHovering, props: hoverProps }">
        <v-card v-bind="hoverProps" style="height: 100%;">
            <v-card-text style="height: 100%;" class="px-0 py-0">
                <v-img :src="props.anuncio.imagen" cover style="height: 100%;" />
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
            </v-card-text>
        </v-card>
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
    </v-hover>
</template>
<script setup>
import VueMagnifier from '@websitebeaver/vue-magnifier';
import '@websitebeaver/vue-magnifier/styles.css';
import { ref } from 'vue';

const props = defineProps({
    anuncio: { type: Object },
});

const modalDetalleAbierta = ref(false);

const abrirModalDetalle = () => {
    modalDetalleAbierta.value = true;
}

const cerrarModalDetalle = () => {
    modalDetalleAbierta.value = false;
}
</script>