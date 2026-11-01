<template>
  <v-container fluid>
    <v-card class="px-4 py-4 pb-4">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-headset</v-icon>
        <span class="font-weight-bold mr-2 text-uppercase">
          Soporte y Seguimiento de Atención al Usuario
        </span>
      </v-card-title>

      <TableComponent
        :config="tableConfig"
        @update:options="reloadListadoTickets"
      >
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
    </v-card>
  </v-container>
</template>

<script setup>
import TableComponent from "@/components/TableComponent.vue";
import useServiceDesk from "../../composables/useServiceDesk";
import { onMounted } from "vue";

const {
  router,
  search,
  tableConfig,
  obtenerTipos,
  reloadListadoTickets,
  filter,
} = useServiceDesk();

const clickColumn = async (item) => {
  router.push(`/atencion-usuario/ticket/${item.id}/asignacion-seguimiento`);
};

onMounted(() => {
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
