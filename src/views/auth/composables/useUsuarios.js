import useNoti from "@/composables/useNoti";
import UsuarioServices from "@/services/usuarios.services";
import authServices from "@/services/auth.services";
import { useAuthStore } from "@/store/auth";
import { ref } from "vue";
import administracionCorreoServices from "@/services/administracionCorreo.services";

const useUsuarios = () => {
  const loading = ref(false);
  const paginate = ref({
    page: 1,
    items_per_page: 10,
    total_items: 0,
  });
  const { validarRoles } = useAuthStore();
  const { notify } = useNoti();
  const cambiar_estado = ref(false);
  const usuarios = ref([]);
  const perfiles = ref([]);
  const setData = ref([]);
  const search = ref('');
  const selected = ref(null);
  const addEditDialog = ref(false);
  const dialogo_confirmar = ref(false);
  const paginacion = ref(true);
  const id_usuario_temp = ref(null);
  const dialogo_verificar = ref(false);
  const dialogo_reset = ref(false);
  const showDialog = ref(false);
  const metodo_correo_seleccionado = ref(null);
  const activateOrDeactivateModal = ref(false);
  const deleteMethodModal = ref(false);

  const listarUsuarios = async () => {
    let params = {
      page: paginate.value.page,
      per_page: paginate.value.items_per_page,
      email: search.value,
      paginacion: paginacion.value
    };
    loading.value = true;
    const { data, headers } = await UsuarioServices.fetchUsuarios(
      params
    );
    usuarios.value = data;
    paginate.value.total_items = Number(headers.total_rows);
    loading.value = false;
  }

  const eliminarUsuario = async (id) => {
    return await UsuarioServices.eliminarUsuario(id).then((response) => {
      if (response.data) {
        notify(response.data, "success");
      }
    });
  }

  const verificarUsuario = async (id) => {
    return await UsuarioServices.verificarUsuario(id).then((response) => {
      if (response.data) {
        notify(response.data, "success");
      }
    });
  }

  const resetPassword = async (id) => {
    return await UsuarioServices.resetPassword(id).then((response) => {
      if (response.data) {
        notify(response.data, "success");
      }
    });
  };

  const obtenerConfiguracionUsuario = async (id) => {
    const { data } = await administracionCorreoServices.obtenerConfiguracionUsuario(id);
    setData.value = data;
  };


  // Table
  const headers = [
    { align: "center", title: "Método", key: "nombre", sortable: false },
    { align: "center", title: "Descripción", key: "descripcion", sortable: false },
    { align: "center", title: "Tipo", key: "MetodoAutenticacionUsuario", sortable: false },
    { align: "center", title: "Acciones", key: "acciones", sortable: false },
  ];

  // Función para crear configuración de tabla
  const createTableConfig = (additionalHeaders = []) => ({
    headers: [...headers, ...additionalHeaders],
    paginacion: {
      page: 1,
      per_page: 10,
      total_rows: 0,
    },
    items: [],
  });

  const table = ref(createTableConfig());

  const loadTableData = async (tableRef, serviceMethod, params = {}) => {
    const { data, headers } = await serviceMethod({
      page: tableRef.value.paginacion.page,
      per_page: tableRef.value.paginacion.per_page,
      ...params,
    });

    tableRef.value.paginacion.page = Number(headers.page);
    tableRef.value.paginacion.total_rows = Number(headers.total_rows);
    tableRef.value.paginacion.per_page = Number(headers.per_page);
    tableRef.value.items = data;
  };

  const obtenerMetodosConfigurados = async (id) => {
    await loadTableData(table, (params) => authServices.obtenerMetodosConfigurados(id, params));
  };

  const configurarMetodoAutenticacion = async (item) => {
    selected.value = item;
    await obtenerConfiguracionUsuario(selected.value?.id);
    await obtenerMetodosConfigurados(selected.value?.id);
    showDialog.value = true;
  };

  const cambiarMetodoCorreo = async (idUsuario, idMetodo) => {
    if (!idMetodo) return;

    await administracionCorreoServices.configurarMetodoEnviocorreo(
      idUsuario,
      idMetodo
    );
    await obtenerConfiguracionUsuario(idUsuario);
    metodo_correo_seleccionado.value = null;
  };

  const reconfigurarMetodoAutenticacion = async (idUsuario, idMetodo) => {
    if (!idMetodo) return;

    await authServices.reconfigurarMetodo(
      idUsuario,
      idMetodo
    );
    await loadTableData(table, (params) => authServices.obtenerMetodosConfigurados(idUsuario, params));
    metodo_correo_seleccionado.value = null;
  };

  const eliminarMetodoConfigurado = async (idUsuario, idMetodo) => {
    if (!idMetodo) return;

    await authServices.eliminarMetodoConfigurado(idMetodo);
    await loadTableData(table, (params) => authServices.obtenerMetodosConfigurados(idUsuario, params));
    metodo_correo_seleccionado.value = null;
  };

  const openDialog = (item) => {
    selected.value = item || null;
    addEditDialog.value = true;
  }

  const openDialogActivateMethod = (item) => {
    metodo_correo_seleccionado.value = item;
    activateOrDeactivateModal.value = true;
  }

  const confirmModalDelete = (id) => {
    selected.value = { id: id };
    dialogo_confirmar.value = true;
  }

  const confirmModalDeleteMethod = (id) => {
    metodo_correo_seleccionado.value = id;
    deleteMethodModal.value = true;
  }

  const confirmarModalVerificar = (id) => {
    selected.value = { id: id };
    dialogo_verificar.value = true;
  }

  const confirmarModalRestablecer = (id) => {
    selected.value = { id: id };
    dialogo_reset.value = true;
  }

  const listarPerfiles = async () => {
    const { data } = await UsuarioServices.fetchPerfiles();
    perfiles.value = data;
  }

  const guardarUsuario = async (params) => {
    return await UsuarioServices.createUsuario(params);
  };

  const actualizarUsuario = async (id, params) => {
    return await UsuarioServices.updateUsuario(id, params);
  }

  const transform = (item) => ({
    id: item?.id,
    email: item?.email,
    id_coleccion_permiso: item?.id_coleccion_permiso,
    // perfiles: item?.Perfils?.map(pr => (pr.id)),
    id_comercio: item?.comercios?.map(pr => (pr.id)),
  });

  const cambiarEstadoUsuario = (item) => {
    id_usuario_temp.value = item.id;
    cambiar_estado.value = true;
  }

  const obtenerMenuDinamico = (item) => {
    const btns = [
      {
        boton: {
          variant: 'text',
          class: "mr-1",
          texto: 'Editar'
        },
        icono: {
          icon: 'mdi-pencil',
          size: "20",
          class: "mr-1",
        },
        disabled: false,
        callback: () => openDialog(item),
      },
    ];
    if (validarRoles(['ROLE_ADMIN'])) {
      btns.push(
        {
          boton: {
            variant: 'text',
            class: "mr-1",
            texto: 'Eliminar',
          },
          icono: {
            icon: 'mdi-delete',
            size: "20",
            class: "mr-1",
          },
          disabled: false,
          callback: () => confirmModalDelete(item.id),
        },
        {
          boton: {
            variant: 'text',
            class: "mr-1",
            texto: 'Cambiar estado',
          },
          icono: {
            icon: 'mdi-account-cog',
            size: "20",
            class: "mr-1",
          },
          disabled: false,
          callback: () => cambiarEstadoUsuario(item),
        },
        {
          boton: {
            variant: 'text',
            class: "mr-1",
            texto: 'Verificar',
          },
          icono: {
            icon: 'mdi-check-circle',
            size: "20",
            class: "mr-1",
          },
          disabled: item.verified,
          callback: () => confirmarModalVerificar(item.id),
        },
        {
          boton: {
            variant: 'text',
            class: "mr-1",
            texto: 'Configuración del usuario',
          },
          icono: {
            icon: 'mdi-shield-account',
            size: "20",
            class: "mr-1",
          },
          disabled: false,
          callback: () => configurarMetodoAutenticacion(item),
        },
        {
          boton: {
            variant: 'text',
            class: "mr-1",
            texto: 'Restablecer contraseña',
          },
          icono: {
            icon: 'mdi-lock-reset',
            size: "20",
            class: "mr-1",
          },
          disabled: false,
          callback: () => confirmarModalRestablecer(item.id),
        },
      )
    }

    return btns;
  }

  const obtenerMenuDinamicoMetodos = (item) => {
    const btns = [];

    if (!item.MetodoAutenticacionUsuario?.is_primary) {
      btns.push({
        boton: {
          variant: "text",
          class: "mr-1",
          texto: item.MetodoAutenticacionUsuario?.is_primary
            ? "Desactivar"
            : "Activar",
        },
        icono: {
          icon: item.MetodoAutenticacionUsuario?.is_primary
            ? "mdi-close"
            : "mdi-check-circle-outline",
          size: "20",
          class: "mr-1",
        },
        disabled: false,
        callback: () => openDialogActivateMethod(item.id),
      });
    }

    btns.push({
      boton: {
        variant: "text",
        class: "mr-1",
        texto: "Eliminar",
      },
      icono: {
        icon: "mdi-delete",
        size: "20",
        class: "mr-1",
      },
      disabled: !item.MetodoAutenticacionUsuario?.permite_eliminar,
      callback: () => confirmModalDeleteMethod(item?.MetodoAutenticacionUsuario?.id),
    });

    return btns;
  };

  const tabs = ref([
    {
      text: "Método de 2fa",
      value: "tab-1",
    },
    {
      text: "Método de correo",
      value: "tab-2",
    },
  ]);

  return {
    tabs,
    loading,
    paginate,
    usuarios,
    perfiles,
    table,
    search,
    selected,
    setData,
    addEditDialog,
    showDialog,
    dialogo_confirmar,
    dialogo_verificar,
    dialogo_reset,
    paginacion,
    cambiar_estado,
    id_usuario_temp,
    metodo_correo_seleccionado,
    activateOrDeactivateModal,
    deleteMethodModal,
    transform,
    openDialog,
    listarUsuarios,
    obtenerMenuDinamico,
    obtenerMenuDinamicoMetodos,
    listarPerfiles,
    guardarUsuario,
    actualizarUsuario,
    eliminarUsuario,
    verificarUsuario,
    resetPassword,
    cambiarMetodoCorreo,
    reconfigurarMetodoAutenticacion,
    eliminarMetodoConfigurado,
  }
}

export default useUsuarios;
