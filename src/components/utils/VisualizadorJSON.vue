<template>
    <v-dialog max-width="1000px" persistent>
        <v-card class="no-padding">
            <v-card-title class="pa-4 d-flex justify-space-between align-center">
                <v-btn icon variant="text" size="small" @click.stop="cerrarModal">
                    <v-icon size="28px">mdi-window-close</v-icon>
                </v-btn>

                <v-btn variant="text" class="text-capitalize" @click.stop="descargarJSON">
                    <v-icon size="24px" class="mr-1">mdi-download</v-icon>
                    <span class="text-body-1">Descargar</span>
                </v-btn>
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-4">
                <div style="position: relative; background-color: #282c34;  max-height: 800px; min-height: 400px; overflow: auto;">
                    <div style="width: auto; position: sticky; top: 0; z-index: 20; background-color: inherit;" class="text-right">
                        <v-btn 
                            variant="text"
                            :color="textoBotonCopiar === textoOriginal ? 'white' : '#49b3e5'"
                            class="text-capitalize mr-1"
                            @click.stop="copiarJSON"
                        >
                            {{ textoBotonCopiar }}
                        </v-btn>
                    </div>
                    <JsonViewer v-if="json" :value="json" sort theme="dark" class="mt-0" />
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
<script setup>
import { ref } from "vue";
import { JsonViewer } from "vue3-json-viewer"

const textoOriginal = 'Copiar';
const emits = defineEmits(['on-close']);
const textoBotonCopiar = ref(textoOriginal);
const timeoutID = ref(null);

const { json, filename } = defineProps({
    json: Object,
    filename: String,
})

// UI
const copiarJSON = () => {
    const texto = JSON.stringify(json, null, 2);
  navigator.clipboard.writeText(texto)
    .then(() => manejarCopiadoExitoso())
    .catch(() => null);
};

const manejarCopiadoExitoso = () => {
    textoBotonCopiar.value = 'Copiado!';

    if (timeoutID.value) clearTimeout(timeoutID.value);

    timeoutID.value = setTimeout(() => {
        textoBotonCopiar.value = textoOriginal;
    }, 800);
}

const descargarJSON = () => {
  const blob = new Blob([JSON.stringify(json)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename ?? 'json-facturacion-electronica'}.json`;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

const cerrarModal = () => {
    emits('on-close')
}
</script>
<style scoped>
.jv-container :deep(.jv-code) {
    padding-top: 0;
}
</style>
