<template>
    <div>
        <v-card 
            class="pa-4 text-center bg-grey-lighten-5" 
            border 
            elevation="0" 
            style="border-style: dashed; cursor: pointer;"
            @click.stop="dispararCargaDocumento"
        >
            <v-file-input 
                v-model="modelo"
                v-bind="vuetifyProps"
                ref="referenciaFileInput"
                class="d-none"
                hide-details
            />
            <v-icon size="48px" color="grey-darken-3">mdi-upload</v-icon>
            <p class="mt-2 mb-0 text-body-2 text-grey-darken-3 font-weight-medium">
                Haga click para cargar el archivo
            </p>
        </v-card>

        <v-card v-if="modelo" class="pa-2 mt-2 bg-grey-lighten-5" rounded="lg" elevation="0">
            <div class="d-flex align-center" style="gap: 8px;">
                <v-avatar rounded="lg" size="32px" color="grey-lighten-3">
                    <v-icon size="20px" color="teal-darken-2">mdi-file</v-icon>
                </v-avatar>
                <p class="mb-0 flex-grow-1 text-body-1">
                    {{ modelo.name }}
                    <b class="text-body-2 font-weight-bold">({{ calcularPesoArchivoEnMB(modelo.size) }} MB)</b>
                </p>
                <v-icon size="22px" color="black" @click.stop="modelo = null">mdi-close</v-icon>
            </div>
        </v-card>
    </div>
</template>
<script setup>
import { calcularPesoArchivoEnMB } from '@/utils/file';
import { ref } from 'vue';

defineProps({
    vuetifyProps: Object,
});

const modelo = defineModel();

// Estado y computed
const referenciaFileInput = ref(null);

// Acciones
const dispararCargaDocumento = () => {
  referenciaFileInput.value.click()
}
</script>
