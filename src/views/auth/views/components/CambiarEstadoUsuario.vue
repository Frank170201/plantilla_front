<template>
  <v-dialog model-value="dialog" max-width="600px" persistent>
    <v-card>
      <v-card-title>
        <span class="text-h5">Cambiar estado del usuario</span>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-autocomplete
              v-model="form.id_estado_usuario"
              :items="props.selects.estados"
              item-title="nombre"
              item-value="id"
              label="Estados dispobibles"
              variant="outlined"
              density="comfortable"
              :error-messages="$vForm.id_estado_usuario.$errors.map((e) => e.$message)"
              @blur="$vForm.id_estado_usuario.$touch()"
              @input="$vForm.id_estado_usuario.$touch()"
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn text @click="closeDialog">Cancelar</v-btn>
        <v-btn variant="tonal" class="bg-blueDinac" @click="saveLocal">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import {helpers, required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import useNoti from "@/composables/useNoti";
import {computed, ref} from "vue";
import usuariosServices from "@/services/usuarios.services";

const props = defineProps({
  dialog: {
    type: Boolean,
    default: false,
  },
  selects: {
    type: Object,
    default: () => ({}),
  },
  id_usuario_temp: {
    type: Number,
    default: null
  }
});
const form = ref({
  id_estado_usuario: null

})

const {notify} = useNoti();

const emit = defineEmits(["update:modelValue", "update:TablaUsuarios"]);

const rules = computed(() => ({
  id_estado_usuario: {
    required: helpers.withMessage("El estado es requerido", required),
  },
}));

const $vForm = useVuelidate(rules, form);

const closeDialog = () => {
  $vForm.value.$reset();
  form.value.id_estado_usuario = null;
  emit("update:modelValue", false);
};

const saveLocal = async () => {
  $vForm.value.$touch();
  if ($vForm.value.$invalid) {
    notify("Por favor, complete los campos requeridos", "error");
    return;
  }

  try {
    await usuariosServices.actualizarEstado(props.id_usuario_temp, form.value);
    emit("update:TablaUsuarios");
    closeDialog();
  } catch (e) {
    return null
  }
};
</script>
