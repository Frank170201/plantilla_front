<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12">
                <v-card class="px-4 py-4 pb-4">
                    <v-card-title class="d-flex align-center color-primario-1">
                        <v-icon class="mr-2">mdi-tools</v-icon>
                        <span class="font-weight-bold mr-2 text-uppercase">Configuración de servicios</span>
                    </v-card-title>
                    <v-data-table-server 
                        v-model:items-per-page="paginate.items_per_page" 
                        :headers="headers"
                        :items="servicios" 
                        :items-per-page-options="[5, 10, 20, 30, 40, 50]"
                        :items-length="Number(paginate.total_items)" 
                        :loading="loading"
                        :page-text="`Página ${paginate.page} de ${totalPaginas}`" 
                        @update:options="reloadTable" 
                        hover
                        no-data-text="No se encontraron servicios" 
                        items-per-page-text="Resultados por página"
                    >
                        <template #top>
                            <v-row justify="space-between" class="px-5 align-center my-5">
                                <div class="w-5">
                                    <v-text-field 
                                        v-model="search" 
                                        variant="solo" 
                                        label="Buscar"
                                        append-inner-icon="mdi-magnify" 
                                        hide-details 
                                        @update:model-value="filter"
                                        density="comfortable" 
                                    />
                                </div>
                                <v-btn class="fondo-primario-1 text-white" @click="openDialog">
                                    <v-icon>mdi-plus</v-icon> Agregar
                                </v-btn>
                            </v-row>
                        </template>

                        <template #item.icono="{ item }">
                            <v-icon :color="item.color">{{ item.icono }}</v-icon>
                        </template>
                        
                        <template v-slot:item.acciones="{ item }">
                            <AppVMenuComponent :items_btn="obtenerMenuDinamico(item)" :item="item" />
                        </template>
                    </v-data-table-server>
                </v-card>
            </v-col>
        </v-row>

        <AddEditModal 
            :add-edit-dialog="addEditDialog" 
            :selected="selected"
            @update:addEditDialog="addEditDialog = false" 
            @save="handleSave" 
        />

        <AppDialogoConfirmComponent 
            v-model="dialogo_confirmar" 
            @on-confirm="deleteServicio" 
            title="Eliminar Servicio"
            descripcion="¿Está seguro que desea eliminar este servicio?" 
        />
    </v-container>
</template>
<script setup>
import { computed } from 'vue';
import staticVars from '../composables/staticVars';
import AppDialogoConfirmComponent from "@/components/AppDialogoConfirmComponent.vue";
import useServicios from '../composables/useServicios';
import AppVMenuComponent from "@/components/AppVMenuComponent.vue";
import AddEditModal from "./components/AddEditModal.vue"
import { debounce } from 'lodash';

const {
    loading,
    paginate,
    servicios,
    search,
    selected,
    addEditDialog,
    dialogo_confirmar,
    obtenerMenuDinamico,
    listarServicios,
    openDialog,
    eliminarServicio,
    transform,
} = useServicios(); 

const { headers } = staticVars();

const reloadTable = ({ page, itemsPerPage }) => {
    paginate.value.page = page;
    paginate.value.items_per_page = itemsPerPage;
    listarServicios();
}

let debounceSearch = debounce(listarServicios, 1000);
const filter = () => {
  debounceSearch();
};

const totalPaginas = computed(() => {
  return Math.ceil(paginate.value.total_items / paginate.value.items_per_page);
});

const handleSave = () => {
    selected.value = transform(null);
    listarServicios();
    addEditDialog.value = false;
};

const deleteServicio = async () => {
    loading.value = true;
    await eliminarServicio(selected.value?.id);
    listarServicios();
    loading.value = false;
    selected.value.id = ''
}
</script>