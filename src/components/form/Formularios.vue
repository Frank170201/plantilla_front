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
            
            <span v-if="!formularios.length">No hay formulario</span>
            <template v-else>
                <Formulario 
                    v-for="form in formularios" 
                    :key="form?.id" 
                    :formulario="form" 
                />
            </template>
        </v-row>
    </div>
</template>
<script setup>
import useFormulariosPublicos from '@/composables/useFormulariosPublicos';
import { onMounted, ref, watch } from 'vue';
import Formulario from './Formulario.vue';

const { listarTiposFormularios, obtenerFormulario } = useFormulariosPublicos();

const tiposFormulario = ref([]);
const formularios = ref([]);
const idTipoReporte = ref('');

const mapearPreguntas = (preguntas) => {
    const copiaPreguntas = preguntas.slice();
    const indexFinSecciones = preguntas.findIndex((pregunta) => !pregunta.es_seccion);

    if (indexFinSecciones > 0) {
        copiaPreguntas.splice(indexFinSecciones, 0, { tipo: { codigo: 'DIVIDER' } })
    }

    return copiaPreguntas;
}

const transform = (item) => ({
    nombre: item?.nombre,
    id: item.id,
    preguntas: mapearPreguntas(item?.preguntas ?? []),
});

const cargarFormulario = (id) => {
    obtenerFormulario(id).then(data => {
        formularios.value = data.data?.map(transform);
    });
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