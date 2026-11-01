<template>
    <div v-if="props.respuesta.es_seccion" class="d-flex flex-column mt-4" style="width: 100%">
        <h6 class="text-subtitle-1 font-weight-bold text-uppercase" style="color: #111C4E">
            <v-avatar v-if="props.correlativo" color="secondary" size="small" variant="tonal" class="mr-2">
                <span style="font-size: 12px;" class="font-weight-bold">{{ props.correlativo }}</span>
            </v-avatar>
            {{ props.respuesta.nombre }}
        </h6>
        <v-divider class="mt-2 mb-4" />
        <div class="d-flex flex-column pl-4" style="gap: 32px;">
            <JerarquiaRespuestas 
                v-for="(pregunta, index) in props.respuesta.preguntas" 
                :key="pregunta.id" 
                :respuesta="pregunta"
                :correlativo="`${correlativo}.${index + 1}`"
            />
        </div>
    </div>
    <v-divider 
        v-else-if="props.respuesta.tipo?.codigo === 'DIVIDER'" 
        class="mt-2 mb-4" 
    />
    <div v-else-if="mostrarRespuesta" class="d-flex" style="gap: 8px">
        <v-avatar v-if="props.correlativo && props.respuesta.tipo?.codigo !== 'TEXTO_ENRIQUECIDO'" color="secondary" size="small" variant="tonal" class="mr-2">
            <span style="font-size: 12px;" class="font-weight-bold">{{ props.correlativo }}</span>
        </v-avatar>

        <div>
            <template v-if="props.respuesta.tipo?.codigo === 'ADJUNTO'">
                <p class="mb-0 font-weight-bold text-body-1">
                    {{ props.respuesta.pregunta.label }}
                </p>
                <v-btn class="mt-1" color="secondary" @click.stop="obtenerAdjunto" size="small" :disabled="!props.respuesta.url_adjunto">
                    <v-icon class="mr-1">mdi-paperclip</v-icon>
                    Ver adjunto
                </v-btn>
                <VisualizadorPDF 
                    v-model="dialogo_visualizar_pdf"
                    nombre_documento="documento-adjunto"
                    :data-url="adjuntoDataUrl"
                />
                <VisualizadorImagen 
                    v-model="dialogo_visualizar_imagen"
                    :src="adjuntoDataUrl"
                />
            </template>
            <template v-else-if="props.respuesta.tipo?.codigo === 'TEXTO_ENRIQUECIDO'">
                <span 
                    v-if="props.respuesta.pregunta.label" 
                    v-html="props.respuesta.pregunta.label" 
                    class="jerarquia-formulario__elemento-texto-enriquecido" 
                />
            </template>
            <template v-else-if="props.respuesta.tipo?.codigo === 'CHECKBOX_UNICA_OPCION'">
                <v-checkbox
                    v-if="props.respuesta.respuesta?.length === 1"
                    model-value="success"
                    color="success"
                    :label="transformarValor(props.respuesta.tipo, props.respuesta.respuesta)"
                    value="success"
                    class="font-weight-medium text-justify"
                    active
                    hide-details
                    readonly
                />
                <template v-else>
                    <label class="mb-0 font-weight-bold text-body-1">
                        {{ props.respuesta.pregunta?.label }}
                    </label>
                    <p class="mb-0 mt-1 text-body-1">
                        {{ transformarValor(props.respuesta.tipo, props.respuesta.respuesta) }}
                    </p>
                </template>
            </template>
            <template v-else>
                <label class="mb-0 font-weight-bold text-body-1">{{ props.respuesta.pregunta?.label }}</label>
                <p class="mb-0 mt-1 text-body-1">
                    {{ transformarValor(props.respuesta.tipo, props.respuesta.respuesta) }}
                </p>
            </template>

            <div v-if="respuestasAnidadas.length > 0" class="pl-4">
                <JerarquiaRespuestas
                    v-for="(respuestaAnidada, index) in respuestasAnidadas"
                    :key="respuestaAnidada.id"
                    class="mt-4 mb-0"
                    :respuesta="respuestaAnidada"
                    :correlativo="`${correlativo}.${index + 1}`"
                />
            </div>
        </div>
    </div>
</template>
<script setup>
import formulariosServices from '@/services/formularios.services';
import VisualizadorImagen from '../utils/VisualizadorImagen.vue';
import VisualizadorPDF from '../utils/VisualizadorPDF.vue';
import useNoti from '@/composables/useNoti';
import { computed, ref } from 'vue';
import { format } from 'date-fns';
import { castArray, isEmpty } from 'lodash';

const dialogo_visualizar_pdf = ref(false);
const dialogo_visualizar_imagen = ref(false);
const adjuntoDataUrl = ref(null);
const { notify } = useNoti();

const props = defineProps({
    respuesta: {
        type: Object,
    },
    correlativo: { type: [Number, String] }
});

const transformarValor = (tipo, valor) => {
    if (tipo.codigo === 'DATEPICKER') return format(valor, 'dd/MM/yyyy');

    if (['CHECKBOX', 'CHECKBOX_UNICA_OPCION'].includes(tipo.codigo)) return valor.join(', ');

    return valor ?? '-';
}

const mostrarRespuesta = computed(() => {
    if (props.respuesta.tipo.codigo === 'ADJUNTO') return !isEmpty(props.respuesta.url_adjunto);

    return !isEmpty(props.respuesta.respuesta);
});

const respuestasAnidadas = computed(() => {
    const respuestasHijas = props.respuesta.respuestas_hijas;
    const respuestasPreguntaPadre = castArray(props.respuesta.respuesta);

    if (!Array.isArray(respuestasHijas)) return [];

    return respuestasHijas.filter((respuestHija) => {
        const respuestasQueMuestranRespuestaHija = respuestHija.pregunta.mostrar_cuando;

        if (!Array.isArray(respuestasQueMuestranRespuestaHija)) return false;

        return respuestasPreguntaPadre.some((respuesta) => respuestasQueMuestranRespuestaHija.includes(respuesta));
    });
});

const obtenerAdjunto = async () => {
    adjuntoDataUrl.value = null;
    const response = await formulariosServices.obtenerAdjunto(props.respuesta.url_adjunto);
    const blob = new Blob([response.data], { type: response.headers["content-type"] });

    if (/image\/.*/ig.test(response.headers['content-type'])) {
        adjuntoDataUrl.value = URL.createObjectURL(blob);
        dialogo_visualizar_imagen.value = true;
        return;
    }

    if (response.headers['content-type'].includes('pdf')) {
        adjuntoDataUrl.value = URL.createObjectURL(blob);

        dialogo_visualizar_pdf.value = true;
        return;
    }

    notify("Este tipo de documento no se puede previsualizar, se descargará el documento.", "info");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = 'documento';
    link.click();
}
</script>
<style scoped>
:deep(.v-selection-control) {
    min-height: unset !important;
}
</style>
