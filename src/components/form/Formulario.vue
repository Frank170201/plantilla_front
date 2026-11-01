<template>
    <div style="width: 100%;">
        <h4 
            class="text-uppercase text-h5 text-center font-weight-bold" 
            :class="{ 'mb-4': props.formulario.preguntas.length > 0 }"
            style="color: #3d1957"
        >
            {{ props.formulario.nombre }}
        </h4>

        <div class="d-flex flex-column px-1 px-sm-0" style="gap: 32px;">
            <JerarquiaFormulario 
                v-for="(pregunta, index) in delimitarFinDeSecciones(props.formulario.preguntas)"
                :key="pregunta.es_seccion ? `seccion-${pregunta.id}` : pregunta.id"
                :elemento-formulario="pregunta"
                :estado="respuestas"
                :v-formulario="$vForm"
                :correlativo="index + 1"
                :inyectando-estado="inyectando_estado"
                :mapear-opciones="mapearOpciones"
                v-model:adjuntos="adjuntos_previos"
                @update:estado="(nuevoEstado) => respuestas = nuevoEstado"
                @on-cambio-valor="manejarCambioEnValor"
            />
        </div>

        <slot name="append" />

        <div 
            v-if="props.formulario.preguntas.length > 0 && !esconderAcciones"
            class="d-flex justify-end align-center px-4 py-4" 
            :style="`gap: 16px; background: #FFF; ${footerSticky ? 'position: sticky; bottom: 0' : ''}`"
        >
            <v-btn 
                v-if="!esconderCancelacion"
                @click.stop="cancelarFormulario()"
                large 
                color="secondary" 
                variant="outlined" 
                :disabled="deshabilitarCancelacion"
            >
                Cancelar
            </v-btn>
            <v-btn @click.stop="validarEnvioFormulario()" large color="secondary" :disabled="deshabilitarEnvio">
                Guardar
            </v-btn>
        </div>

        <AppDialogoConfirmComponent
            v-model="dialogo_confirmacion"
            title="Envío de formulario"
            @onConfirm="enviarFormulario"
            descripcion="¿Desea continuar con el envío del formulario?"
        />
    </div>
</template>
<script setup>
import { mapearValidaciones, mostrarPreguntaAnidada, obtenerPreguntasEnJerarquia } from '@/utils/formularios-dinamicos';
import { delimitarFinDeSecciones } from '../../utils/formularios-dinamicos';
import AppDialogoConfirmComponent from '../AppDialogoConfirmComponent.vue';
import JerarquiaFormulario from './JerarquiaFormulario.vue';
import useNoti from '@/composables/useNoti';
import useVuelidate from '@vuelidate/core';
import { computed, onBeforeMount, onMounted, ref, watch } from 'vue';
import { cloneDeep, isNil } from 'lodash';

const emit = defineEmits(['on-cancel', 'on-save', 'on-field-change']);

const props = defineProps({
    formulario: { type: Object,  required: true },
    footerSticky: { type: Boolean },
    deshabilitarEnvio: { type: Boolean },
    deshabilitarCancelacion: { type: Boolean },
    esconderAcciones: { type: Boolean, default: false },
    esconderCancelacion: Boolean,
    serviceCargaBorrador: Function,
    mapearOpciones: Function,
});

const respuestas = ref({});
const adjuntos_previos = ref({});

const dialogo_confirmacion = ref(null);

const inyectando_estado = ref(false);

const rules = computed(() => {
    const preguntasEnFormulario = obtenerPreguntasEnJerarquia(props.formulario.preguntas);
    const reglasValidacion = {};

    preguntasEnFormulario.forEach((pregunta) => {
        if (pregunta.id_pregunta_padre) {
            const valorPreguntaPadre = respuestas.value[pregunta.id_pregunta_padre];

            const preguntaAnidadaSiendoMostrada = mostrarPreguntaAnidada(pregunta.mostrar_pregunta_anidada_cuando, valorPreguntaPadre);

            if (!preguntaAnidadaSiendoMostrada) return;
        }

        let saltarValidacionRequired = false;

        if (pregunta.tipo.codigo === 'ADJUNTO') {
            saltarValidacionRequired = !isNil(adjuntos_previos.value[pregunta.id]);
        }

        const validaciones = mapearValidaciones(pregunta.validaciones, { saltar_required: saltarValidacionRequired });
        reglasValidacion[pregunta.id] = validaciones;
    });

    return reglasValidacion;
});

