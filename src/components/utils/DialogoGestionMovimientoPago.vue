<template>
  <AppDialogComponent
    :showDialogConfirm="showDialog"
    title="Mover Pago"
    icon="mdi-swap-horizontal"
    :showSaveButton="true"
    @update:modelValue="closeDialog"
    @save="confirmarMovimiento"
  >
    <v-card v-if="movimientoBancario" class="mb-4" elevation="2" rounded="lg">
      <v-card-text class="pt-4">
        <!-- Banco -->
        <div class="d-flex align-center mb-4">
          <v-chip
            size="small"
            prepend-icon="mdi-bank"
            color="primary"
            variant="tonal"
          >
            {{ nombreBanco }}
          </v-chip>
        </div>

        <v-row dense>
          <!-- Fecha -->
          <v-col cols="12" sm="6">
            <div class="d-flex align-center">
              <v-icon size="20" class="mr-3"> mdi-calendar </v-icon>

              <div>
                <div class="text-caption text-medium-emphasis">
                  Fecha de movimiento
                </div>

                <div class="text-body-2 font-weight-medium">
                  {{ movimientoBancario.fecha }}
                </div>
              </div>
            </div>
          </v-col>

          <!-- Monto -->
          <v-col cols="12" sm="6">
            <div class="d-flex align-center">
              <v-icon size="20" class="mr-3"> mdi-cash </v-icon>
              <div>
                <div class="text-caption text-medium-emphasis">Monto</div>
                <div class="text-body-2 font-weight-bold">
                  {{ toMoneyFormat(movimientoBancario.monto) }}
                </div>
              </div>
            </div>
          </v-col>

          <!-- Agencia -->
          <v-col cols="12">
            <div class="d-flex align-center">
              <v-icon size="20" class="mr-3"> mdi-map-marker </v-icon>
              <div>
                <div class="text-caption text-medium-emphasis">Agencia</div>
                <div class="text-body-2 font-weight-medium">
                  {{ movimientoBancario.agencia }}
                </div>
              </div>
            </div>
          </v-col>

          <!-- Ubicación -->
          <v-col cols="12" sm="6"  v-if="movimientoBancario.departamento">
            <div class="d-flex align-center">
              <v-icon size="20" class="mr-3"> mdi-map </v-icon>
              <div>
                <div class="text-caption text-medium-emphasis">Ubicación</div>
                <div class="text-body-2 font-weight-medium">
                  {{ movimientoBancario.departamento }}, {{ movimientoBancario.municipio }}
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <ProgresiveAutocomplete
      v-model="nuevoTalonario"
      :vuetify-props="{
        variant: 'outlined',
        label: 'Talonarios',
        placeholder: 'Seleccione un talonario',
        itemTitle: 'correlativo',
        itemValue: 'id',
      }"
      :service="buscarTalonarios"
    />

    <v-textarea
      v-model="motivo"
      variant="outlined"
      label="Motivo"
      placeholder="Ingrese el motivo del movimiento"
    />
  </AppDialogComponent>
</template>

<script setup>
import { computed, ref } from "vue";
import ProgresiveAutocomplete from "@/components/ProgresiveAutocomplete.vue";
import AppDialogComponent from "../AppDialogComponent.vue";
import { formatearFecha } from "@/utils/datetime";
import { toMoneyFormat } from "@/utils/data";

const nuevoTalonario = ref(null);
const motivo = ref("");

const props = defineProps({
  showDialog: Boolean,
  pago: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["update:modelValue"]);

const showDialog = computed({
  get: () => props.showDialog,
  set: (value) => emit("update:modelValue", value),
});

const bitacoraBanco = computed(() => {
  const bitacoras = props.pago?.bitacoras;

  if (!bitacoras?.length) return null;

  return bitacoras.find((b) => b.registro_npe);
});

const registroBanco = computed(() => {
  return bitacoraBanco.value?.registro_npe || null;
});

const nombreBanco = computed(() => {
  return bitacoraBanco.value?.GnConfiguracionesBanco?.nombre || "Banco";
});

const movimientoBancario = computed(() => {
  const log = registroBanco.value;

  if (!log) return null;

  return {
    fecha: formatearFecha(log.fecha_movimiento, "dd/MM/yyyy"),
    monto:
      log.monto_comprobante || log.total_movimiento || log.valor_mandamiento,
    agencia: log.codigo_agencia || log.agencia,
    municipio: log.municipio,
    departamento: log.departamento,
  };
});

const buscarTalonarios = async (search) => {
  console.log("Buscar:", search);
};

const confirmarMovimiento = async () => {
  try {
    closeDialog();
  } catch (error) {
    console.error(error);
  }
};

const closeDialog = () => {
  emit("update:modelValue", false);
};
</script>
