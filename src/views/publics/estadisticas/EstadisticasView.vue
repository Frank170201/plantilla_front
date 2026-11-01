<script setup>
import LoadingComponent from "@/components/LoadingComponent.vue";
import ProgresiveAutocomplete from "@/components/ProgresiveAutocomplete.vue";
import useComercios from "@/composables/useComercios";
import { usePageMargin } from "@/composables/usePageMargin";
import comerciosServices from "@/services/comercios.services";
import nivelesServices from "@/services/niveles.services";
import localesServices from "@/services/locales.services";
import InfoCardComponent from "./components/InfoCardComponent.vue";
import AppEmptyState from "@/components/AppEmptyState.vue";
import { ref, computed, watch, onMounted } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import * as turf from "@turf/turf";
import { useRoute, useRouter } from "vue-router";

const pageMargins = usePageMargin();
const { listarComerciosPublicamente } = useComercios();
const route = useRoute();
const router = useRouter();

const idComercio = ref(null);
const nivelSeleccionado = ref(null);
const comercios = ref([]);
const niveles = ref([]);
const poligono_layer_seleccionado = ref(null);
const map = ref(null);
const categorias = ref([]);
const nivelInfo = ref({});
const cargandoMapa = ref(false);

// let recargaAutomatica = null;

const detalleComercio = computed(() => {
  if (!idComercio.value) return null;
  const comercio = comercios.value.find((c) => c.id === idComercio.value);
  if (!comercio) return null;

  return {
    ...comercio,
  };
});

const verifyAccessKey = async () => {
  try {
    const keyFromRoute = route.params.key || null;

    if (!keyFromRoute) {
      console.error("No se proporcionó clave de acceso en la ruta");
      return false;
    }

    const { data } = await comerciosServices.verificarAccesoPublico(
      keyFromRoute
    );

    // El endpoint ahora responde directamente con isValid
    return data?.isValid === true;
  } catch (error) {
    console.error("Error verificando acceso:", error);

    // Si es un error 403 (Forbidden), es clave inválida
    if (error.response?.status === 403) {
      console.log("Clave de acceso inválida");
    }

    return false;
  }
};

const cargarComercios = async (paginacion, termino) => {
  const filtros = {
    ...paginacion,
    ...(termino && { search: termino }),
  };

  const { data, headers } = await listarComerciosPublicamente(filtros);
  comercios.value = data;
  return { data, headers };
};

const obtenerNiveles = async () => {
  const { data } = await comerciosServices.obtenerNivelesPublicos(
    idComercio.value
  );
  niveles.value = data.niveles;
};

const obtenerColoresPorNivel = async (nivel) => {
  const { data } = await localesServices.obtenerColoresNivelPublico(nivel);
  categorias.value = data;
};

