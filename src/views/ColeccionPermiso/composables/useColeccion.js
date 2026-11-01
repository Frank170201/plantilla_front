import coleccionServices from "@/services/coleccion.services";
import usuariosServices from "@/services/usuarios.services";

import { ref } from "vue";

const useColeccion = () => {
    const loading = ref(false);
    const paginate = ref({
        page: 1,
        items_per_page: 10,
        total_items: 0,
    });
    const colecciones = ref([]);
    const search = ref('');
    const listaPerfiles = ref([]);
    const listaRoles = ref([]);

    const transform = (item, tipo) => {
        switch (tipo) {
            case 'coleccion':
                return {
                    id: item?.id,
                    nombre: item?.nombre,
                    descripcion: item?.descripcion,
                };
            case 'perfil':
                return {
                    id_coleccion: item?.id,
                    id_perfiles: item?.perfiles?.map((perfil) => perfil.id_perfil) ?? [],
                };
            case 'rol':
                return {
                    id_coleccion: item?.id,
                    id_roles: item?.roles?.map((rol) => rol.id_rol) ?? [],
                };
            default:
                return item;
        }
    };

    const selected = ref(transform(null, ''));
    const permisoSeleccionado = ref(transform(null, ''));
    const addEditDialog = ref(false);
    const asignarPerfilModal = ref(false);
    const removerRolModal = ref(false);
    const dialogo_confirmar = ref(false);
    const paginacion = ref(true);

    const listarColeccion = async () => {
        let params = {
            page: paginate.value.page,
            per_page: paginate.value.items_per_page,
            busqueda: search.value,
            paginacion: paginacion.value
        };
        loading.value = true;
        const { data, headers } = await coleccionServices.obtenerConfiguracionColeccion(
            params
        );
        colecciones.value = data;
        paginate.value.total_items = Number(headers.total_rows);
        loading.value = false;
    }

    const openDialog = (item) => {
        selected.value = item || transform(null);
        addEditDialog.value = true;
    }

    const guardarConfiguracion = async (params) => {
        return await coleccionServices.crearConfiguracion(params);
    };

    const actualizarConfiguracion = async (id, params) => {
        return await coleccionServices.actualizarConfiguracion(id, params);
    }

    const eliminarConfiguracion = async (id) => {
        return await coleccionServices.borrarConfiguracion(id);
    }
    const asignarPerfil = async (id, params) => {
        return await coleccionServices.asignarPerfil(id, params);
    }
    const removerRol = async (id, params) => {
        return await coleccionServices.removerRol(id, params);
    }
    const listarPerfiles = async () => {
        const { data } = await usuariosServices.fetchPerfiles();
        listaPerfiles.value = data;
    }

    const listarRoles = async () => {
        const { data } = await coleccionServices.obtenerRoles();
        listaRoles.value = data;
    }

    const confirmModalDelete = (id) => {
        selected.value = { id: id };
        dialogo_confirmar.value = true;
    }
    const abrirModalPerfil = (coleccion) => {
        permisoSeleccionado.value = { ...coleccion };
        asignarPerfilModal.value = true;
    }
    const abrirModalRol = (coleccion) => {
        permisoSeleccionado.value = { ...coleccion };
        removerRolModal.value = true;
    }

    const obtenerMenuDinamico = (item) => {
        const btns = [
            {
                boton: {
                    variant: 'text',
                    class: "mr-1",
                    texto: 'Agregar perfil',
                },
                icono: {
                    icon: 'mdi-content-save-cog-outline',
                    size: "20",
                    class: "mr-1",
                },
                disabled: false,
                callback: () => abrirModalPerfil(item),
            },
            {
                boton: {
                    variant: 'text',
                    class: "mr-1",
                    texto: 'Remover rol',
                },
                icono: {
                    icon: 'mdi-cog-off-outline',
                    size: "20",
                    class: "mr-1",
                },
                disabled: false,
                callback: () => abrirModalRol(item),
            },
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
            }
        ];

        return btns;
    }

    return {
        loading,
        paginate,
        colecciones,
        listaPerfiles,
        listaRoles,
        search,
        selected,
        permisoSeleccionado,
        addEditDialog,
        dialogo_confirmar,
        paginacion,
        asignarPerfilModal,
        removerRolModal,
        transform,
        openDialog,
        obtenerMenuDinamico,
        guardarConfiguracion,
        actualizarConfiguracion,
        eliminarConfiguracion,
        asignarPerfil,
        removerRol,
        listarColeccion,
        listarPerfiles,
        listarRoles
    };
}

export default useColeccion;