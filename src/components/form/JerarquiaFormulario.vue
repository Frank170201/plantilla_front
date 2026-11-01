<!-- eslint-disable vue/no-mutating-props -->
<template>
    <div v-if="props.elementoFormulario.es_seccion" style="width: 100%">
        <h6 class="text-subtitle-1 font-weight-bold text-uppercase">
            <v-avatar v-if="props.correlativo" color="secondary" size="small" variant="tonal" class="mr-2">
                <span style="font-size: 12px;" class="font-weight-bold">{{ props.correlativo }}</span>
            </v-avatar>
            {{ props.elementoFormulario.nombre }}
        </h6>
        <v-divider class="mt-2 mb-4" />

        <div class="d-flex flex-column pl-4" style="gap: 32px;">
            <JerarquiaFormulario 
                v-for="(pregunta, index) in props.elementoFormulario.preguntas" 
                :key="pregunta.id" 
                :elemento-formulario="pregunta" 
                :estado="props.estado"
                :v-formulario="props.vFormulario"
                :correlativo="`${correlativo}.${index + 1}`"
                :mapear-opciones="mapearOpciones"
                :adjuntos="adjuntos"
                @on-cambio-valor="reenviarCambioEnValor"
            />
        </div>
    </div>
    <v-divider v-else-if="props.elementoFormulario.tipo?.codigo === 'DIVIDER'" class="mb-2"/>
    <div v-else style="width: 100%; line-height: unset; gap: 8px;" class="d-flex">
        <v-avatar 
            v-if="props.correlativo && props.elementoFormulario.tipo?.codigo !== 'TEXTO_ENRIQUECIDO'" 
            color="secondary" 
            size="small"
            variant="tonal"
        >
            <span style="font-size: 12px;" class="font-weight-bold">{{ props.correlativo }}</span>
        </v-avatar>
        <div style="width: 100%">
            <v-alert 
                v-if="props.elementoFormulario.configuracion_extra?.descripcion" 
                type="info" 
                density="comfortable" 
                variant="tonal"
                class="mb-2"
            >
                {{ props.elementoFormulario.configuracion_extra?.descripcion }}
            </v-alert>
            <DatePickerFormulario 
                v-if="props.elementoFormulario.tipo?.codigo === 'DATEPICKER'" 
                v-model="estado[props.elementoFormulario.id]"
                :label="props.elementoFormulario.label"
                :v-formulario="props.vFormulario"
                :pregunta="props.elementoFormulario"
                :placeholder="props.elementoFormulario.configuracion_extra?.placeholder"
                @on-blur="emits('on-cambio-valor', generarObjetoDeCambioEnPregunta(props.elementoFormulario.id))"
            />
            <v-textarea 
                v-if="props.elementoFormulario.tipo?.codigo === 'TEXTAREA'" 
                v-model="estado[props.elementoFormulario.id]"
                v-on="eventosControlFormulario"
                v-bind="propiedadesControlFormulario"
            />
            <template v-if="props.elementoFormulario.tipo?.codigo === 'INPUT'">
                <v-text-field 
                    v-if="mascaraNumerica"
                    v-model="estado[props.elementoFormulario.id]"
                    v-on="eventosControlFormulario"
                    v-bind="propiedadesControlFormulario"
                    v-mask="mascaraNumerica"
                />
                <v-text-field 
                    v-else
                    v-model="estado[props.elementoFormulario.id]"
                    v-on="eventosControlFormulario"
                    v-bind="propiedadesControlFormulario"
                />
            </template>
            <v-text-field 
                v-if="props.elementoFormulario.tipo?.codigo === 'NUMERIC'"
                v-model="estado[props.elementoFormulario.id]"
                v-on="eventosControlFormulario"
                v-bind="propiedadesControlFormulario"
                type="number"
            />
            <v-radio-group 
                v-if="props.elementoFormulario.tipo?.codigo === 'RADIOBUTTON'"
                v-model="estado[props.elementoFormulario.id]"
                v-bind="propiedadesControlFormulario"
                v-on="eventosControlFormulario"
                @change="emits('on-cambio-valor', generarObjetoDeCambioEnPregunta(props.elementoFormulario.id))"
            >
                <v-radio 
                    v-for="opcion in props.elementoFormulario.configuracion_extra.opciones" 
                    :key="opcion"
                    :label="opcion" 
                    :value="opcion"
                />
            </v-radio-group>
            <div v-if="['CHECKBOX', 'CHECKBOX_UNICA_OPCION'].includes(props.elementoFormulario.tipo?.codigo)">
                <label v-if="props.elementoFormulario.tipo?.codigo !== 'CHECKBOX_UNICA_OPCION'">
                    {{ propiedadesControlFormulario.label }}
                </label>
                <v-checkbox
                    v-for="opcion in props.elementoFormulario.configuracion_extra.opciones" 
                    v-model="estado[props.elementoFormulario.id]"
                    v-on="eventosControlFormulario"
                    :key="opcion"
                    :label="opcion" 
                    :value="opcion"
                    multiple
                    hide-details
                    @change="emits('on-cambio-valor', generarObjetoDeCambioEnPregunta(props.elementoFormulario.id))"
                />
                <p class="mt-4 mb-0 text-caption" style="color: #b50420">
                    {{ props.vFormulario[props.elementoFormulario.id].$errors.map((e) => e.$message).join('') }}
                </p>
            </div>
            <template v-if="props.elementoFormulario.tipo?.codigo === 'TEXTO_ENRIQUECIDO'">
                <span 
                    v-if="elementoFormulario.label" 
                    v-html="elementoFormulario.label" 
                    class="d-block" 
                />
            </template>
            <template v-if="props.elementoFormulario.tipo?.codigo === 'ADJUNTO'">
                <v-file-input 
                    v-model="estado[props.elementoFormulario.id]"
                    v-on="eventosControlFormulario"
                    v-bind="propiedadesControlFormulario"
                    prepend-icon=""
                    @change.stop="deleteAdjuntoDB()"
                >
                    <template #prepend-inner>
                        <v-icon>mdi-paperclip</v-icon>
                    </template>
                </v-file-input>
                <template v-if="adjuntos[props.elementoFormulario.id]">
                    <v-btn class="mt-1" color="secondary" icon v-tooltip:bottom="'Ver Adjunto'" size="small" @click.stop="obtenerAdjunto(adjuntos[props.elementoFormulario.id])">
                        <v-icon>mdi-eye</v-icon>
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
            </template>

            <v-select
                v-if="props.elementoFormulario.tipo?.codigo === 'SELECT'"
                v-model="estado[props.elementoFormulario.id]"
                v-on="eventosControlFormulario"
                v-bind="propiedadesControlFormulario"
                :items="opciones"
                clearable
            />

            <div v-if="preguntasAnidadas.length > 0" class="pl-4 mt-4">
                <JerarquiaFormulario 
                    v-for="(preguntaAnidada, index) in preguntasAnidadas"
                    :key="preguntaAnidada.id"
                    :elemento-formulario="preguntaAnidada"
                    :estado="props.estado"
                    :v-formulario="props.vFormulario"
                    :correlativo="`${correlativo}.${index + 1}`"
                    :inyectando-estado="inyectandoEstado"
                    :mapear-opciones="mapearOpciones"
                    :adjuntos="adjuntos"
                    @on-cambio-valor="reenviarCambioEnValor"
                />
            </div>
        </div>
    </div>
