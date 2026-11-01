<template>
  <v-dialog :model-value="props.showDialogConfirm" max-width="80%" persistent="">
    <v-card>
      <v-card-title class="mt-5 d-flex justify-space-between">
        <v-btn
          icon="mdi-close"
          variant="outlined"
          color="black"
          @click="closeDialog"
        ></v-btn>
        <!-- <v-btn icon="mdi-download" @click="descargarArchivo" color="blueDinac" size="45"></v-btn> -->
      </v-card-title>
      <v-card-text v-if="source_document">
        <VuePdfEmbed :source="source_document" />
      </v-card-text>
      <v-card-text v-else>
        <v-skeleton-loader type="card"></v-skeleton-loader>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue";
import ContratosServices from "@/services/contratos.services";
import VuePdfEmbed from "vue-pdf-embed";

const props = defineProps({
  showDialogConfirm: {
    type: Boolean,
    default: false,
  },
  nombre_documento: {
    type: String,
    default: 'terminos_condiciones',
  },
});

const source_document = ref(null);

const emit = defineEmits(["update:modelValue", "onConfirm"]);

const obtenerArchivo = async (ruta) => {
  try {
    
    const { data, headers } = await ContratosServices.viewFile({ ruta });

    const blob = new Blob([data], { type: headers["content-type"] });

    source_document.value = URL.createObjectURL(blob);
  } catch (error) {
    console.error("Error al obtener el archivo:", error);
  }
};

// const descargarArchivo = () => {
//   const link = document.createElement("a");
//   link.href = source_document.value;
//   link.download = props.nombre_documento;
//   link.click();
//   closeDialog();
// };

const closeDialog = () => {
  source_document.value = null;
  emit("update:modelValue", false);
};

defineExpose({
  obtenerArchivo,
});
</script>
