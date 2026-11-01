<template>
  <v-dialog :model-value="props.showDialogConfirm" :max-width="dialogWidth" persistent>
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon v-if="props.icon" :icon="props.icon" class="mr-2" />
        <span class="font-weight-bold">{{ props.title }}</span>
      </v-card-title>
      <v-card-subtitle class=" text-center font-weight-bold">
        {{ props.subtitle }}
      </v-card-subtitle>
      <v-card-text>
        <slot></slot>
      </v-card-text>
      <v-card-actions>
        <v-btn v-if="props.showSaveButton" class="bg-blueDinac" @click="onSave">Guardar</v-btn>
        <v-btn color="red" @click="closeDialog">Cerrar</v-btn>
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
    default: "",
  },
  subtitle: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    default: "",
  },
  showSaveButton: {
    type: Boolean,
    default: false,
  },
});

const { xs } = useDisplay();
const dialogWidth = computed(() => (xs.value ? "90%" : "800px"));

const emit = defineEmits(["update:modelValue", "save"]);

const closeDialog = () => {
  emit("update:modelValue", false);
};

const onSave = () => {
  emit("save");
};

</script>