</template>
<script setup>
import DatePickerFormulario from '@/components/form/DatePickerFormulario.vue';
import { esControlDeFormulario, mostrarPreguntaAnidada } from '@/utils/formularios-dinamicos';
import { computed } from 'vue';
import VisualizadorPDF from '../utils/VisualizadorPDF.vue';
import formulariosServices from '@/services/formularios.services';
import VisualizadorImagen from '../utils/VisualizadorImagen.vue';
import { ref } from 'vue';
import useNoti from '@/composables/useNoti';

const emits = defineEmits(['on-cambio-valor', 'update:adjuntos']);

const props = defineProps({
    adjuntos:  { type: Object },
    elementoFormulario: { type: Object },
    estado: { type: Object },
    vFormulario: { type: Object, required: true },
    correlativo: { type: [Number, String] },
    inyectandoEstado: { type: Boolean, default: false },
    mapearOpciones: Function,
});

const adjuntoDataUrl = ref(null);
const dialogo_visualizar_pdf = ref(false);
const dialogo_visualizar_imagen = ref(false);
const { notify } = useNoti();

const opciones = computed(() => {
    const opcionesEnPregunta = props.elementoFormulario.configuracion_extra?.opciones;

    if (!Array.isArray(opcionesEnPregunta)) return [];

    return props.mapearOpciones ? props.mapearOpciones(props.elementoFormulario, opcionesEnPregunta) : opcionesEnPregunta;
});

