<template>
  <v-dialog :model-value="props.showDialogConfirm" :max-width="dialogWidth" persistent>

    <v-card>
        <v-card-title class="d-flex align-center">
          
          <p
            class="text-h5 text-center font-weight-black my-2"
            style="
              word-break: break-word;
              white-space: normal;
              display: inline-block;
            "
          >
            {{ props.title }}
          </p>
        </v-card-title>
      <v-card-text class="d-flex flex-column justify-center align-center pa-0 mt-4">
        <span class="text-center text-grey-darken-4" v-html="props.descripcion" />
      </v-card-text>
      <v-card-actions class="d-flex justify-center align-center pa-0 mt-4 flex-wrap">
        <v-btn
          :disabled="ejecutandoConfirmacion"
          variant="outlined"
          class="flex-grow-1 font-weight-bold text-none"
          color="#184442"
          @click="closeDialog"
        >
          {{ cancelText }}
        </v-btn>
        <v-btn
          :loading="ejecutandoConfirmacion"
          variant="elevated"
          class="flex-grow-1 font-weight-bold text-none"
          color="#184442"
          @click="confirmAction"
        >
          Aceptar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { computed } from 'vue';
import { useDisplay } from 'vuetify'

const props = defineProps({
  showDialogConfirm: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '¿Realizar Acción?'
  },
  descripcion: {
    type: String,
    default: '¿Esta seguro que desea realizar esta acción?'
  },
  icon: {
    type: String,
    default: 'mdi-alert-circle-outline'
  },
  color_icon: {
    type: String,
    default: 'teal-lighten-1'
  },
  size: {
    type: Number,
    default: 60,
  },
  callback: {
    type: Function,
    default: null
  },
  cancelText: {
    type: String,
    default: 'Cancelar'
  },
  ejecutandoConfirmacion: {
    type: Boolean,
    default: false,
  },
});

const { xs } = useDisplay()
const dialogWidth = computed(() => (xs.value ? '90%' : '500px'))

const emit = defineEmits(['update:modelValue', 'onConfirm', 'onCancel']);

const confirmAction = async () => {
  if (typeof props.callback === 'function') {
    try {
      await props.callback();
    } catch (e) {
      console.error('Error al crear solicitud');
    }
  }
  emit('onConfirm');
  emit('update:modelValue', false);
}
const closeDialog = () => {
  emit('update:modelValue', false);
  emit('onCancel')
}
</script>
