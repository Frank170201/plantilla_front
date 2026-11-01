<template>
  <AppDialogComponent
    :show-dialog-confirm="modelValue"
    title="Generación de mandamientos"
    icon="mdi-cash-plus"
    :show-save-button="true"
    @update:model-value="$emit('update:modelValue', $event)"
    @save="guardar"
  >
    <v-form>
      <v-row dense>
        <!-- Monto -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.monto"
            label="Monto"
            density="comfortable"
            type="number"
            prefix="$"
            variant="outlined"
            clearable
            hide-details="auto"
            v-bind="AttributeMapper($v, 'monto')"
          />
        </v-col>

        <!-- Tipo de cobro -->
        <v-col cols="12" md="6">
          <v-autocomplete
            v-model="form.tipoIngresoAplicable"
            density="comfortable"
            :items="tipoIngreso"
            label="Tipo de ingreso *"
            item-title="nombre"
            item-value="id"
            variant="outlined"
            clearable
            v-bind="AttributeMapper($v, 'tipoIngresoAplicable')"
          />
        </v-col>

        <!-- Fecha de vencimiento -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.fecha_vencimiento"
            label="Fecha de vencimiento"
            variant="outlined"
            density="comfortable"
            type="date"
            hide-details="auto"
            v-bind="AttributeMapper($v, 'fecha_vencimiento')"
          />
        </v-col>

        <!-- Receptor -->
        <v-col cols="12" md="6">
          <div class="d-flex align-center gap-2">
            <ProgresiveAutocomplete
              v-model="form.receptor"
              :service="serviceReceptores"
              :vuetify-props="{
                variant: 'outlined',
                density: 'comfortable',
                hideDetails: 'auto',
                label: 'Receptor',
                itemTitle: 'nombre',
                itemValue: 'id',
                clearable: true,
                disabled: mostrarFormProveedor,
              }"
            >
              <template #item="{ item, props: itemProps }">
                <v-list-item v-bind="itemProps" :title="item.raw.nombre">
                  <template #subtitle>
                    <span class="text-caption">{{
                      item.raw.numero_documento
                    }}</span>
                  </template>
                </v-list-item>
              </template>

              <template #no-data="{ busqueda }">
                <div class="text-center py-1">
                  <template v-if="busqueda?.length >= 2">
                    <v-btn
                      block
                      variant="tonal"
                      color="primary"
                      size="small"
                      prepend-icon="mdi-plus"
                      class="mt-2"
                      @click="abrirFormNuevoReceptor(busqueda)"
                    >
                      Agregar "{{ busqueda }}" como nuevo proveedor
                    </v-btn>
                  </template>
                  <template v-else>
                    <span class="text-caption text-grey">
                      Escribe para buscar un receptor
                    </span>
                  </template>
                </div>
              </template>
            </ProgresiveAutocomplete>

            <v-btn
              :class="
                mostrarFormProveedor ? 'bg-grey-darken-1' : 'fondo-primario-1'
              "
              class="text-white"
              @click="mostrarFormProveedor = !mostrarFormProveedor"
            >
              <v-icon class="mr-1">{{
                mostrarFormProveedor ? "mdi-minus" : "mdi-plus"
              }}</v-icon>
              {{ mostrarFormProveedor ? "Cancelar" : "Nuevo" }}
            </v-btn>
          </div>
        </v-col>

        <v-col v-if="mostrarFormProveedor" cols="12">
          <v-text-field
            v-model="form.concepto"
            label="Concepto"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            maxLength="100"
            counter="100"
            v-bind="AttributeMapper($v, 'concepto')"
          />
        </v-col>

        <!-- Formulario nuevo proveedor -->
        <v-col cols="12">
          <v-expand-transition>
            <v-sheet v-if="mostrarFormProveedor" class="mt-2">
              <div class="d-flex align-center gap-2 mb-2">
                <v-icon>mdi-account-tie</v-icon>
                <span class="text-subtitle-1 font-weight-bold text-uppercase"
                  >Datos del proveedor</span
                >
              </div>
              <v-divider class="mb-4" />
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="formProveedor.id_tipo_documento"
                    :items="tiposDocumentos"
                    item-title="nombre"
                    item-value="id"
                    label="Tipo de documento *"
                    variant="outlined"
                    density="comfortable"
                    clearable
                    v-bind="AttributeMapper($vProveedor, 'id_tipo_documento')"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-if="mascaraPorTipoDocumento"
                    v-model="formProveedor.numero_documento"
                    label="Número de documento *"
                    variant="outlined"
                    density="comfortable"
                    :disabled="!formProveedor.id_tipo_documento"
                    v-mask="mascaraPorTipoDocumento"
                    v-bind="AttributeMapper($vProveedor, 'numero_documento')"
                  />
                  <v-text-field
                    v-else
                    v-model="formProveedor.numero_documento"
                    label="Número de documento *"
                    variant="outlined"
                    density="comfortable"
                    :disabled="!formProveedor.id_tipo_documento"
                    v-bind="AttributeMapper($vProveedor, 'numero_documento')"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formProveedor.nrc"
                    label="NRC *"
                    variant="outlined"
                    density="comfortable"
                    hide-details="auto"
                    v-bind="AttributeMapper($vProveedor, 'nrc')"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formProveedor.nombre"
                    label="Nombre / Razón social *"
                    variant="outlined"
                    density="comfortable"
                    v-bind="AttributeMapper($vProveedor, 'nombre')"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formProveedor.nombre_comercial"
                    label="Nombre comercial"
                    variant="outlined"
                    density="comfortable"
                    hide-details="auto"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <ProgresiveAutocomplete
                    v-model="formProveedor.id_actividad"
                    :service="listarActividades"
                    v-bind="AttributeMapper($vProveedor, 'id_actividad')"
                    :vuetify-props="{
                      variant: 'outlined',
                      density: 'comfortable',
                      hideDetails: 'auto',
                      label: 'Actividad económica *',
                      itemTitle: 'nombre',
                      itemValue: 'id',
                      clearable: true,
                    }"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <ProgresiveAutocomplete
                    v-model="formProveedor.id_municipio"
                    :service="listarMunicipios"
                    v-bind="AttributeMapper($vProveedor, 'id_municipio')"
                    :vuetify-props="{
                      variant: 'outlined',
                      density: 'comfortable',
                      hideDetails: 'auto',
                      label: 'Municipio *',
                      itemTitle: 'nombre',
                      itemValue: 'id',
                      clearable: true,
                    }"
                  >
                    <template #item="{ item, props: itemProps }">
                      <v-list-item v-bind="itemProps">
                        <span v-if="item.raw.departamento" class="text-caption">
                          Departamento de
                          <b>{{ item.raw.departamento.nombre }}</b>
                        </span>
                      </v-list-item>
                    </template>
                  </ProgresiveAutocomplete>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formProveedor.direccion"
                    label="Dirección *"
                    variant="outlined"
                    density="comfortable"
                    hide-details="auto"
                    v-bind="AttributeMapper($vProveedor, 'direccion')"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formProveedor.telefono"
                    label="Teléfono *"
                    variant="outlined"
                    density="comfortable"
                    placeholder="####-####"
                    v-mask="'####-####'"
                    v-bind="AttributeMapper($vProveedor, 'telefono')"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formProveedor.correo_electronico"
                    label="Correo electrónico *"
                    variant="outlined"
                    density="comfortable"
                    v-bind="AttributeMapper($vProveedor, 'correo_electronico')"
                  />
                </v-col>
              </v-row>
            </v-sheet>
          </v-expand-transition>
        </v-col>

        <!-- Concepto cuando mostrarFormProveedor es false-->
        <v-col v-if="!mostrarFormProveedor" cols="12">
          <v-text-field
            v-model="form.concepto"
            label="Concepto"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            maxLength="100"
            counter="100"
            v-bind="AttributeMapper($v, 'concepto')"
          />
        </v-col>
      </v-row>
    </v-form>
  </AppDialogComponent>
