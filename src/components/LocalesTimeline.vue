<template>
  <AppDialogComponent
    v-model="showDialog"
    :title="titulo"
    icon="mdi-history"
    max-width="80%"
    @update:modelValue="closeDialog"
  >
    <v-timeline
      v-if="historiales && historiales.length > 0"
    >
      <v-timeline-item
        v-for="(historial, index) in sortedHistoriales"
        :key="historial.id || index"
        :dot-color="isCurrent(historial) ? 'success' : 'red-lighten-1'"
        fill-dot
        :icon="isCurrent(historial) ? 'mdi-check-circle' : 'mdi-cancel'"
      >
        <template v-slot:opposite>
          <div class="text-caption text-medium-emphasis font-weight-medium">
            Creado: {{ formatDate(historial.created_at, false) }}

            <span v-if="historial.deleted_at" class="text-error">
              <br />
              Eliminado: {{ formatDate(historial.deleted_at, false) }}
            </span>

            <span v-if="!historial.activo" class="text-error">
              <br />
              Cancelado: {{ formatDate(historial.updated_at, false) }}
            </span>
          </div>
        </template>

        <v-card
          class="timeline-card"
          :class="{ 'active-card': isCurrent(historial) }"
          :prepend-icon="getIcono(historial)"
          :title="getNombre(historial)"
        >
          <template v-slot:subtitle>
            <div class="d-flex flex-wrap gap-2 mb-3">
              <v-chip size="small" variant="flat" color="blue-grey-lighten-4">
                <span class="font-weight-bold">
                  {{ historial.local?.codigo }}
                </span>
              </v-chip>
              <v-chip
                v-if="historial?.fecha_inicio && historial?.fecha_extension"
                size="small"
                variant="flat"
                color="blue-grey-lighten-4"
                prepend-icon="mdi-calendar-range"
              >
                {{ formatDate(historial?.fecha_inicio, false) }} -
                {{ formatDate(historial?.fecha_extension, false) }}
              </v-chip>
            </div>
          </template>

          <v-divider />

          <v-expansion-panels variant="accordion">
            <v-expansion-panel
              v-for="(talonario, talonarioIndex) in historial.talonarios"
              :key="talonarioIndex"
            >
              <v-expansion-panel-title class="talonario-header">
                <v-icon
                  size="small"
                  :color="talonario.deleted_at ? 'error' : 'success'"
                  class="mr-2"
                >
                  {{
                    talonario.deleted_at
                      ? "mdi-trash-can-outline"
                      : "mdi-check-circle"
                  }}
                </v-icon>

                <v-icon class="mr-2">mdi-checkbook</v-icon>
                {{ `Talonario N° ${talonario.correlativo}` }}
                <v-chip
                  size="small"
                  class="ml-2"
                  color="primary"
                  prepend-icon="mdi-calendar-clock"
                >
                  {{ formatDate(talonario.created_at, false) }}
                </v-chip>

                <v-chip
                  size="small"
                  class="ml-2"
                  color="primary"
                  prepend-icon="mdi-cash-multiple"
                >
                  {{ talonario.pagos?.length || 0 }}
                </v-chip>
              </v-expansion-panel-title>

              <v-expansion-panel-text>
                <div class="pagos-list">
                  <v-card
                    v-for="(pago, pagoIndex) in talonario.pagos"
                    :key="pagoIndex"
                    class="pago-card"
                    :class="{ 'pago-eliminado': pago.deleted_at }"
                  >
                    <v-card-text>
                      <div class="d-flex justify-space-between align-center">
                        <div class="flex-grow-1">
                          <div class="font-weight-bold">
                            {{ pago.concepto }}
                          </div>
                          <div class="text-caption text-medium-emphasis">
                            <v-icon size="small">mdi-calendar-clock</v-icon>
                            {{ formatDate(pago.fecha_cobro, false) }}
                          </div>
                          
                          <!-- Fecha de eliminación si aplica -->
                          <div v-if="pago.deleted_at" class="text-caption text-error mt-1">
                            <v-icon size="small">mdi-delete-clock</v-icon>
                            {{ formatDate(pago.deleted_at, false) }}
                          </div>
                        </div>

                        <div class="text-right">
                          <div class="font-weight-bold" :class="{ 'text-medium-emphasis': pago.deleted_at }">
                            {{ toMoneyFormat(pago.monto) }}
                          </div>

                          <v-chip
                            :color="pago.logs?.find((log) => log.activo)?.CtlLogPago.color"
                            size="small"
                          >
                            {{ pago.logs?.find((log) => log.activo)?.CtlLogPago.nombre }}
                          </v-chip>
                        </div>
                      </div>

                      <div class="npe-item mt-2">
                        <div class="d-flex align-center justify-center">
                          <v-icon size="small" class="mr-2">mdi-barcode</v-icon>
                          <div class="d-flex flex-column">
                            <span class="npe-text">{{ formatNpe(pago.npe) }}</span>
                            <span v-if="pago.npe_largo" class="npe-largo-text">{{ pago.npe_largo }}</span>
                          </div>
                        </div>
                      </div>

                      <!-- Renderizado de imagen base64 si existe -->
                      <div v-if="pago.imagen_base64" class="mt-3">
                        <v-img
                          :src="`data:image/png;base64,${pago.imagen_base64}`"
                          max-height="120"
                          max-width="200"
                          class="rounded elevation-2"
                          cover
                        />
                      </div>
                    </v-card-text>

                    <v-divider />

                    <v-card-actions>
                      <AppVMenuComponent
                        :item="pago"
                        :items_btn="actionMenuItems(pago)"
                      />
                    </v-card-actions>
                  </v-card>
                </div>

                <v-divider />

                <div class="text-right font-weight-bold talonario-summary">
                  Total: {{ calcularTotalPagos(talonario.pagos) }}
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </v-timeline-item>
    </v-timeline>

    <AppEmptyState
      v-else
      icon="mdi-history"
      title="Sin historial disponible"
      description="No se han registrado cambios para este local."
    />
  </AppDialogComponent>

  <DialogoLogsFacturacionElectronica
    v-model="dialogoLogsFacturacionElectronica"
    :pago="pagoSeleccionado"
    @on-close="dialogoLogsFacturacionElectronica = false"
  />

  <!-- Diálogo de gestión de movimiento de pago -->
   <!-- <DialogoGestionMovimientoPago
    v-model="dialogGestionMovimientoPago"
    :pago="pagoSeleccionado"
  /> -->
