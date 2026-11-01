<template>
  <AppDialogComponent
    v-model="showDialog"
    title="Seguimiento del progreso de emisión de DTEs"
    icon="mdi-progress-check"
    @update:modelValue="closeDialog"
  >
    <template v-if="progreso">
      <div class="d-flex align-center mb-3">
        <!-- <div>
          <div class="text-subtitle-2 font-weight-bold">
            Avance general del proceso
          </div>

          <div class="text-caption text-medium-emphasis">
            Las pruebas para los DTEs seleccionados, son de obligatorio
            cumplimiento, previo solicitud de autorización.
          </div>
        </div> -->
        <div class="d-flex align-center justify-space-between mb-3">
          <div>
            <div class="text-subtitle-2 font-weight-bold">
              Avance general del proceso
            </div>

            <div class="text-caption text-medium-emphasis">
              Las pruebas para los DTEs seleccionados, son de obligatorio
              cumplimiento, previo solicitud de autorización.
            </div>
          </div>

          <v-tooltip location="top">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                class="bg-blueDinac"
                size="small"
                prepend-icon="mdi-refresh"
                @click="reintentarPruebas"
              >
                Reintentar
              </v-btn>
            </template>

              Reintentar pruebas de emisión
          </v-tooltip>
        </div>
      </div>

      <v-progress-linear
        :model-value="progreso.progresoGeneral"
        height="20"
        rounded
        striped
        :color="getColorByProgress(progreso.progresoGeneral)"
        class="mb-4"
      >
        <template v-slot:default="{ value }">
          <span class="text-caption font-weight-bold">
            {{ Math.round(value) }}%
          </span>
        </template>
      </v-progress-linear>

      <v-divider />

      <v-list density="comfortable">
        <template v-if="progreso.errores_prueba.length">
          <v-list-subheader class="text-subtitle-2 font-weight-bold">
            Se han identificado los siguientes errores en las pruebas de
            emisión:
          </v-list-subheader>

          <v-list-item
            v-for="(error, index) in progreso.errores_prueba"
            :key="index"
          >
            <template v-slot:prepend>
              <v-icon color="error">mdi-alert-circle</v-icon>
            </template>

            <v-list-item-title
              v-for="(desc, i) in (error.descripcion || '').split(',')"
              :key="i"
            >
              {{ desc.trim() }}
            </v-list-item-title>

            <v-list-item-subtitle v-if="error.motivo">
              <span class="d-inline-flex align-center">
                {{ error.motivo }}
              </span>
            </v-list-item-subtitle>
          </v-list-item>
        </template>

        <template v-else>
          <v-list-subheader class="text-subtitle-2 font-weight-bold">
            Progreso, emisión de pruebas
          </v-list-subheader>

          <v-list-item
            v-for="prueba in progreso.detalle_pruebas"
            :key="prueba.codigo"
          >
            <template v-slot:prepend>
              <v-icon :color="prueba.completado ? 'green' : 'orange'">
                {{
                  prueba.completado ? "mdi-check-circle" : "mdi-progress-clock"
                }}
              </v-icon>
            </template>

            <v-list-item-title>
              {{ prueba.nombre }}
            </v-list-item-title>

            <v-list-item-subtitle>
              {{ prueba.emitidos }} / {{ prueba.cantidad_requerida }}

              <v-chip v-if="prueba.obligatorio" size="x-small" color="error">
                Obligatorio
              </v-chip>
            </v-list-item-subtitle>
          </v-list-item>
        </template>
      </v-list>
    </template>

    <template v-else>
      <AppEmptyState
        borde
        titulo="No hay información de pruebas"
        descripcion="Configure credenciales y emita documentos de prueba"
        class="mt-4"
      />
    </template>
  </AppDialogComponent>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import informacionFacturacionServices from "@/services/informacionFacturacion.services";
import AppDialogComponent from "../AppDialogComponent.vue";
import AppEmptyState from "../AppEmptyState.vue";
import useNoti from "@/composables/useNoti";

const { notify } = useNoti();

const props = defineProps({
  showDialog: Boolean,
  idComerciante: [String, Number],
  idContribuyente: {
    type: [String, Number],
    required: false,
  },
});

const progreso = ref(null);

const emit = defineEmits(["update:modelValue", "on-close"]);

const showDialog = computed({
  get: () => props.showDialog,
  set: (value) => emit("update:modelValue", value),
});

const closeDialog = () => {
  emit("update:modelValue", false);
  emit("on-close");
};

const getColorByProgress = (progress) => {
  if (progress < 30) return "red";
  if (progress < 70) return "orange";
  if (progress < 100) return "green";
  return "primary";
};

const cargarProgresoEmision = async () => {
  const { data } = await informacionFacturacionServices.obtenerProgresoEmision({
    id_comerciante: props.idComerciante,
  });

  progreso.value = data;
};

const reintentarPruebas = async () => {
  try {
    const { data } = await informacionFacturacionServices.reintentarPruebasEmision({
      id_comerciante: props.idComerciante,
      id_contribuyente: props.idContribuyente,
    });

    cargarProgresoEmision();
    notify(data.message, "success");
    closeDialog();
  } catch (error) {
    console.error("Error al reintentar pruebas de emisión:", error);
  }
};

watch(() => props.idComerciante, cargarProgresoEmision, { immediate: true });
</script>
