<template>
  <v-dialog
    :model-value="props.showDialogConfirm"
    :max-width="dialogWidth"
    persistent
  >
    <v-card>
      <v-card-title>
        <p class="text-h5 text-center font-weight-black my-2 text-break">
          {{ props.title }}
        </p>
      </v-card-title>
      <v-divider />
      <v-card-text class="d-flex flex-column justify-center align-center">
        <span class="text-center">{{ props.descripcion }}</span>
        <slot />
      </v-card-text>
      <v-card-actions class="d-flex justify-center align-center">
        <v-btn variant="outlined" color="warningDinac" @click="closeDialog">
          {{ cancelText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { computed } from "vue";
import { useDisplay } from "vuetify";

const props = defineProps({
  showDialogConfirm: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "¿Realizar Acción?",
  },
  descripcion: {
    type: String,
    default: "¿Esta seguro que desea realizar esta acción?",
  },
  cancelText: {
    type: String,
    default: "Cancelar",
  },
});

const { xs } = useDisplay();
const dialogWidth = computed(() => (xs.value ? "90%" : "500px"));

const emit = defineEmits(["update:modelValue", "onConfirm", "onCancel"]);

const closeDialog = () => {
  emit("update:modelValue", false);
  emit("onCancel");
};
</script>
