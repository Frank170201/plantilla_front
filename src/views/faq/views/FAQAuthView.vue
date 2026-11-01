<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12">
                <v-card class="px-4 py-4 pb-4">
                    <v-card-title class="d-flex align-center color-primario-1">
                        <v-icon class="mr-2">mdi-frequently-asked-questions</v-icon>
                        <span class="font-weight-bold mr-2 text-uppercase">Preguntas Frecuentes</span>
                    </v-card-title>
                    <v-data-table-server 
                        v-model:items-per-page="paginate.items_per_page" 
                        :headers="headers"
                        :items="faq" 
                        :items-per-page-options="[5, 10, 20, 30, 40, 50]"
                        :items-length="Number(paginate.total_items)" 
                        :loading="loading"
                        :page-text="`Página ${paginate.page} de ${totalPaginas}`" 
                        @update:options="reloadTable" 
                        hover
                        no-data-text="No se encontraron preguntas frecuentes" 
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
                                <v-btn class="fondo-primario-1 text-white" @click="openDialog()">
                                    <v-icon>mdi-plus</v-icon> Agregar
                                </v-btn>
                            </v-row>
                        </template>
                        <template #[`item.activo`]="{ item }">
                            <v-chip
                                :color="item.activo ? 'green' : 'red'"
                            >
                                <span class="text-capitalize">{{ item.activo ? 'si' : 'no' }}</span>
                            </v-chip>
                        </template>
                        <template #[`item.acciones`]="{ item }">
                            <AppVMenuComponent :items_btn="obtenerMenuDinamico(item)" :item="item" />
                        </template>
                    </v-data-table-server>
                </v-card>
            </v-col>
        </v-row>

        <AddEditModal 
            v-model="addEditDialog"
            @save="listarFAQ"
        />

        <AppDialogoConfirmComponent 
            v-model="dialogo_confirmar" 
            @on-confirm="deleteFAQ" 
            title="Eliminar Pregunta Frecuente"
            descripcion="¿Está seguro que desea eliminar esta pregunta?" 
        />
    </v-container>
</template>
<script setup>
import { computed } from 'vue';
import staticVars from '../composables/staticVars';
import useFAQ from '../composables/useFAQ';
import { debounce } from 'lodash';
import AddEditModal from './components/AddEditModal.vue';
import AppVMenuComponent from "@/components/AppVMenuComponent.vue";
import AppDialogoConfirmComponent from "@/components/AppDialogoConfirmComponent.vue";

const {
    headers
} = staticVars();

const {
    loading,
    paginate,
    faq,
    search,
    addEditDialog,
    dialogo_confirmar,
    listarFAQ,
    openDialog,
    obtenerMenuDinamico,
    eliminarFAQ,
    selected,
} = useFAQ();

const totalPaginas = computed(() => {
  return Math.ceil(paginate.value.total_items / paginate.value.items_per_page);
});

const reloadTable = ({ page, itemsPerPage }) => {
    paginate.value.page = page;
    paginate.value.items_per_page = itemsPerPage;
    listarFAQ();
}

let debounceSearch = debounce(listarFAQ, 1000);
const filter = () => {
  debounceSearch();
};

const deleteFAQ = async () => {
    loading.value = true;
    await eliminarFAQ(selected.value?.id);
    listarFAQ();
    loading.value = false;
    selected.value.id = null;
}
</script>