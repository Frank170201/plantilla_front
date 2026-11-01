import ServiciosServices from "@/services/servicios.services";
import { useAuthStore } from "@/store/auth";

import { ref } from "vue";

const useComercios = () => {
    const { user, validarRoles } = useAuthStore();
    const loading = ref(false);
    const paginate = ref({
        page: 1,
        items_per_page: 10,
        total_items: 0,
    });
    const servicios = ref([]);
    const search = ref('');

    const transform = (item) => ({
        id: item?.id,
        nombre: item?.nombre,
        icono: item?.icono,
        color: item?.color,
        color_texto: item?.color_texto,
    });

    const selected = ref(transform(null));
    const addEditDialog = ref(false);
    const dialogo_confirmar = ref(false);
    const paginacion = ref(true);
    const colorModal = ref(false);
    const textColorModal = ref(false);

    const listarServicios = async () => {
        let params = {
            page: paginate.value.page,
            per_page: paginate.value.items_per_page,
            busqueda: search.value,
            paginacion: paginacion.value
        };
        loading.value = true;
        const { data, headers } = await ServiciosServices.fetchServicios(
            params
        );
        servicios.value = data;
        paginate.value.total_items = Number(headers.total_rows);
        loading.value = false;
    }

    const listarServiciosLocales = async (id_local) => {
        let params = {
            page: paginate.value.page,
            per_page: paginate.value.items_per_page,
            busqueda: search.value
        };
        loading.value = true;
        const { data, headers } = await ServiciosServices.fetchServiciosPorLocal(
            id_local,
            params
        );
        servicios.value = data;
        paginate.value.total_items = Number(headers.total_rows);
        loading.value = false;
    }

    const openDialog = (item) => {
        selected.value = item || transform(null);
        addEditDialog.value = true;
    }
    
    const guardarServicio = async (params) => {
        return await ServiciosServices.createServicio(params);
    };

    const actualizarServicio = async (id, params) => {
        return await ServiciosServices.updateServicio(id, params);
    }

    const eliminarServicio = async (id) => {
        return await ServiciosServices.deleteServicio(id);
    }

    const confirmModalDelete = (id) => {
        selected.value = { id: id };
        dialogo_confirmar.value = true;
    }

    const guardarServicioLocal = async (id, params) => {
        return await ServiciosServices.createServicioLocal(id, params);
    };

    const actualizarServicioLocal = async (id, params) => {
        return await ServiciosServices.updateServicioLocal(id, params);
    }

    const eliminarServicioLocal = async (id) => {
        return await ServiciosServices.deleteServicioLocal(id);
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

        if (user.is_adminvalid || validarRoles(['ROLE_ELIMINAR_SERVICIOS_LOCALES'])) {
            btns.push({
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
            })
        }

        return btns;
    }

    return {
        loading,
        paginate,
        servicios,
        search,
        selected,
        addEditDialog,
        dialogo_confirmar,
        paginacion,
        colorModal,
        textColorModal,
        transform,
        openDialog,
        obtenerMenuDinamico,
        listarServicios,
        guardarServicio,
        actualizarServicio,
        eliminarServicio,
        listarServiciosLocales,
        guardarServicioLocal,
        actualizarServicioLocal,
        eliminarServicioLocal,
    };
}

export default useComercios;