const propiedadesControlFormulario = computed(() => {
    if (!esControlDeFormulario(props.elementoFormulario)) return null;
    return {
        label: props.elementoFormulario.label,
        'error-messages': props.vFormulario[props.elementoFormulario.id].$errors.map(e => e.$message),
        'hide-details': props.vFormulario[props.elementoFormulario.id].$errors.length === 0,
        variant: 'outlined',
        placeholder: props.elementoFormulario.configuracion_extra?.placeholder ?? props.elementoFormulario.label,
    };
});

const eventosControlFormulario = computed(() => {
    if (!esControlDeFormulario(props.elementoFormulario)) return null;

    return {
        blur: () => {
            if (props.elementoFormulario.tipo?.codigo === 'ADJUNTO' && !props.adjuntos?.[props.elementoFormulario.id]) {
                emits("on-cambio-valor", generarObjetoDeCambioEnPregunta(props.elementoFormulario.id));
            }  
            
            if (props.elementoFormulario.tipo?.codigo !== 'ADJUNTO') {
                emits("on-cambio-valor", generarObjetoDeCambioEnPregunta(props.elementoFormulario.id));
            }

            props.vFormulario[props.elementoFormulario.id].$touch();
        },
        input: () => props.vFormulario[props.elementoFormulario.id].$touch(),
    };
});

const preguntasAnidadas = computed(() => {
    const preguntasDependientes = props.elementoFormulario.preguntas_dependientes;

    if (!Array.isArray(preguntasDependientes)) return [];

    const valorPreguntaPadre = props.estado[props.elementoFormulario.id];

    if (!valorPreguntaPadre) return [];

    return preguntasDependientes.filter((preguntaDependiente) => mostrarPreguntaAnidada(preguntaDependiente.configuracion_extra.mostrar_pregunta_anidada_cuando, valorPreguntaPadre));
});

const mascaraNumerica = computed(() => {
    const validacionRegex = props.elementoFormulario.configuracion_extra?.validaciones?.find((validacion) => validacion.es_regex);

    if (!validacionRegex) return null;

    const regex = validacionRegex.valor;

    if (/^\^((\\d|\[\d+\])\{\d+\}-?)+\$$/ig.test(regex)) {
        let regexSinDelimitadores = regex.replace('$', '').replace('^', '');

        const mascara = regexSinDelimitadores.replace(/(\\d|\[\d+\]){(\d)+}/ig, (coincidencia) => {
            const cantidadToken = coincidencia.match(/\{(.*)\}/)[1];

            return '#'.repeat(cantidadToken);
        });

        return /^[#-]+$/ig.test(mascara) ? mascara : null;
    }

    return null;
});

const reenviarCambioEnValor = (pregunta) => {
    emits('on-cambio-valor', pregunta);
}

const generarObjetoDeCambioEnPregunta = (idPregunta) => ({  id_pregunta: idPregunta, respuesta: props.estado[props.elementoFormulario.id] });

const obtenerAdjunto = async (url_adjunto) => {
    adjuntoDataUrl.value = null;
    const response = await formulariosServices.obtenerAdjunto(url_adjunto);
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

const deleteAdjuntoDB = () => {
    const nuevosAdjuntos = { ...props.adjuntos }; 
    
    delete nuevosAdjuntos[props.elementoFormulario.id];

    emits('update:adjuntos', nuevosAdjuntos);
};

</script>
<style scoped>
:deep(.v-selection-control) {
    min-height: unset !important;
}

:deep(.v-label) {
    word-break: break-word; 
    white-space: normal;
    display: inline-block;
}

:deep(.v-radio-group .v-label),
:deep(.v-checkbox .v-label) {
    height: unset !important;
}
</style>
