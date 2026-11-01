<template>
  <v-autocomplete
    variant="outlined"
    no-filter
    v-bind="props.vuetifyProps"
    :items="items"
    @keydown="manejarBusqueda"
    item
    :model-value="modelValue"
    @update:modelValue="updateValue"
    @click:clear="recargarItems"
  >
    <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
      <slot
        v-if="!['no-data', 'append-item'].includes(slot)"
        :name="slot"
        v-bind="scope ?? {}"
      />
    </template>
    <template v-slot:no-data>
      <div class="text-center py-2 w-full" style="width: 100%">
        <v-progress-circular
          v-if="cargando"
          indeterminate
          color="primary"
          :size="25"
          :width="3"
        />
        <template v-else>
          <p class="mx-0 my-0">
            {{
              renderEmptyText
                ? renderEmptyText(busqueda)
                : "No hay datos disponibles"
            }}
          </p>
          <slot name="no-data" :busqueda="busqueda" />
        </template>
      </div>
    </template>
    <template v-slot:append-item>
      <div
        v-intersect="manejarInterseccion"
        class="text-center"
        style="width: 100%"
      >
        <v-progress-circular
          v-if="items.length > 0 && cargando"
          indeterminate
          class="mt-2"
          color="primary"
          :size="25"
          :width="3"
        />
      </div>
    </template>
  </v-autocomplete>
</template>
<script setup>
import { debounce } from "lodash";
import { ref } from "vue";
import { onMounted } from "vue";

const emit = defineEmits(["update:modelValue"]);

// Props
const props = defineProps({
  modelValue: [String, Number, Object],
  service: { type: Function, required: true },
  vuetifyProps: { type: Object },
  omitirCargaInicial: { type: Boolean },
  renderEmptyText: { type: Function },
});

// Data
const cargando = ref(false);
const busqueda = ref(null);
const items = ref([]);
const paginate = ref({
  page: 1,
  items_per_page: 30,
  total_items: 0,
});

// Metodos
const cargarItems = async () => {
  try {
    cargando.value = true;

    const paginacion = {
      pagination: true,
      per_page: paginate.value.items_per_page,
      page: paginate.value.page,
    };

    const { data, headers } = await props.service(paginacion, busqueda.value);

    paginate.value.total_items = +headers.total_rows;
    items.value = items.value.concat(data);
  } catch (error) {
    const { page } = paginate.value;
    paginate.value.page = page > 1 ? page - 1 : 1;
  } finally {
    cargando.value = false;
  }
};

const buscarItem = async (termino) => {
  if (busqueda.value === termino) return;

  busqueda.value = termino;
  items.value = [];
  paginate.value.page = 1;
  paginate.value.total_items = 0;

  cargarItems();
};

const cargarMasItems = async () => {
  if (cargando.value) return;

  const { items_per_page, page, total_items } = paginate.value;
  const itemsYaCargados = page * items_per_page;

  if (!(itemsYaCargados < total_items)) return;

  paginate.value.page = page + 1;
  paginate.value.items_per_page = items_per_page;

  cargarItems();
};

const recargarItems = () => {
  paginate.value.page = 1;
  busqueda.value = null;
  items.value = [];
  cargarItems();
};

// UI
const updateValue = (newValue) => {
  emit("update:modelValue", newValue);
};

const manejarInterseccion = debounce((isIntersecting) => {
  if (!isIntersecting) return;

  cargarMasItems();
}, 500);

const manejarBusqueda = debounce((evento) => {
  const termino = evento.target.value;
  buscarItem(termino);
}, 500);

onMounted(() => {
  if (!props.omitirCargaInicial) cargarItems();
});

// Define expose
defineExpose({
  buscarItem,
  recargarItems,
});
</script>
