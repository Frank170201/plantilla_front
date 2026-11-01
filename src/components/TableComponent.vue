<template>
  <div>
    <v-data-table-server
      :class="`mt-5 ${tableClass}`"
      :headers="config.headers"
      :items="config.items"
      v-bind="{
        ...config.groupBy && { groupBy: config.groupBy }
      }"
      v-model:page="page"
      v-model:items-per-page="perPage"
      :items-length="config.paginacion.total_rows"
      :items-per-page-options="itemsPerPageOptions"
      :items-per-page="config.paginacion.per_page"
      :page-text="pageText"
      :loading="loading"
      :hide-default-footer="hideFooter"
      hover
      :show-expand="showExpand"
      no-data-text="No se encontraron resultados"
      items-per-page-text="Resultados por página"
      @update:options="handleUpdateOptions"
    >
      <template
        v-for="[slotName] in Object.entries($slots).filter(([name]) => name !== 'default')"
        :key="slotName"
        v-slot:[slotName]="scope"
      >
        <slot :name="slotName" v-bind="scope" />
      </template>
    </v-data-table-server>
  </div>
</template>

<script setup>
import { computed } from "vue";

const page = defineModel('page', { default: 1 });
const perPage = defineModel('perPage', { default: 10 });

const props = defineProps({
  config: {
    type: Object,
    required: true,
    validator: (config) => {
      return config.headers && config.paginacion && Array.isArray(config.items);
    },
  },
  loading: {
    type: Boolean,
    default: false,
  },
  hideFooter: {
    type: Boolean,
    default: false,
  },
  itemsPerPageOptions: {
    type: Array,
    default: () => [5, 10, 20, 30, 40, 50],
  },
  groupBy: {
    type: Array,
    default: () => [],
  },
  showExpand: {
    type: Boolean,
    default: false,
  },
  tableClass: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(["update:options"]);

const pageText = computed(() => {
  const { page, per_page, total_rows } = props.config.paginacion;
  const totalPages = Math.ceil(total_rows / per_page);

  const fin = Math.min(page * per_page, total_rows);

  return `Mostrando ${fin} de ${total_rows} - Página ${page} de ${totalPages}`;
});

const handleUpdateOptions = ({ page, itemsPerPage }) => {
  emit("update:options", {
    page: Number(page),
    itemsPerPage: Number(itemsPerPage)
  });
};
</script>
