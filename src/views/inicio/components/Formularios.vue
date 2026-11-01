<template>
    <div>
        <v-row>
            <v-col cols="12">
                <v-autocomplete
                    :items="tiposFormulario"
                    item-title="nombre"
                    item-value="id"
                    label="Tipo de reporte"
                    placeholder="Elija el tipo de reporte"
                    variant="outlined"
                    v-model="idTipoReporte"
                ></v-autocomplete>
            </v-col>
            
            <span v-if="!formulario.length">No hay formulario</span>
            <template v-else>
                <template v-for="form in formulario" :key="form?.id">
                    {{ form.formulario }}
                    <Formulario 
                        :formulario="form"
                        footer-sticky 
                        @on-cancel="respuestas = {}" 
                        @on-save="guardarRespuestasFormulario(form.id)" 
                    />
                </template>
            </template>
        </v-row>
    </div>
</template>
<script setup>
import useFormulariosPublicos from '@/composables/useFormulariosPublicos';
import { onMounted, ref, watch } from 'vue';
import Formulario from '@/components/form/Formulario.vue';

const { listarTiposFormularios, obtenerFormulario, enviarFormulario } = useFormulariosPublicos();

const tiposFormulario = ref([]);
const formulario = ref([]);
const idTipoReporte = ref('');
const respuestas = ref({});

const transform = (item) => ({
    formulario: item?.nombre,
    id: item.id,
    preguntas: item?.preguntas ?? []
});

const cargarFormulario = (id) => {
    obtenerFormulario(id).then(data => {
        formulario.value = data.data?.map(transform);
    });
}

const guardarRespuestasFormulario = async (idFormulario) => {
    const respuestasFormulario = Object.entries(respuestas.value).map(([key, value]) => ({
        id_pregunta: +key,
        respuesta: value,
    }));

    await enviarFormulario(idFormulario, { respuestas: respuestasFormulario });
    respuestas.value = {};
}

watch(
    () => idTipoReporte.value,
    (newValue) => cargarFormulario(newValue)
)

onMounted(() => {
    listarTiposFormularios().then(data => {
        tiposFormulario.value = data.data;
    });
})
</script>