<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card class="px-4 py-4 pb-4">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-account</v-icon>
            <span class="font-weight-bold mr-2 text-uppercase"
              >Lista de Usuarios</span
            >
          </v-card-title>
          <v-data-table-server
            v-model:items-per-page="paginate.items_per_page"
            :headers="headers"
            :items="usuarios"
            :items-per-page-options="[5, 10, 20, 30, 40, 50]"
            :items-length="Number(paginate.total_items)"
            :loading="loading"
            :page-text="`Página ${paginate.page} de ${totalPaginas}`"
            @update:options="reloadTable"
            hover
            no-data-text="No se encontraron usuarios"
            items-per-page-text="Resultados por página"
          >
            <template #top>
              <v-row justify="space-between" class="px-5 align-center my-5">
                <div class="w-5">
                  <v-text-field
                    v-model="search"
                    variant="solo"
                    label="Buscar"
                    append-inner-icon="mdi-magnify"
                    hide-details
                    @update:model-value="filter"
                    density="comfortable"
                  />
                </div>
                <v-btn class="bg-blueDinac" @click="openDialog">
                  <v-icon>mdi-plus</v-icon>
                  Agregar
                </v-btn>
              </v-row>
            </template>
            <template #item.permiso="{ item }">
              <v-chip label color="primario-1" class="ma-1"
                >{{ item.permiso.nombre }}
              </v-chip>
            </template>
            <template #item.estado="{ item }">
              <v-tooltip
                :text="item.estado.nombre"
                location="top"
                :content-class="`bg-${item.estado.color}`"
                open-on-click
              >
                <template #activator="{ props }">
                  <v-icon
                    v-bind="props"
                    :icon="item.estado.icono"
                    :color="item.estado.color"
                    :v-tooltip="{ text: `'${item.estado.nombre}'` }"
                  />
                </template>
              </v-tooltip>
            </template>
            <template #item.verified="{ item }">
              <v-icon v-if="item.verified" class="text-green text-center mr-2"
                >mdi-check-circle</v-icon
              >
              <v-icon
                v-else-if="item.verified === null"
                class="text-orange text-center mr-2"
                >mdi-alert-circle</v-icon
              >
              <v-icon v-else class="text-red text-center mr-2"
                >mdi-close-circle</v-icon
              >
            </template>
            <template #item.comercios="{ item }">
              <v-chip
                v-for="comercio in item.comercios"
                :key="comercio.id"
                label
                color="primario-1"
                class="ma-1"
              >
                {{ comercio.nombre }}
              </v-chip>
            </template>
            <template v-slot:item.acciones="{ item }">
              <AppVMenuComponent
                :items_btn="obtenerMenuDinamico(item)"
                :item="item"
              />
            </template>
          </v-data-table-server>
        </v-card>
      </v-col>
    </v-row>

    <AddEditModal
      :add-edit-dialog="addEditDialog"
      :selected="selected"
      :colecciones="colecciones"
      @update:addEditDialog="addEditDialog = false"
      @save="handleSave"
    />

    <CambiarEstadoUsuario
      v-model="cambiar_estado"
      :id_usuario_temp="id_usuario_temp"
      @update:TablaUsuarios="listarUsuarios"
      :selects="selects"
    />

    <AppDialogoConfirmComponent
      v-model="dialogo_confirmar"
      @on-confirm="deleteUsuario"
      title="Eliminar Usuario"
      descripcion="¿Está seguro que desea eliminar este usuario?"
    />

    <AppDialogoConfirmComponent
      v-model="dialogo_verificar"
      @on-confirm="confirmarVerificarUsuario"
      title="Verificar usuario"
      descripcion="¿Está seguro que desea verificar al usuario?"
    />

    <AppDialogoConfirmComponent
      v-model="dialogo_reset"
      @on-confirm="confirmResetPassword"
      title="Restablecer contraseña"
      descripcion="¿Está seguro que desea restablecer la contraseña del usuario?"
    />

    <AppDialogComponent v-model="showDialog">
      <AppTabComponent :content_tabs="tabs">
        <template #tab-0>
          <TableComponent :config="table" :loading="loading" :hide-footer="true">
            <template v-slot:[`item.nombre`]="{ item }">
              <div class="d-flex align-center">
                <v-icon :icon="item.icono" class="mr-1" />
                {{ item.nombre }}
              </div>
            </template>

            <template v-slot:[`item.descripcion`]="{ item }">
              <span>{{ item.descripcion }}</span>
            </template>

            <template v-slot:[`item.MetodoAutenticacionUsuario`]="{ item }">
              <v-tooltip 
                :text="item.MetodoAutenticacionUsuario?.is_primary ? 'Principal' : 'Secundario'"
                location="top"
                :content-class="item.MetodoAutenticacionUsuario?.is_primary ? 'bg-green darken-2' : 'bg-grey'"
              >
                <template #activator="{ props }">
                  <v-icon
                    v-bind="props"
                    :icon="item.MetodoAutenticacionUsuario?.is_primary ? 'mdi-check-circle' : 'mdi-close'"
                    class="align-center"
                    :color="item.MetodoAutenticacionUsuario?.is_primary ? 'green' : 'grey'"
                  />
                </template>
              </v-tooltip>
            </template>

            <template v-slot:[`item.acciones`]="{ item }">
              <AppVMenuComponent :items_btn="obtenerMenuDinamicoMetodos(item)" />
            </template>
          </TableComponent>
        </template>
        <template #tab-1>
          Método configurado: {{ setData.metodo.nombre }}
          <v-autocomplete
            v-model="metodo_correo_seleccionado"
            :items="setData.metodos"
            outlined
            item-title="nombre"
            item-value="id"
            label="Seleccione el método a configurar"
            @update:modelValue="configurarMetodoEnviocorreo"
          />
        </template>
      </AppTabComponent>
    </AppDialogComponent>

    <!-- 2FA -->
     <AppDialogoConfirmComponent
      v-model="activateOrDeactivateModal"
      @on-confirm="activateOrDeactivateMethod"
      title="Cambio de método de autentiación"
      descripcion="¿Desea realizar el cambio de método de autentiación?"
    />

     <AppDialogoConfirmComponent
      v-model="deleteMethodModal"
      @on-confirm="deleteMethod"
      title="Eliminar método de autentiación"
      descripcion="¿Está seguro que desea eliminar este método de autenticación?"
    />
  </v-container>