</template>

<script setup>
import { ref, computed } from "vue";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import AppEmptyState from "@/components/AppEmptyState.vue";
import { toMoneyFormat } from "@/utils/data";
import pagosServices from "@/services/pagos.services";
import colecturiaServices from "../services/colecturia.services";
import AppDialogComponent from "./AppDialogComponent.vue";
import AppVMenuComponent from "./AppVMenuComponent.vue";
import DialogoLogsFacturacionElectronica from "@/views/colecturia/components/DialogoLogsFacturacionElectronica.vue";
// import DialogoGestionMovimientoPago from "./utils/DialogoGestionMovimientoPago.vue";

dayjs.extend(duration);

const props = defineProps({
  dialogTimeline: {
    type: Boolean,
    default: false,
  },
  titulo: {
    type: String,
    default: "Historial",
  },
  historiales: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["update:dialogTimeline"]);

const showDialog = computed({
  get: () => props.dialogTimeline,
  set: (value) => emit("update:dialogTimeline", value),
});

const dialogoLogsFacturacionElectronica = ref(false);
// const dialogGestionMovimientoPago = ref(false);
const pagoSeleccionado = ref(null);

const actionMenuItems = (item) => {
  const btns = [
    {
      boton: {
        texto: "Imprimir",
        variant: "text",
        class: "mr-1",
      },
      icono: {
        icon: "mdi-printer",
        class: "mr-1",
        size: "20",
      },
      callback: (item) => imprimirMandamiento(item),
    },
    {
      boton: {
        texto: "Prórrogar vencimiento",
        variant: "text",
        class: "mr-1",
      },
      icono: {
        icon: "mdi-calendar-plus",
        class: "mr-1",
        size: "20",
      },
      callback: (item) => ajustarFechaVencimiento(item),
    },
  ];

  if (!item.logs?.every((log) => log.id_log_pago === 3)) {
    btns.push({
      boton: {
        texto: "Ver logs de facturación electrónica",
        variant: "text",
      },
      icono: {
        icon: "mdi-history",
        class: "mr-1",
        size: "20",
      },
      callback: (item) => abrirDialogoLogsFacturacionElectronica(item),
    });
  }

  // if (item.bitacoras && item.bitacoras.length > 0) {
  //   btns.push({
  //     boton: {
  //       texto: "Gestionar movimiento de pago",
  //       variant: "text",
  //       class: "mr-1",
  //     },
  //     icono: {
  //       icon: "mdi-swap-horizontal",
  //       class: "mr-1",
  //       size: "20",
  //     },
  //     callback: (item) => abrirDialogoGestionMovimientoPago(item),
  //   });
  // }

  return btns;
};

const imprimirMandamiento = async (item) => {
  const { data, headers } = await pagosServices.generatePaymentOrder(item.id);

  const blob = new Blob([data], { type: headers["content-type"] });
  const url = URL.createObjectURL(blob);

  const printWindow = window.open(url);

  if (printWindow) {
    printWindow.addEventListener("load", () => {
      printWindow.focus();
      printWindow.print();
    });
  }

  URL.revokeObjectURL(url);
};

const sortedHistoriales = computed(() => {
  return [...props.historiales].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at),
  );
});

