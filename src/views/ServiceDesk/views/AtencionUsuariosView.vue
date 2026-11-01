<template>
  <v-container fluid>
    <v-card class="px-4 py-4 pb-4">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-face-agent</v-icon>
        <span class="font-weight-bold mr-2 text-uppercase">
          Atención al Usuario
        </span>
      </v-card-title>

      <TableComponent :config="tableConfig" @update:options="reloadTable">
        <template #top>
          <v-row justify="space-between" class="px-5 align-center my-5">
            <div class="w-5">
              <v-text-field
                v-model="search"
                variant="solo"
                label="Buscar"
                append-inner-icon="mdi-magnify"
                density="comfortable"
                @update:model-value="filter"
              />
            </div>
            <div class="d-flex align-center" style="gap: 16px">
              <v-btn class="bg-blueDinac" @click="openDialog">
                <v-icon>mdi-plus</v-icon> Nueva Solicitud
              </v-btn>
            </div>
          </v-row>
        </template>
        <template v-slot:[`item.asunto`]="{ item }">
          <div
            class="d-flex flex-column align-start cursor-pointer"
            @click.stop="clickColumn(item)"
          >
            {{ item.asunto }}
            <small class="text-medium-emphasis">
              {{ item.tipo?.nombre ?? "Sin tipo" }}
            </small>
          </div>
        </template>
        <template v-slot:[`item.estado`]="{ item }">
          <v-chip :color="item.estado.color">
            {{ item.estado.nombre }}
          </v-chip>
        </template>
      </TableComponent>

      <AppDialogComponent
        v-model="showDialog"
        title="Nueva Solicitud"
        icon="mdi-ticket-outline"
        :showSaveButton="true"
        @save="crearSolicitud"
        @update:modelValue="closeDialog"
      >
        <v-row>
          <v-col cols="12" md="6">
            <v-autocomplete
              v-model="form.tipo"
              :items="tipoSolicitudes"
              label="Tipo *"
              item-title="nombre"
              item-value="id"
              variant="outlined"
              density="comfortable"
              clearable
              prepend-inner-icon="mdi-format-list-checkbox"
              v-bind="validarPropiedades($vProperty.tipo, 'Tipo')"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-autocomplete
              v-model="form.comercio"
              :items="comercios"
              label="Comercio *"
              item-title="nombre"
              item-value="id"
              variant="outlined"
              density="comfortable"
              clearable
              prepend-inner-icon="mdi-warehouse"
              v-bind="validarPropiedades($vProperty.comercio, 'Comercio')"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="form.asunto"
              variant="outlined"
              label="Asunto *"
              density="comfortable"
              prepend-inner-icon="mdi-text-short"
              v-bind="validarPropiedades($vProperty.asunto, 'Asunto')"
            />
          </v-col>
          <v-col cols="12">
            <label class="text-body-2 text-medium-emphasis mb-2 d-block">
              Descripción
            </label>
            <div @focusout="$vProperty.descripcion.$touch()">
              <EditorTextoEnriquecido
                v-model="form.descripcion"
                :errores="$vProperty.descripcion.$errors.map((e) => e.$message)"
              />
            </div>
          </v-col>

          <v-col cols="12">
            <v-divider class="my-2" />
            <PhotoUploadComponent
              @files-selected="onFilesSelected"
              file-type-mode="all"
            />
          </v-col>
        </v-row>
      </AppDialogComponent>
    </v-card>
  </v-container>
</template>

<script setup>
import TableComponent from "@/components/TableComponent.vue";
import useServiceDesk from "../composables/useServiceDesk";
import AppDialogComponent from "@/components/AppDialogComponent.vue";
import EditorTextoEnriquecido from "@/components/utils/EditorTextoEnriquecido.vue";
import PhotoUploadComponent from "@/components/PhotoUploadComponent.vue";
import { onMounted } from "vue";
import { debounce } from "lodash";

const {
  search,
  showDialog,
  form,
  comercios,
  tableConfig,
  tipoSolicitudes,
  $vProperty,
  clickColumn,
  validarPropiedades,
  openDialog,
  closeDialog,
  onFilesSelected,
  obtenerTipos,
  crearSolicitud,
  cargarSolicitudes,
  cargarComercios,
  reloadTable,
} = useServiceDesk();

const debounceSearch = debounce(cargarSolicitudes, 1000);
    
const filter = () => {
  debounceSearch();
};

onMounted(() => {
  cargarComercios();
  obtenerTipos();
});
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer:hover {
  background-color: rgba(0, 0, 0, 0.04);
  border-radius: 4px;
  padding: 2px 4px;
  margin: -2px -4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>