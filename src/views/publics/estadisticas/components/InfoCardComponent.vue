<template>
  <v-card class="mx-auto nivel-info-card" elevation="2">
    <v-card-item>
      <template v-slot:subtitle>
        <v-icon class="me-1 pb-1" color="success" icon="mdi-information" />
        Resumen general -
        <strong>{{ props.nivelInfo?.nombre || "Nivel no disponible" }}</strong>
      </template>
      <!-- quiero agregar un botón con ícono para refrescar la info -->
      <template v-slot:title> </template>
    </v-card-item>

    <v-card-text class="py-0">
      <v-row align="center" no-gutters>
        <v-col class="text-h3 font-weight-bold" cols="6">
          {{ props.nivelInfo?.total_comerciantes || 0 }}
        </v-col>
        <v-col class="text-right" cols="6">
          <v-icon
            color="success"
            icon="mdi-account-supervisor"
            size="80"
          ></v-icon>
        </v-col>
      </v-row>
      <div class="text-body-2 text-medium-emphasis">Vendedores</div>
    </v-card-text>

    <!-- Métricas principales -->
    <div class="d-flex py-3 justify-space-between px-4">
      <v-list-item>
        <v-list-item-title class="text-body-2 font-weight-bold">
          {{ props.nivelInfo?.total_locales || 0 }}
        </v-list-item-title>
        <v-list-item-subtitle>Total de locales</v-list-item-subtitle>
      </v-list-item>

      <v-list-item>
        <v-list-item-title class="text-body-2 font-weight-bold">
          {{ props.nivelInfo?.total_locales_adjudicados || 0 }}
        </v-list-item-title>
        <v-list-item-subtitle>Adjudicados</v-list-item-subtitle>
      </v-list-item>

      <v-list-item>
        <v-list-item-title class="text-body-2 font-weight-bold">
          {{ props.nivelInfo?.total_locales_disponibles || 0 }}
        </v-list-item-title>
        <v-list-item-subtitle>Disponibles</v-list-item-subtitle>
      </v-list-item>
    </div>

    <v-expand-transition>
      <div v-if="expand">
        <v-divider />
        <div class="px-4 mb-4 scroll">
          <v-list>
            <v-list-item
              v-for="categoria in categoriasUnicas"
              :key="categoria.tipoLocal.nombre"
              rounded="lg"
            >
              <template v-slot:prepend>
                <v-icon
                  :icon="categoria.tipoLocal.icono"
                  :color="categoria.color"
                ></v-icon>
              </template>

              <template v-slot:default>
                <v-list-item-title class="text-caption text-grey-darken-1">
                  {{ categoria.tipoLocal.nombre }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  <v-row dense>
                    <v-col cols="4" class="d-flex align-center">
                      Total:
                      <span class="font-weight-bold ml-1">{{
                        categoria?.total
                      }}</span>
                    </v-col>
                    <v-col cols="4" class="d-flex align-center">
                      Adj.:
                      <span class="font-weight-bold ml-1">{{
                        categoria?.adjudicados
                      }}</span>
                    </v-col>
                    <v-col cols="4" class="d-flex align-center">
                      Disp.:
                      <span class="font-weight-bold ml-1">{{
                        categoria?.disponibles
                      }}</span>
                    </v-col>
                  </v-row>
                </v-list-item-subtitle>
              </template>
            </v-list-item>
          </v-list>
        </div>
      </div>
    </v-expand-transition>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn
        :text="!expand ? 'Ver categorías' : 'Ocultar categorías'"
        variant="text"
        @click="expand = !expand"
      ></v-btn>

      <v-spacer></v-spacer>

      <v-tooltip location="top">
        <template v-slot:activator="{ props }">
          <v-icon v-bind="props" @click="emits('recargar')"
            >mdi-reload</v-icon
          >
        </template>
        <span>Recargar nivel</span>
      </v-tooltip>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { computed, ref } from "vue";

const emits = defineEmits(["recargar"]);

// Props
const props = defineProps({
  nivelInfo: {
    type: Object,
    default: () => ({}),
  },
  categorias: {
    type: Array,
    default: () => [],
  },
});

const expand = ref(false);

// Computed para obtener categorías únicas con conteo detallado
const categoriasUnicas = computed(() => {
  if (!props.categorias || props.categorias.length === 0) return [];

  // Agrupar por tipo de local
  const grupos = {};

  props.categorias.forEach((categoria) => {
    const tipoNombre = categoria.tipoLocal.nombre;

    if (!grupos[tipoNombre]) {
      grupos[tipoNombre] = {
        tipoLocal: categoria.tipoLocal,
        color: categoria.color,
        total: 0,
        adjudicados: 0,
        disponibles: 0,
      };
    }

    // Sumar los totales para cada tipo (convertir strings a números)
    grupos[tipoNombre].total += Number(categoria.locales_totales) || 0;
    grupos[tipoNombre].adjudicados +=
      Number(categoria.locales_adjudicados) || 0;
    grupos[tipoNombre].disponibles +=
      Number(categoria.locales_disponibles) || 0;
  });

  // Convertir a array y ordenar alfabéticamente
  return Object.values(grupos).sort((a, b) =>
    a.tipoLocal.nombre.localeCompare(b.tipoLocal.nombre)
  );
});
</script>

<style scoped>
.nivel-info-card {
  border-radius: 16px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
}

.nivel-info-card .v-card-item {
  padding-bottom: 8px;
}

.nivel-info-card .v-list-item {
  padding: 4px 0;
}

.nivel-info-card .v-list-item-title {
  font-size: 1.1rem;
}

.nivel-info-card .v-list-item-subtitle {
  font-size: 0.75rem;
  opacity: 0.7;
}

.scroll {
  max-height: 60vh; /* ajusta según el espacio que quieras */
  overflow-y: auto;
  padding-right: 8px; /* un poco de espacio para que no tape el scroll */
}

/* Opcional: estilizar scroll en navegadores modernos */
.scroll::-webkit-scrollbar {
  width: 6px;
}

.scroll::-webkit-scrollbar-thumb {
  background: #bdbdbd;
  border-radius: 4px;
}

.scroll::-webkit-scrollbar-thumb:hover {
  background: #9e9e9e;
}
</style>
