<template>
  <v-dialog max-width="80%" persistent="">
    <v-card>
      <v-card-title
        class="mt-5 d-flex justify-space-between"
        style="position: sticky; top: 0; z-index: 10"
      >
        <v-btn
          icon="mdi-close"
          variant="outlined"
          color="black"
          @click="cerrarDialogo"
        ></v-btn>
        <v-btn
          v-if="props.action"
          @click="descargarArchivo"
          color="complementario-3"
          rounded
          size="48"
        >
          <v-icon color="nieve" size="22">mdi-printer</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text v-if="props.dataUrl">
        <VuePdfEmbed :source="props.dataUrl" />
      </v-card-text>
      <v-card-text v-else>
        <v-skeleton-loader type="card" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup>
import VuePdfEmbed from "vue-pdf-embed";

const props = defineProps({
  nombre_documento: {
    type: String,
    default: "documento",
  },
  dataUrl: {
    type: [Object, String],
  },
  action: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const descargarArchivo = () => {
  const printWindow = window.open(props.dataUrl);

  if (printWindow) {
    printWindow.addEventListener("load", () => {
      printWindow.focus();
      printWindow.print();
    });
  }
};

const cerrarDialogo = () => {
  emit("update:modelValue", false);
};
</script>