</template>

<script setup>
import { ref, watch } from "vue";
import AppDialogComponent from "@/components/AppDialogComponent.vue";
import useAdminPagosApl from "@/views/adminPagosAplicables/composables/useAdminPagosApl";
import { onMounted, computed } from "vue";
import ProgresiveAutocomplete from "@/components/ProgresiveAutocomplete.vue";
import useNoti from "@/composables/useNoti";
import catalogosServices from "@/services/catalogos.services";
import informacionFacturacionServices from "@/services/informacionFacturacion.services";
import departamentosServices from "@/services/departamentos.services";
import useVuelidate from "@vuelidate/core";
import { AttributeMapper, ValidationBuilder } from "@/utils/VuelidateForm";
import { maxLength } from "@vuelidate/validators";
const { notify } = useNoti();

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  serviceReceptores: {
    type: Function,
    required: true,
  },
  serviceCrearReceptor: {
    type: Function,
    required: true,
  },
});

const tiposDocumentos = ref([]);

const listarTiposDocumentos = async () => {
  const { data } = await catalogosServices.fetchTipoDoc();
  tiposDocumentos.value = data;
};
const listarActividades = async (paginacion, termino) => {
  const filtros = {
    ...paginacion,
    ...(termino ? { busqueda: termino } : {}),
  };
  const response =
    await informacionFacturacionServices.cargarCatalogoActividades(filtros);
  response.data = response.data.map((actividad) => ({
    ...actividad,
    nombre: `${actividad.codigo} - ${actividad.nombre}`,
  }));
  return response;
};

