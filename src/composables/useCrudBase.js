import { debounce } from "lodash";
import { computed, ref } from "vue";

/**
 * Factory para crear composables CRUD con estado singleton
 * @param {Object} config - Configuración del CRUD
 * @param {Object} config.refs - Referencias reactivas (items, formData, openModal, paginate, filters)
 * @param {Object} config.service - Servicio con métodos listar, crear, editar, softDelete
 * @param {Object} config.initialFormState - Estado inicial del formulario
 * @param {Function} config.validationRules - Función que retorna las reglas de validación
 * @returns {Object} - Funciones y estados compartidos
 */
export const useCrudBase = (config) => {
    const { refs, service, initialFormState, validationRules } = config;
    const { items, formData, openModal, paginate, filters } = refs;

    // Estado para el diálogo de confirmación
    const showDialogConfirm = ref(false);
    const dialogConfig = ref({
        title: '',
        descripcion: '',
        icon: 'mdi-alert-circle-outline',
        color_icon: 'warningDinac',
        pendingId: null,
        actionType: null, // 'softDelete' | 'delete'
    });
    const ejecutandoConfirmacion = ref(false);

    // Computed
    const totalPaginas = computed(() => {
        return Math.ceil(paginate.value.total_items / paginate.value.items_per_page);
    });

    // Validación (si se proporciona)
    const $vForm = validationRules ? validationRules(formData) : null;

    // Métodos genéricos
    const listar = async (useParams = true) => {
        const params = useParams 
        ? {
            page: paginate.value.page,
            per_page: paginate.value.items_per_page,
            ...filters.value,
        }
        : {};

        const { data, headers } = await service.listar(params);
        items.value = data;
        paginate.value.total_items = headers.total_rows;
    };

    const recargarTabla = ({ page, itemsPerPage }) => {
        paginate.value.page = page;
        paginate.value.items_per_page = itemsPerPage;
        listar();
    };

    const filterWithDelay = debounce(() => {
        recargarTabla({ page: 1, itemsPerPage: paginate.value.items_per_page });
    }, 500);

    const handleOpenModal = (item = null) => {
        if (item) {
            formData.value = { ...item };
        } else {
            formData.value = { ...initialFormState };
        }
        openModal.value = true;
    };

    const handleCloseModal = () => {
        openModal.value = false;
        formData.value = { ...initialFormState };
        if ($vForm) $vForm.value.$reset();
    };

    const handleSubmit = async () => {
        if ($vForm) {
            $vForm.value.$touch();
            if ($vForm.value.$invalid) return;
        }

        try {
            if (formData.value.id) {
                await service.editar(formData.value.id, formData.value);
            } else {
                await service.crear(formData.value);
            }

            handleCloseModal();
            recargarTabla({ page: paginate.value.page, itemsPerPage: paginate.value.items_per_page });
        } catch (error) {
            console.error('Error al guardar:', error);
            throw error;
        }
    };

    const softDelete = async (id) => {
        try {
            await service.softDelete(id);
            recargarTabla({ page: paginate.value.page, itemsPerPage: paginate.value.items_per_page });
        } catch (error) {
            console.error('Error al cambiar estado:', error);
            throw error;
        }
    };

    const confirmSoftDelete = (id) => {
        dialogConfig.value = {
            title: '¿Estás seguro?',
            descripcion: 'Esta acción cambiará el estado del registro.',
            icon: 'mdi-alert-circle-outline',
            color_icon: 'warningDinac',
            pendingId: id,
            actionType: 'softDelete',
        };
        showDialogConfirm.value = true;
    };

    const deleteData = async (id) => {
        try {
            await service.deleteData(id);
            recargarTabla({ page: paginate.value.page, itemsPerPage: paginate.value.items_per_page });
        } catch (error) {
            console.error('Error al cambiar estado:', error);
            throw error;
        }
    };

    const confirmDelete = (id) => {
        dialogConfig.value = {
            title: '¿Estás seguro?',
            descripcion: 'Esta acción eliminará el registro.',
            icon: 'mdi-delete-outline',
            color_icon: 'error',
            pendingId: id,
            actionType: 'delete',
        };
        showDialogConfirm.value = true;
    };

    const onDialogConfirm = async () => {
        const { pendingId, actionType } = dialogConfig.value;
        ejecutandoConfirmacion.value = true;
        try {
            if (actionType === 'softDelete') {
                await softDelete(pendingId);
            } else if (actionType === 'delete') {
                await deleteData(pendingId);
            }
        } finally {
            ejecutandoConfirmacion.value = false;
            showDialogConfirm.value = false;
        }
    };

    const onDialogCancel = () => {
        showDialogConfirm.value = false;
    };

    return {
        // Estado
        items,
        formData,
        openModal,
        paginate,
        filters,

        // Estado del diálogo de confirmación
        showDialogConfirm,
        dialogConfig,
        ejecutandoConfirmacion,

        // Computed
        totalPaginas,

        // Validación
        $vForm,

        // Métodos
        listar,
        recargarTabla,
        filterWithDelay,
        handleOpenModal,
        handleCloseModal,
        handleSubmit,
        softDelete,
        confirmSoftDelete,
        confirmDelete,
        onDialogConfirm,
        onDialogCancel,
    };
};
