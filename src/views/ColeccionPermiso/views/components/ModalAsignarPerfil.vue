<template>
  <v-dialog :model-value="asignarPerfilModal" max-width="1200px" persistent>
    <v-card class="pa-4">
      <v-card-title>
        <span class="text-h5 color-primario-1 font-weight-bold">
          {{ `Seleccione un perfil` }}
        </span>
      </v-card-title>

      <v-card-text>
        <v-divider class="mb-4" />
        <v-autocomplete
          v-model="form.id_perfiles"
          multiple
          label="Perfil *"
          item-title="name"
          item-value="id"
          variant="outlined"
          placeholder="Perfil"
          class="mt-4"
          :items="listaPerfiles"
          clearable
          chips
          closable-chips
        >
          <template #item="{ props, item }">
            <v-list-item
              v-bind="props"
              :title="item.raw.name"
              :subtitle="item.raw.descripcion"
            ></v-list-item>
          </template>
        </v-autocomplete>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text @click="closeDialog">Cancelar</v-btn>
        <v-btn
          variant="elevated"
          class="fondo-primario-1"
          @click="guardarPerfiles"
          style="color: #fff"
          >Guardar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from "vue";
import useColeccion from "../../composables/useColeccion";

const { listaPerfiles, transform, asignarPerfil, listarPerfiles } =
  useColeccion();

const props = defineProps({
  asignarPerfilModal: Boolean,
  permisoSeleccionado: Object,
});

const emit = defineEmits([
  "update:asignarPerfilModal",
  "save",
  "update:permisoSeleccionado",
]);

const form = ref({ ...props.permisoSeleccionado });

watch(
  () => props.asignarPerfilModal,
  () => {
    listarPerfiles();
    form.value = transform(props.permisoSeleccionado, "perfil");
  }
);

const closeDialog = () => {
  emit("update:asignarPerfilModal", false);
  emit("update:permisoSeleccionado", null);
};

const guardarPerfiles = async () => {
  await asignarPerfil(form.value.id_coleccion, form.value);
  emit("save", form.value);
  closeDialog();
};
</script>