const listarMunicipios = async (paginacion, termino) => {
  const filtros = {
    ...paginacion,
    ...(termino ? { nombre: termino } : {}),
  };
  return departamentosServices.fetchMunicipio(filtros);
};

const emit = defineEmits(["update:modelValue", "on-save"]);
const { tipoIngreso, obtenerTipoIngreso } = useAdminPagosApl();

const mostrarFormProveedor = ref(false);

const formInicial = () => ({
  monto: null,
  concepto: "",
  fecha_vencimiento: null,
  receptor: null,
  tipoIngresoAplicable: null,
});

const form = ref(formInicial());

const formProveedorInicial = () => ({
  numero_documento: "",
  nrc: "",
  nombre: "",
  nombre_comercial: "",
  id_tipo_documento: null,
  id_municipio: null,
  direccion: "",
  telefono: "",
  correo_electronico: "",
  id_actividad: null,
});

const formProveedor = ref(formProveedorInicial());

const abrirFormNuevoReceptor = (busqueda) => {
  formProveedor.value.nombre = busqueda ?? "";
  mostrarFormProveedor.value = true;
};

const rulesForm = computed(() => ({
  monto: new ValidationBuilder().required().construirReglas(),
  concepto: new ValidationBuilder().required().maxLength(100).construirReglas(),
  fecha_vencimiento: new ValidationBuilder().required().construirReglas(),
  tipoIngresoAplicable: new ValidationBuilder().required().construirReglas(),
}));

const $v = useVuelidate(rulesForm, form);

const rulesProveedor = computed(() => {
  if (!mostrarFormProveedor.value) return {};
  return {
    numero_documento: new ValidationBuilder().required().construirReglas(),
    nombre: new ValidationBuilder().required().construirReglas(),
    id_tipo_documento: new ValidationBuilder().required().construirReglas(),
    id_municipio: new ValidationBuilder().required().construirReglas(),
    nrc: new ValidationBuilder().required().construirReglas(),
    direccion: new ValidationBuilder().required().construirReglas(),
    id_actividad: new ValidationBuilder().required().construirReglas(),
    telefono: new ValidationBuilder()
      .required()
      .regex("El teléfono debe tener un formato válido", /^(2|6|7)\d{3}-\d{4}$/)
      .construirReglas(),
    correo_electronico: new ValidationBuilder()
      .required()
      .email("El correo electrónico no es válido")
      .construirReglas(),
  };
});

const $vProveedor = useVuelidate(rulesProveedor, formProveedor);

const mascaraPorTipoDocumento = computed(() => {
  const mascaras = {
    1: "########-#",
    2: "####-######-###-#",
    3: null,
    4: null,
  };
  return mascaras[formProveedor.value.id_tipo_documento] ?? null;
});

const guardar = async () => {
  $v.value.$touch();
  if (mostrarFormProveedor.value) $vProveedor.value.$touch();

  if ($v.value.$error || $vProveedor.value.$error) {
    notify("Hay campos inválidos", "error");
    return;
  }

  let idProveedor = form.value.receptor;

  if (mostrarFormProveedor.value) {
    const { data } = await props.serviceCrearReceptor(formProveedor.value);
    idProveedor = data.id;
  }

  if (!idProveedor) {
    notify("El receptor es requerido", "error");
    return;
  }

  emit("on-save", {
    monto: form.value.monto,
    concepto: form.value.concepto,
    fecha_vencimiento: form.value.fecha_vencimiento,
    id_tipo_ingreso: form.value.tipoIngresoAplicable,
    id_proveedor: idProveedor,
  });

  emit("update:modelValue", false);
};
watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      form.value = formInicial();
      $v.value.$reset();
    }
    formProveedor.value = formProveedorInicial();
    $vProveedor.value.$reset();
    mostrarFormProveedor.value = false;
  },
);

watch(mostrarFormProveedor, (visible) => {
  if (!visible) {
    formProveedor.value = formProveedorInicial();
    $vProveedor.value.$reset();
  }
});

watch(
  () => formProveedor.value.id_tipo_documento,
  () => {
    formProveedor.value.numero_documento = "";
  },
);

onMounted(() => {
  obtenerTipoIngreso();
  listarTiposDocumentos();
});
</script>
