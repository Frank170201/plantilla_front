<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12">
                <v-card class="px-4 py-4 pb-4">
                    <v-card-title class="d-flex align-center">
                        <v-icon class="mr-2" v-if="metadata.page.icon" :icon="metadata.page.icon" />
                        <div class="d-flex flex-column align-start">
                            <span class="font-weight-bold mr-2 text-uppercase" :class="metadata.page.subtitle && 'table-titulo'">
                                {{ metadata.page.title }}
                            </span>
                            <span v-if="metadata.page.subtitle" class="text-h6 font-weight-light table-subtitulo">
                                {{ metadata.page.subtitle }}
                            </span>
                        </div>
                    </v-card-title>

                    <v-data-table-server
                        :headers="headers"
                        :items="items"
                        :items-per-page="paginate.items_per_page"
                        :items-per-page-options="[5, 10, 20, 30, 40, 50]"
                        :items-length="Number(paginate.total_items)"
                        :loading="loading"
                        :page-text="`Página ${paginate.page} de ${totalPaginas}`"
                        @update:options="$emit('updateOptions', $event)"
                        hover
                        :no-data-text="noDataText"
                        items-per-page-text="Resultados por página"
                    >
                        <template #top>
                            <v-row justify="space-between" class="px-5 align-center my-5">
                                <slot name="filters">
                                    <div class="w-5">
                                        <v-text-field
                                            :model-value="filters.search"
                                            @update:model-value="$emit('update:filters', { ...filters, search: $event })"
                                            variant="solo"
                                            :label="metadata.filters?.searchPlaceholder || 'Buscar'"
                                            append-inner-icon="mdi-magnify"
                                            hide-details
                                            density="comfortable"
                                        />
                                    </div>
                                </slot>
                                <v-btn
                                    v-if="showCreateButton"
                                    class="bg-blueDinac"
                                    @click="$emit('openModal')"
                                >
                                    <v-icon>mdi-plus</v-icon> {{ metadata.actionButton?.text || 'Agregar' }}
                                </v-btn>
                            </v-row>
                        </template>

                        <!-- Slots personalizados del padre -->
                        <template
                            v-for="slot in itemSlots"
                            v-slot:[slot]="scope"
                        >
                            <slot :name="slot" v-bind="scope"></slot>
                        </template>

                        <!-- Slot por defecto para activo -->
                        <template v-if="!$slots['item.activo']" v-slot:[`item.activo`]="{ item }">
                            <v-chip :color="item.activo ? 'success' : 'error'">
                                {{ item.activo ? 'Activo' : 'Inactivo' }}
                            </v-chip>
                        </template>

                        <!-- Slot por defecto para acciones -->
                        <template v-if="!$slots['item.acciones']" v-slot:[`item.acciones`]="{ item }">
                            <AppVMenuComponent :items_btn="menuItems(item)" :item="item" />
                        </template>
                    </v-data-table-server>
                </v-card>
            </v-col>
        </v-row>

        <!-- Diálogo de confirmación -->
        <AppDialogoConfirmComponent
            :show-dialog-confirm="showDialogConfirm"
            :title="dialogConfig.title"
            :descripcion="dialogConfig.descripcion"
            :color_icon="dialogConfig.color_icon"
            :ejecutando-confirmacion="ejecutandoConfirmacion"
            @on-confirm="$emit('dialogConfirm')"
            @on-cancel="$emit('dialogCancel')"
        />
    </v-container>
</template>

<script setup>
import { computed, useSlots } from 'vue';
import AppVMenuComponent from '@/components/AppVMenuComponent.vue';
import AppDialogoConfirmComponent from '@/components/AppDialogoConfirmComponent.vue';

defineProps({
    // Metadata con toda la configuración de la página
    metadata: {
        type: Object,
        required: true,
        // Estructura esperada:
        // {
        //     page: { icon, title, subtitle },
        //     actionButton: { text },
        //     filters: { searchPlaceholder }
        // }
    },
    showCreateButton: {
        type: Boolean,
        default: true,
    },

    // Filtros
    filters: {
        type: Object,
        required: true,
    },

    // Tabla
    headers: {
        type: Array,
        required: true,
    },
    items: {
        type: Array,
        required: true,
    },
    paginate: {
        type: Object,
        required: true,
    },
    totalPaginas: {
        type: Number,
        required: true,
    },
    loading: {
        type: Boolean,
        default: false,
    },
    noDataText: {
        type: String,
        default: 'No se encontraron registros',
    },
    menuItems: {
        type: Function,
        required: true,
    },

    // Diálogo de confirmación
    showDialogConfirm: {
        type: Boolean,
        default: false,
    },
    dialogConfig: {
        type: Object,
        default: () => ({
            title: '',
            descripcion: '',
            icon: 'mdi-alert-circle-outline',
            color_icon: 'warningDinac',
        }),
    },
    ejecutandoConfirmacion: {
        type: Boolean,
        default: false,
    },
});

defineEmits([
    'openModal',
    'update:filters',
    'updateOptions',
    'dialogConfirm',
    'dialogCancel',
]);

const slots = useSlots();

const itemSlots = computed(() => {
    return Object.keys(slots).filter(slot => slot.startsWith('item.'));
});
</script>