const cargarMapa = async () => {
  if (!nivelSeleccionado.value) return;

  cargandoMapa.value = true;

  try {
    if (map.value) {
      map.value.eachLayer((layer) => {
        map.value.removeLayer(layer);
      });
      map.value.off(); // Eliminar todos los event listeners
      map.value.remove(); // Eliminar la instancia del mapa
      map.value = null;
    }

    obtenerColoresPorNivel(nivelSeleccionado.value);
    const { data } = await nivelesServices.obtenerGeoJsonPublico(
      idComercio.value,
      nivelSeleccionado.value
    );
    const geoJson = JSON.parse(data.geoNiveles.geojson_string);

    const latitud = parseFloat(data.geoNiveles.latitud);
    const longitud = parseFloat(data.geoNiveles.longitud);

    const coordenadas = [latitud, longitud];

    const zoomPais = 17;
    const zoomInicial = data.geoNiveles.zoomInicial ?? 20;

    map.value = L.map("map", {
      center: coordenadas,
      attributionControl: false,
      zoom: zoomPais,
      minZoom: data.geoNiveles.minZoom ?? 17,
      maxZoom: data.geoNiveles.maxZoom ?? 22,
    });

    const capa =
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}";

    L.tileLayer(capa, {
      maxZoom: 22,
      maxNativeZoom: 19,
      noWrap: true,
    }).addTo(map.value);

    const points = turf.explode(geoJson); // convierte a puntos

    // Obtener el contorno convexo (como un polígono que encierra todos los puntos)
    const convexHull = turf.convex(points);

    // Agrega al mapa
    const poligonoExtra = L.geoJSON(convexHull, {
      style: { color: "#e2d8c7", fillOpacity: 20, minZoom: zoomInicial },
    });
    const geoJsonLayer = L.geoJSON(geoJson, {
      style: function () {
        return {
          fillOpacity: 0.5, // Fill opacity
          color: "black", // Border color
          weight: 1, // Border weight
        };
      },
    });
    const { data: locales } =
      await localesServices.obtenerLocalesGeojsonPublico(
        nivelSeleccionado.value
      );
    let capaLocales = L.geoJSON(locales, {
      // style: function (feature) {
      //   return {
      //     fillColor: feature.properties.local.color,
      //     fillOpacity: feature.properties.adjudicacion.length > 0 ? 1 : 0.3, // Fill opacity
      //     color: "black", // Border color
      //     weight: 1, // Border weight
      //   };
      // },
      style: function (feature) {
        const adjudicado = feature.properties.adjudicacion.length > 0;
        return {
          fillColor: adjudicado ? feature.properties.local.color : "#000000",
          fillOpacity: 1,
          color: adjudicado ? "black" : "white",
          weight: 1,
        };
      },
      onEachFeature: function (feature, layer) {
        layer.on("click", async function () {
          if (poligono_layer_seleccionado.value) {
            const prevFeature = poligono_layer_seleccionado.value.feature;
            const prevAdjudicado =
              prevFeature.properties.adjudicacion.length > 0;

            poligono_layer_seleccionado.value.setStyle({
              fillColor: prevAdjudicado
                ? prevFeature.properties.local.color
                : "#000000",
              fillOpacity: 1,
            });
          }
          poligono_layer_seleccionado.value = layer;
          layer.setStyle({
            fillColor: "#49ff8f",
            fillOpacity: 0.7,
          });
        });
        layer.bindTooltip(() => {
          const { codigo, adjudicacion, local } = feature.properties;
          const isAdjudicado = adjudicacion.length > 0;

          return `
            <div style="font-size: 13px; line-height: 1.4; position: relative; padding-right: 45px;">
              <b>Local:</b> ${codigo} ${
            isAdjudicado ? "(Adjudicado)" : "(Sin adjudicar)"
          }<br>
              <b>Categoría:</b> ${local.nombre}<br>
              <b>Metraje:</b> ${local.ancho} m x ${local.largo} m<br>
              <div style="position: absolute; top: 5px; right: 5px;">
                ${
                  isAdjudicado
                    ? `<i class="mdi mdi-package-variant-closed-check" style="font-size: 28px; color: green;"></i>`
                    : `<i class="mdi mdi-package-variant-plus" style="font-size: 28px; color: orange;"></i>`
                }
              </div>
            </div>
          `;
        });
      },
    });

    map.value.on("zoomend", () => {
      const z = map.value.getZoom();

      if (z >= zoomInicial) {
        if (!map.value.hasLayer(poligonoExtra))
          map.value.addLayer(poligonoExtra);
        if (!map.value.hasLayer(geoJsonLayer)) map.value.addLayer(geoJsonLayer);
        if (!map.value.hasLayer(capaLocales)) map.value.addLayer(capaLocales);
      } else {
        if (map.value.hasLayer(poligonoExtra))
          map.value.removeLayer(poligonoExtra);
        if (map.value.hasLayer(geoJsonLayer))
          map.value.removeLayer(geoJsonLayer);
        if (map.value.hasLayer(capaLocales)) map.value.removeLayer(capaLocales);
      }
    });

    setTimeout(() => {
      map.value.flyTo([latitud, longitud], zoomInicial, {
        animate: true,
        duration: 1, // segundos
      });
    }, 100);

    geoJsonLayer.bringToFront();
  } finally {
    cargandoMapa.value = false;
  }
};