</template>
<script setup>
import { computed, onMounted, ref } from "vue";
import useUsuarios from "../composables/useUsuarios";
import staticVars from "../composables/staticVars";
import AppVMenuComponent from "@/components/AppVMenuComponent.vue";
import AddEditModal from "./components/AddEditModal.vue";
import AppDialogoConfirmComponent from "@/components/AppDialogoConfirmComponent.vue";
import CambiarEstadoUsuario from "@/views/auth/views/components/CambiarEstadoUsuario.vue";
import usuariosServices from "@/services/usuarios.services";
import { debounce } from "lodash";
import useColeccion from "../../ColeccionPermiso/composables/useColeccion";
import TableComponent from "@/components/TableComponent.vue";
import AppDialogComponent from "@/components/AppDialogComponent.vue";
import AppTabComponent from "@/components/AppTabComponent.vue";

const {
  tabs,
  loading,
  paginate,
  usuarios,
  search,
  selected,
  addEditDialog,
  showDialog,
  setData,
  table,
  dialogo_confirmar,
  dialogo_verificar,
  dialogo_reset,
  cambiar_estado,
  id_usuario_temp,
  metodo_correo_seleccionado,
  activateOrDeactivateModal,
  deleteMethodModal,
  listarUsuarios,
  eliminarUsuario,
  obtenerMenuDinamico,
  obtenerMenuDinamicoMetodos,
  openDialog,
  verificarUsuario,
  resetPassword,
  cambiarMetodoCorreo,
  reconfigurarMetodoAutenticacion,
  eliminarMetodoConfigurado,
} = useUsuarios();

const { listarColeccion, colecciones } = useColeccion();

const { headers } = staticVars();

const selects = ref({
  estados: [],
});

const reloadTable = ({ page, itemsPerPage }) => {
  paginate.value.page = page;
  paginate.value.items_per_page = itemsPerPage;
  listarUsuarios();
  listarColeccion();
};

let debounceSearch = debounce(listarUsuarios, 1000);
const filter = () => {
  debounceSearch();
};

const handleSave = () => {
  selected.value = null;
  listarUsuarios();
  addEditDialog.value = false;
};

const totalPaginas = computed(() => {
  return Math.ceil(paginate.value.total_items / paginate.value.items_per_page);
});

const llenarSelects = async () => {
  const { data: estados } = await usuariosServices.obtenerEstados();
  selects.value.estados = estados;
};

const deleteUsuario = async () => {
  loading.value = true;
  await eliminarUsuario(selected.value?.id);
  await listarUsuarios();
  loading.value = false;
  selected.value.id = "";
};

const confirmarVerificarUsuario = async () => {
  loading.value = true;
  await verificarUsuario(selected.value?.id).finally(() => {
    loading.value = false;
  });
  await listarUsuarios();
  selected.value.id = "";
};

const confirmResetPassword = async () => {
  loading.value = true;
  await resetPassword(selected.value?.id).finally(() => {
    loading.value = false;
  });
  await listarUsuarios();
  selected.value.id = "";
};

const configurarMetodoEnviocorreo = async () => {
  await cambiarMetodoCorreo(selected.value?.id, metodo_correo_seleccionado.value)
};

const activateOrDeactivateMethod = async () => {
  await reconfigurarMetodoAutenticacion(selected.value?.id, metodo_correo_seleccionado.value)
};

const deleteMethod = async () => {
  await eliminarMetodoConfigurado(selected.value?.id, metodo_correo_seleccionado.value)
};

onMounted(() => {
  listarUsuarios();
  llenarSelects();
});
</script>
