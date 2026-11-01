<template>
    <v-dialog
        :model-value="props.isOpen"
        max-width="1200px"
        @after-leave="cerrarModal"

    >
        <v-card>
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="4">
                  <v-img
                    rounded="lg"
                    v-if="anuncio.imagen"
                    width="100%"
                    max-width="350px"
                    :src="anuncio.imagen"
                    style="float: left; clear: both;"
                    class="mr-4"
                  >
                    <div style="position: absolute; bottom: 10px; left: 10px;">
                      <span class="bg-background px-3 rounded-lg py-1" style="font-size: 14px">
                        <v-icon icon="mdi-arrow-expand-all" size="18"/> Desde {{
                          anuncio?.area_minima
                        }} m² hasta {{ anuncio?.area_maxima }} m² <v-icon size="18" class="ml-2"
                        icon="mdi-store-outline"/> {{ anuncio?.cantidad_locales }}
                      </span>
                    </div>
                  </v-img>
                </v-col>
                <v-col cols="12" sm="8">
                  <h6 v-if="anuncio.titulo" class="text-h6 mb-4 font-weight-bold">{{ anuncio.titulo }}</h6>
                  <dl>
                    <template v-if="anuncio.comercio">
                      <dt class="font-weight-bold d-inline-block text-body-2">Comercio:</dt>
                      <dd class="d-inline-block mb-2 ml-1 text-body-2">{{ anuncio.comercio ? anuncio.comercio.nombre : '-'}}</dd>
                      <br />
                    </template>
                    <dt class="font-weight-bold d-inline-block text-body-2">Fecha de publicación:</dt>
                    <dd class="d-inline-block mb-4 ml-1 text-body-2">{{ formatearFecha(anuncio.fecha_publicacion) }}</dd>
                  </dl>
                  <span
                    class="mb-0 text-body-2"
                    v-html="formatearLista(anuncio.descripcion)"
                  />
                </v-col>
              </v-row>


            </v-card-text>
        </v-card>
    </v-dialog>
</template>
<script setup>
import { formatearFecha } from '@/utils/datetime';
import { formatearLista } from '@/utils/TextoEnriquecido';

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
    isOpen: { type: Boolean },
    anuncio: { type: Object },
});

// Metodos
const cerrarModal = () => {
    emit("update:modelValue", false);
};
</script>