// const resumenPorNivel = async () => {
//   if (!nivelSeleccionado.value) return;
//   const { data } = await nivelesServices.resumenPorNivel(
//     nivelSeleccionado.value
//   );
//   nivelInfo.value = data;
// };

// const recargarDatosComercio = async () => {
//   if (!idComercio.value) return;

//   try {
//     const { data } = await comerciosServices.obtenerDetalleComercioPublico(
//       idComercio.value
//     );

//     const index = comercios.value.findIndex((c) => c.id === idComercio.value);
//     if (index !== -1) {
//       comercios.value[index] = { ...comercios.value[index], ...data };
//     }
//   } catch (error) {
//     console.error("Error recargando datos del comercio:", error);
//   }
// };

watch(idComercio, () => {
  niveles.value = [];
  nivelSeleccionado.value = null;
  if (idComercio.value) {
    obtenerNiveles();
  }
});

// watch(nivelSeleccionado, () => {
//   if (!nivelSeleccionado.value) {
//     clearInterval(recargaAutomatica);
//     return;
//   }
//   recargaAutomatica = setInterval(() => {
//     cargarMapa();
//     resumenPorNivel();
//     recargarDatosComercio();
//   }, 1 * 60 * 1000); // Cada 1 minuto
//   resumenPorNivel();
//   recargarDatosComercio();
// });

onMounted(async () => {
  try {
    const accessGranted = await verifyAccessKey();

    if (!accessGranted) {
      router.push("/forbidden");
      return;
    }
  } catch (error) {
    router.push("/forbidden");
  }
});
</script>

