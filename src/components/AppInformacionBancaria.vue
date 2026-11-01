<template>
    <v-dialog v-model="model" max-width="1200" persistent>
        <v-card class="rounded-lg" style="padding-bottom: 0 !important">
            <v-card-text class="py-2 pb-0 pa-0" style="position: relative">
                <h2 class="text-h5">
                    <v-icon size="28px !important">mdi-bank</v-icon>
                    Información bancaria
                </h2>
                <v-divider class="mt-2" />
                <v-row class="mt-4">
                    <v-col cols="12" md="6">
                        <v-text-field 
                            v-model="formulario.nombres"
                            label="Nombres"
                            placeholder="Nombres"
                            variant="outlined"
                            :hide-details="!$vForm.nombres.$errors.length"
                            :error-messages="$vForm.nombres.$errors.map((error) => error.$message)"
                            @input="$vForm.nombres.$touch"
                            @blur="$vForm.nombres.$touch"
                        />
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-text-field 
                            v-model="formulario.apellidos"
                            label="Apellidos"
                            placeholder="Apellidos"
                            variant="outlined"
                            :hide-details="!$vForm.apellidos.$errors.length"
                            :error-messages="$vForm.apellidos.$errors.map((error) => error.$message)"
                            @input="$vForm.apellidos.$touch"
                            @blur="$vForm.apellidos.$touch"
                        />
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-select 
                            v-model="formulario.banco"
                            label="Banco"
                            placeholder="Banco"
                            item-title="nombre"
                            :items="catalogoBancos"
                            variant="outlined"
                            item-value="id"
                            clearable
                            :hide-details="!$vForm.banco.$errors.length"
                            :error-messages="$vForm.banco.$errors.map((error) => error.$message)"
                            @blur="$vForm.banco.$touch"
                        />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field 
                            v-model="formulario.numero_cuenta"
                            label="Número de cuenta"
                            placeholder="Número de cuenta"
                            variant="outlined"
                            :hide-details="!$vForm.numero_cuenta.$errors.length"
                            :error-messages="$vForm.numero_cuenta.$errors.map((error) => error.$message)"
                            @input="$vForm.numero_cuenta.$touch"
                            @blur="$vForm.numero_cuenta.$touch"
                        />
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-select 
                            v-model="formulario.tipo_cuenta"
                            label="Tipo cuenta"
                            placeholder="Tipo de cuenta"
                            item-title="nombre"
                            :items="catalogoTiposCuenta"
                            variant="outlined"
                            item-value="id"
                            clearable
                            :hide-details="!$vForm.tipo_cuenta.$errors.length"
                            :error-messages="$vForm.tipo_cuenta.$errors.map((error) => error.$message)"
                            @blur="$vForm.tipo_cuenta.$touch"
                        />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-select 
                            v-model="formulario.tipo_cliente"
                            label="Tipo de cliente"
                            placeholder="Tipo de cliente"
                            item-title="nombre"
                            :items="catalogoTiposCliente"
                            variant="outlined"
                            item-value="id"
                            clearable
                            :hide-details="!$vForm.tipo_cliente.$errors.length"
                            :error-messages="$vForm.tipo_cliente.$errors.map((error) => error.$message)"
                            @blur="$vForm.tipo_cliente.$touch"
                        />
                    </v-col>
                </v-row>
                <div
                    class="d-flex align-center justify-end gap-4 py-4 mb-0 mt-4"
                    style="position: sticky; bottom: 0; background-color: #ffff"
                >
                    <v-btn color="#043432" variant="outlined" @click.stop="cerrarModal">
                        Cancelar
                    </v-btn>
                    <v-btn color="#043432" @click.stop="confirmarEnvioFormulario">
                        Guardar
                    </v-btn>
                </div>


                <AppDialogoConfirmComponent
                    v-model="dialogoConfirmacion"
                    @on-confirm="guardarInformacionBancaria"
                    title="¿Desea guardar los cambios?"
                    descripcion="Al confirmar, se actualizará la información bancaria."
                />
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
<script setup>
import useNoti from '@/composables/useNoti';
import informacionBancariaServices from '@/services/informacionBancaria.services';
import useVuelidate from '@vuelidate/core';
import { helpers, numeric, required } from '@vuelidate/validators';
import { computed, watch } from 'vue';
import { onMounted, ref } from 'vue';
import AppDialogoConfirmComponent from './AppDialogoConfirmComponent.vue';

