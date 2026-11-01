<template>
  <v-dialog :model-value="addEditDialog" max-width="600px" persistent>
    <v-card class="pa-4">
      <v-card-title>
        <span class="text-h5 color-primario-1 font-weight-bold">{{
          selected?.id
            ? "Editar colección permiso"
            : "Agregar colección permiso"
        }}</span>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="form.nombre"
              label="Nombre *"
              required
              variant="outlined"
              :error-messages="$vForm.nombre.$errors.map((e) => e.$message)"
              @blur="$vForm.nombre.$touch()"
              @input="$vForm.nombre.$touch()"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="form.descripcion"
              label="Descripcion *"
              maxlength="250"
              counter
              variant="outlined"
              :error-messages="
                $vForm.descripcion.$errors.map((e) => e.$message)
              "
              @blur="$vForm.descripcion.$touch()"
              @input="$vForm.descripcion.$touch()"
            ></v-textarea>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text @click="closeDialog">Cancelar</v-btn>
        <v-btn
          variant="elevated"
          class="fondo-primario-1"
          @click="saveLocal"
          style="color: #fff"
          >Guardar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch, computed } from "vue";
import { required, helpers } from "@vuelidate/validators";
import useColeccion from "../../composables/useColeccion";
import useVuelidate from "@vuelidate/core";
import useNoti from "@/composables/useNoti";

const { transform, guardarConfiguracion, actualizarConfiguracion } =
  useColeccion();

const props = defineProps({
  addEditDialog: Boolean,
  selected: Object,
});

const { notify } = useNoti();

const emit = defineEmits(["update:addEditDialog", "save", "update:selected"]);

const form = ref({ ...props.selected });

watch(
  () => props.addEditDialog,
  () => {
    form.value = transform(props.selected, "coleccion");
  }
);

const rules = computed(() => ({
  nombre: {
    required: helpers.withMessage("El nombre es requerido", required),
  },
  descripcion: {
    required: helpers.withMessage("El descripción es requerido", required),
  },
}));

const $vForm = useVuelidate(rules, form);

const closeDialog = () => {
  emit("update:addEditDialog", false);
  emit("update:selected", null);
  $vForm.value.$reset();
};

const saveLocal = async () => {
  $vForm.value.$touch();
  if ($vForm.value.$invalid) {
    notify("Por favor, complete los campos requeridos", "error");
    return;
  }
  form.value.id
    ? await actualizarConfiguracion(form.value.id, form.value)
    : await guardarConfiguracion({ ...form.value });
  emit("save", form.value);
  closeDialog();
};
</script>
