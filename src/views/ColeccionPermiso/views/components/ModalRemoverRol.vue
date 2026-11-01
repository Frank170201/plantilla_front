<template>
  <v-dialog :model-value="removerRolModal" max-width="1200px" persistent>
    <v-card class="pa-4">
      <v-card-title>
        <span class="text-h5 color-primario-1 font-weight-bold">
          Seleccione un rol
        </span>
      </v-card-title>
      <v-card-text>
        <v-divider class="mb-4" />
        <v-autocomplete
          v-model="form.id_roles"
          multiple
          label="Rol *"
          item-title="name"
          item-value="id"
          variant="outlined"
          placeholder="Rol"
          class="mt-4"
          :items="listaRoles"
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
          @click="guardarRoles"
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

const { listaRoles, transform, removerRol, listarRoles } = useColeccion();

const props = defineProps({
  removerRolModal: Boolean,
  permisoSeleccionado: Object,
});

const emit = defineEmits([
  "update:removerRolModal",
  "save",
  "update:permisoSeleccionado",
]);

const form = ref({ ...props.permisoSeleccionado });

watch(
  () => props.removerRolModal,
  () => {
    listarRoles();
    form.value = transform(props.permisoSeleccionado, "rol");
  }
);

const closeDialog = () => {
  emit("update:removerRolModal", false);
  emit("update:permisoSeleccionado", null);
};

const guardarRoles = async () => {
  await removerRol(form.value.id_coleccion, form.value);
  emit("save", form.value);
  closeDialog();
};
</script>