const props = defineProps({
    idComerciante: [Number, String],
});

const emits = defineEmits(['on-informacion-actualizada']);

const estadoInicialFormulario = {
    nombres: null, 
    apellidos: null, 
    numero_cuenta: null, 
    banco: null, 
    tipo_cliente: null, 
    tipo_cuenta: null,
}

const { notify } = useNoti();

// Estado y computed
const model = defineModel({ type: Boolean, default: false });
const catalogoBancos = ref([]);
const catalogoTiposCliente = ref([]);
const catalogoTiposCuenta = ref([]);
const formulario = ref({ ...estadoInicialFormulario });
const dialogoConfirmacion = ref(false);

const rules = computed(() => ({
    nombres: {
        required: helpers.withMessage("Campo requerido", required),
    },
    apellidos: {
        required: helpers.withMessage("Campo requerido", required),
    },
    numero_cuenta: {
        required: helpers.withMessage("El número de cuenta es requerido.", required),
        numeric: helpers.withMessage("El número de cuenta debe incluir solo números", numeric),
    },
    banco: {
        required: helpers.withMessage("El banco es requerido", required),
    },
    tipo_cliente: {
        required: helpers.withMessage("El tipo de cliente", required),
    },
    tipo_cuenta: {
        required: helpers.withMessage("El tipo de cuenta", required),
    },
}));

const $vForm = useVuelidate(rules, formulario);

// Acciones
const limpiarFormulario = () => {
  $vForm.value.$reset();
  formulario.value = { ...estadoInicialFormulario };
};

const cerrarModal = () => {
    limpiarFormulario();
    model.value = false;
};

const confirmarEnvioFormulario = () => {
  $vForm.value.$touch();

  if ($vForm.value.$invalid) return;

  dialogoConfirmacion.value = true;
};

const guardarInformacionBancaria = async () => {
    const response = await informacionBancariaServices.actualizarInformacionFacturacion(props.idComerciante, { ...formulario.value });

    if (![200].includes(response.status)) return;

    notify("Información bancaria actualizada correctamente.", "success");
    emits('on-informacion-actualizada');
    dialogoConfirmacion.value = false;
    cerrarModal();
}

const cargarCatalogoBancos = async () => {
    const response = await informacionBancariaServices.cargarBancos();

    if (response.status !== 200) return;

    catalogoBancos.value = response.data;
}

const cargarCatalogoTiposCliente = async () => {
    const response = await informacionBancariaServices.cargarTiposCliente();

    if (response.status !== 200) return;

    catalogoTiposCliente.value = response.data;
}

const cargarCatalogoTiposCuenta = async () => {
    const response = await informacionBancariaServices.cargarTiposCuenta();

    if (response.status !== 200) return;

    catalogoTiposCuenta.value = response.data;
}

const cargarInformacionBancariaExistente = async (idComerciante) => {
    const response = await informacionBancariaServices.cargarInformacionComerciante(idComerciante);

    if (!response.data) return;

    formulario.value.apellidos = response.data.apellidos;
    formulario.value.nombres = response.data.nombres;
    formulario.value.numero_cuenta = response.data.numero_cuenta;
    formulario.value.banco = response.data.banco?.id ?? null;
    formulario.value.tipo_cliente = response.data.tipo_cliente?.id ?? null;
    formulario.value.tipo_cuenta = response.data.tipo_cuenta?.id ?? null;
}

// Lifecycles
onMounted(() => {
    cargarCatalogoBancos();
    cargarCatalogoTiposCliente();
    cargarCatalogoTiposCuenta();
});

watch(
    () => props.idComerciante,
    (value) => {
        limpiarFormulario();
        
        if (!value) return;

        cargarInformacionBancariaExistente(value);
    },
    { immediate: true },
)
</script>