<template>
  <LoadingComponent />
  <div :style="`height: 100%; ${pageMargins}`" class="flex-grow-1 fondo-nieve">
    <v-row align="center">
      <!-- Autocomplete -->
      <v-col cols="12" md="6">
        <ProgresiveAutocomplete
          v-model="idComercio"
          :vuetify-props="{
            placeholder: 'Selecciona un mercado',
            label: 'Mercado',
            variant: 'outlined',
            itemValue: 'id',
            itemTitle: 'nombre',
            clearable: true,
            hideDetails: true,
          }"
          class="autocomplete-width"
          :service="cargarComercios"
        />
      </v-col>

      <!-- Lista de detalle -->
      <v-col cols="12" md="6" v-if="detalleComercio">
        <div class="d-flex align-center flex-wrap">
          <!-- Total de locales (solo si existe) -->
          <v-chip
            v-if="detalleComercio?.cantidad_locales"
            class="ma-2"
            color="#FF6B35"
            label
          >
            <v-icon icon="mdi-storefront" start></v-icon>
            Total: {{ detalleComercio?.cantidad_locales }}
          </v-chip>

          <!-- Locales adjudicados (solo si hay total) -->
          <v-chip
            v-if="detalleComercio?.cantidad_locales"
            class="ma-2"
            color="#2196F3"
            label
          >
            <v-icon icon="mdi-storefront-check-outline" start></v-icon>
            Adjudicados: {{ detalleComercio?.locales_adjudicados }}
          </v-chip>

          <!-- Locales disponibles -->
          <v-chip class="ma-2" color="#4CAF50" label>
            <v-icon icon="mdi-storefront-outline" start></v-icon>
            Disponibles: {{ detalleComercio?.locales_disponibles || 0 }}
          </v-chip>

          <!-- Porcentaje de ocupación (solo si hay total) -->
          <v-chip
            v-if="
              detalleComercio?.cantidad_locales &&
              detalleComercio?.cantidad_locales > 0
            "
            class="ma-2"
            :color="
              detalleComercio?.locales_adjudicados /
                detalleComercio?.cantidad_locales >=
              0.8
                ? '#38A169'
                : detalleComercio?.locales_adjudicados /
                    detalleComercio?.cantidad_locales >=
                  0.6
                ? '#48BB78'
                : detalleComercio?.locales_adjudicados /
                    detalleComercio?.cantidad_locales >=
                  0.4
                ? '#D69E2E'
                : detalleComercio?.locales_adjudicados /
                    detalleComercio?.cantidad_locales >=
                  0.2
                ? '#DD6B20'
                : '#E53E3E'
            "
            label
          >
            <v-icon icon="mdi-chart-pie" start></v-icon>
            Avance:
            {{
              (
                (detalleComercio?.locales_adjudicados /
                  detalleComercio?.cantidad_locales) *
                100
              ).toFixed(2)
            }}%
          </v-chip>
        </div>
      </v-col>
    </v-row>

    <AppEmptyState
      v-if="!idComercio"
      titulo="Selecciona un mercado"
      descripcion="Utiliza el campo de búsqueda para seleccionar un mercado y visualizar sus niveles y locales."
      icono="mdi-store-search"
      class="mt-4"
      borde
    />

    <!-- Estado vacío cuando el comercio seleccionado no tiene niveles -->
    <AppEmptyState
      v-else-if="idComercio && niveles.length === 0"
      titulo="No hay niveles disponibles"
      descripcion="El mercado seleccionado no tiene niveles configurados para mostrar."
      icono="mdi-layers-off"
      class="mt-4"
      borde
    />

    <div class="rows-niveles mt-4" v-if="niveles.length > 0">
      <v-tooltip
        location="top"
        content-class="custom-tooltip-niveles from-icon"
        open-on-click
      >
        <template #activator="{ props }">
          <v-icon v-bind="props" class="mr-2" color="#D9D9D9"
            >mdi-information-outline</v-icon
          >
        </template>
        <span class="d-flex align-center" style="gap: 8px; max-width: 250px">
          <v-icon>mdi-information-outline</v-icon>
          Selecciona el nivel del mercado que deseas visualizar
        </span>
      </v-tooltip>
      <v-radio-group
        v-model="nivelSeleccionado"
        inline
        class="d-flex align-center"
      >
        <v-radio
          color="#656565"
          @change="cargarMapa"
          v-for="nivel in niveles"
          :key="nivel.id"
          :label="nivel.nombre"
          :value="nivel.id"
        />
      </v-radio-group>
    </div>

    <!-- Estado vacío cuando no se ha seleccionado ningún nivel -->
    <AppEmptyState
      v-if="niveles.length > 0 && !nivelSeleccionado"
      titulo="Selecciona un nivel para ver el mapa"
      descripcion="Elige uno de los niveles disponibles del mercado para visualizar el mapa con los locales y su información."
      icono="mdi-layers-outline"
      class="mt-6"
      borde
    />

    <v-row justify="center" class="mt-5" v-if="nivelSeleccionado">
      <v-col cols="12" md="8">
        <div
          id="map"
          style="
            height: 800px;
            width: 100%;
            border: 1px solid #000;
            border-radius: 16px;
          "
        ></div>
      </v-col>

      <v-col cols="12" md="4">
        <InfoCardComponent
          :nivel-info="nivelInfo"
          :categorias="categorias"
          @recargar="cargarMapa"
        />
      </v-col>
    </v-row>
  </div>
</template>

<style>
.rows-niveles {
  width: 100%;
  background: #f5f5f5;
  box-shadow: 0px 4px 4px 0px #00000040;
  display: flex;
  align-items: center !important;
  padding: 1% 2% 1% 2%;
}

.rows-niveles .v-label {
  color: #121212 !important;
}

.rows-niveles .mdi-radiobox-blank {
  font-size: 1rem;
}

.rows-niveles .mdi-radiobox-marked::before {
  color: #5a6acf !important;
  content: "\F09DF";
  font-size: 4.5rem !important;
}

.custom-tooltip-niveles {
  background-color: #06706b !important;
  border-radius: 16px !important;
  box-shadow: none !important;
  padding: 8px 12px !important;
  font-weight: 600;
}

/* Flecha */
.custom-tooltip-niveles::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid #06706b;
}

.custom-tooltip-niveles.from-icon::after {
  left: calc(50% - 20px);
  transform: none;
}
</style>