const $vForm = useVuelidate(rules, respuestas);
const { notify } = useNoti();

// Metodos
const validarEnvioFormulario = async () => {
    $vForm.value.$touch();
    if ($vForm.value.$invalid) {
        notify("Por favor, complete los campos requeridos", "error");
        return;
    }

    dialogo_confirmacion.value = true;
}

// Metodos API
const enviarFormulario = (auto = false) => {
    
    const mapaRespuestas = new Map();

    Object.entries(cloneDeep(respuestas.value)).forEach(([key, value]) => {
        const esAdjunto = value && value instanceof File;

        mapaRespuestas.set((+key), {
            id_pregunta: +key,
            respuesta: esAdjunto ? value : JSON.stringify(value),
        });
    });

    const respuestasFormulario = Array.from(mapaRespuestas.values());

    emit('on-save', {
        id_formulario: props.formulario.id,
        respuestas: respuestasFormulario,
    }, auto);
}

const cancelarFormulario = () => {
    $vForm.value.$reset();
    respuestas.value = {};
    emit('on-cancel');
}

const obtenerResultadoFormulario = () => {

    const mapaRespuestas = new Map();
    
    Object.entries(cloneDeep(respuestas.value)).forEach(([key, value]) => {
        const esAdjunto = value && value instanceof File;

        mapaRespuestas.set((+key), {
            id_pregunta: +key,
            respuesta: esAdjunto ? value : JSON.stringify(value),
        });
    });

    const respuestasFormulario = Array.from(mapaRespuestas.values());

    return {
        id_formulario: props.formulario.id,
        respuestas: respuestasFormulario,
    };
}

const manejarCambioEnValor = (cambio) => {
    const idPregunta = cambio.id_pregunta;
    const respuesta = cambio.respuesta;
    const esAdjunto = respuesta && respuesta instanceof File;

    emit('on-field-change', { 
        id_formulario: props.formulario.id,
        cambio: {
            id_pregunta: idPregunta,
            respuesta: !respuesta ? null : (esAdjunto ? respuesta : JSON.stringify(respuesta)),
        },
    });
};

const inyectarRespuestaBorrador = (respuesta) => {
    if (respuesta.es_seccion) {
        respuesta.preguntas.forEach((pregunta) => inyectarRespuestaBorrador(pregunta));
        return;
    }

    if (!respuesta.tipo) return;

    if (respuesta.tipo.codigo === 'ADJUNTO' && respuesta.url_adjunto) {
        adjuntos_previos.value[respuesta.pregunta.id] = respuesta.url_adjunto;
        return;
    }

    if (!respuesta.respuesta) return;

    if (['TEXTO_ENRIQUECIDO'].includes(respuesta.tipo.codigo)) return;

    if (respuesta.tipo.codigo === 'DATEPICKER') {
        respuestas.value[respuesta.pregunta.id] = new Date(respuesta.respuesta);
    } else {
        respuestas.value[respuesta.pregunta.id] = respuesta.respuesta;
    }

    const respuestasHijas = respuesta.respuestas_hijas;

    if (!Array.isArray(respuestasHijas) || respuestasHijas.length === 0) return;

    respuestasHijas.forEach((respuestaHija) => inyectarRespuestaBorrador(respuestaHija));
};

const cargarBorrador = async() => {
    try {
        inyectando_estado.value = true;
        const borrador = await props.serviceCargaBorrador(props.formulario.id);
        borrador.forEach((respuesta) => {
            inyectarRespuestaBorrador(respuesta);
        });
    } catch (error) {
        console.log('error :>> ', error);
    }
}

const verificarValidacionFormulario = () => {
    $vForm.value.$touch();
    return !$vForm.value.$invalid;
}

defineExpose({
    obtenerResultadoFormulario,
    verificarValidacionFormulario,
});

watch(() => props.serviceCargaBorrador, (value) => {
    if (!value) return;

    cargarBorrador();
}, { deep: true, immediate: true });

onBeforeMount(async() => {
    await cargarBorrador();
});

onMounted(() => {
    inyectando_estado.value = false;
});
</script>
<style scoped>
@media (max-width: 960px) {
  :deep(.v-input:not(:has(.v-field--active)) .v-label.v-field-label) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