const formatDate = (date, mostrarHora = true) => {
  return dayjs(date).format(`DD/MM/YYYY${mostrarHora ? " HH:mm" : ""}`);
};

const formatNpe = (npe) => {
  if (!npe || typeof npe !== "string") return "";
  return npe.replace(/(.{4})/g, "$1 ").trim();
};

const getNombre = (historial) => {
  if (props.titulo.toLowerCase().includes("locales")) {
    return historial.local?.nombre || historial.local?.codigo || "Sin nombre";
  }
  return historial.comerciante?.nombre || "Sin nombre";
};

const getIcono = () => {
  if (props.titulo.toLowerCase().includes("locales")) {
    return "mdi-storefront-outline";
  }
  return "mdi-account-outline";
};

const calcularTotalPagos = (pagos) => {
  if (!pagos || pagos.length === 0) return "0.00";
  const total = pagos.reduce(
    (sum, pago) => sum + parseFloat(pago.monto || 0),
    0,
  );
  return toMoneyFormat(total);
};

const isCurrent = (historial) => {
  return !historial.deleted_at && historial.activo;
};

const ajustarFechaVencimiento = async (pago) => 
  colecturiaServices.ajustarFechaVencimientoPagoEliminado(pago.id);

const abrirDialogoLogsFacturacionElectronica = (pago) => {
  dialogoLogsFacturacionElectronica.value = true;
  pagoSeleccionado.value = { ...pago };
};

// const abrirDialogoGestionMovimientoPago = (pago) => {
//   dialogGestionMovimientoPago.value = true;
//   pagoSeleccionado.value = { ...pago };
// };

const closeDialog = () => {
  emit("update:dialogTimeline", false);
};
</script>

<style scoped>
.v-timeline-item__content {
  width: 100%;
  display: flex;
  justify-content: center;
}

.timeline-card {
  width: 100%;
  max-width: 720px;
  border-radius: 14px;
  background: white;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.active-card {
  border: 1px solid rgb(var(--v-theme-success));
  background: rgb(var(--v-theme-success), 0.03);
}

.talonario-header {
  padding: 14px 18px;
}

.pagos-list {
  max-height: 380px;
  overflow-y: auto;
  padding-right: 6px;
}

.pago-card {
  margin-bottom: 12px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: background 0.2s ease, transform 0.15s ease;
  position: relative;
  overflow: hidden;
}

/* Estilo para pagos eliminados */
.pago-eliminado {
  background: linear-gradient(
    to right,
    rgba(244, 67, 54, 0.03),
    rgba(244, 67, 54, 0.01)
  );
  border-left: 3px solid rgb(var(--v-theme-error));
  opacity: 0.85;
}

.npe-item {
  background: rgba(0, 0, 0, 0.04);
  padding: 10px;
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.875rem;
}

.npe-text {
  font-family: monospace;
  font-size: 0.875rem;
  font-weight: 500;
}

.npe-largo-text {
  font-family: monospace;
  font-size: 0.65rem;
  color: rgba(0, 0, 0, 0.6);
  word-break: break-all;
  max-width: 100%;
  text-align: center;
}

.talonario-summary {
  margin-top: 16px;
  padding: 12px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.03);
}

.pagos-list::-webkit-scrollbar {
  width: 6px;
}

.pagos-list::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

/* Estilos para la imagen base64 */
.v-img {
  border: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.v-img:hover {
  transform: scale(1.02);
}


/* Mobile */
@media (max-width: 768px) {
  .timeline-card {
    max-width: 100%;
  }
}
</style>