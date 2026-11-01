import { computed, ref } from "vue";
import { helpers, maxLength, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import {
  createReloadTable,
  createTableConfig,
  loadTableData,
} from "@/utils/tableConfig";
import asuetoServices from "@/services/asueto.services";
import useNoti from "@/composables/useNoti";
import dayjs from "dayjs";
import 'dayjs/locale/es'
import { capitalizar } from "@/utils/data";

const { notify } = useNoti();

const useAsueto = () => {
  const loading = ref(false);
  const confirmDialog = ref(false);
  const confirmModal = ref({
    modal: false,
    title: "",
    callback: null,
    description: "",
    onConfirmAction: null,
  });
  const showDialog = ref(false);
  const dialogType = ref("");
  const isEditing = ref(false);
  const editingId = ref(null);

  const formAsueto = ref({
    fecha: null,
    descripcion: null,
  });

  const formHorario = ref({
    selectedDay: null,
    startTime: null,
    endTime: null,
  });

  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "P.M." : "A.M.";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const tabs = ref([
    {
      text: "Días de asueto",
      value: "tab-0",
      icon: "mdi-calendar-remove",
    },
    {
      text: "Horario laboral semanal",
      value: "tab-1",
      icon: "mdi-briefcase-clock",
    },
  ]);

  // Headers con acciones de editar y eliminar
  const diasAsueto = [
    {
      title: "Fecha",
      key: "fecha",
      align: "center",
      sortable: false,
      value: (item) => capitalizar(dayjs(item.fecha).locale("es").format("dddd D [de] MMMM [de] YYYY")),
    },
    {
      title: "Descripción",
      key: "descripcion",
      align: "center",
      sortable: false,
    },
    { 
      title: "Acciones", 
      key: "acciones", 
      align: "center", 
      sortable: false,
    },
  ];

  const diasHabiles = [
    { title: "Día", key: "dia", align: "center", sortable: false },
    {
      title: "Hora de entrada",
      key: "hora_inicio",
      align: "center",
      sortable: false,
      value: (item) => formatTime(item.hora_inicio),
    },
    {
      title: "Hora de salida",
      key: "hora_fin",
      align: "center",
      sortable: false,
      value: (item) => formatTime(item.hora_fin),
    },
    {
      title: "Acciones",
      key: "acciones",
      align: "center",
      sortable: false,
    },
  ];

  const accionesDiasHabiles = (item) => {
    const btns = [
      {
        boton: {
          variant: "text",
          class: "mr-1",
          texto: "Editar",
        },
        icono: {
          icon: "mdi-pencil",
          size: "20",
          class: "mr-1",
        },
        callback: () => editHorario(item),
      },
      {
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
        callback: () => eliminarHorario(item),
      },
    ];

    return btns;
  };

  const accionesDiasAsueto = (item) => {
    const btns = [
      {
        boton: {
          variant: "text",
          class: "mr-1",
          texto: "Editar",
        },
        icono: {
          icon: "mdi-pencil",
          size: "20",
          class: "mr-1",
        },
        callback: () => editAsueto(item),
      },
      {
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
        callback: () => eliminarAsueto(item),
      },
    ];

    return btns;
  };

  const tableConfigDiasAsueto = ref(
    createTableConfig({ baseHeaders: diasAsueto })
  );
  const tableConfigDiasHabiles = ref(
    createTableConfig({ baseHeaders: diasHabiles })
  );

  // Validaciones (sin cambios)
  const rulesAsueto = computed(() => ({
    fecha: {
      required: helpers.withMessage("La fecha es requerida", required),
    },
    descripcion: {
      required: helpers.withMessage("La descripción es requerida", required),
      maxLength: helpers.withMessage("La descripción no debe exceder los 255 carácteres", maxLength(255)),
    },
  }));

  const rulesHorario = computed(() => ({
    selectedDay: {
      required: helpers.withMessage("El día es requerido", required),
    },
    startTime: {
      required: helpers.withMessage("La hora de entrada es requerida", required),
    },
    endTime: {
      required: helpers.withMessage("La hora de salida es requerida", required),
    },
  }));

  const $vFormAsueto = useVuelidate(rulesAsueto, formAsueto);
  const $vFormHorario = useVuelidate(rulesHorario, formHorario);

  const currentForm = computed(() => {
    return dialogType.value === "asueto"
      ? formAsueto.value
      : {
          dia: formHorario.value.selectedDay,
          entrada: formHorario.value.startTime,
          salida: formHorario.value.endTime,
        };
  });

  const currentValidation = computed(() => {
    return dialogType.value === "asueto"
      ? $vFormAsueto.value
      : $vFormHorario.value;
  });

  // Título dinámico basado en si es creación o edición
  const dialogTitle = computed(() => {
    if (dialogType.value === "asueto") {
      return isEditing.value ? "Editar Día de Asueto" : "Agregar Día de Asueto";
    } else {
      return isEditing.value ? "Editar Horario de Atención" : "Configurar Horario de Atención";
    }
  });

  const loadAsuetos = async () => {
    await loadTableData(tableConfigDiasAsueto, asuetoServices.listarAsuetos);
  };

  const loadDiasLaborales = async () => {
    await loadTableData(
      tableConfigDiasHabiles,
      asuetoServices.listarDiasLaborales
    );
  };

  const reloadAsuetos = createReloadTable(tableConfigDiasAsueto, loadAsuetos);
  const reloadDiasLaborales = createReloadTable(
    tableConfigDiasHabiles,
    loadDiasLaborales
  );

  // Funciones para crear (sin cambios)
  const openDialogAsueto = () => {
    isEditing.value = false;
    editingId.value = null;
    dialogType.value = "asueto";
    showDialog.value = true;
  };

  const openDialogHorario = () => {
    isEditing.value = false;
    editingId.value = null;
    dialogType.value = "horario";
    showDialog.value = true;
  };

  // NUEVAS FUNCIONES PARA EDICIÓN
  const editAsueto = (item) => {
    isEditing.value = true;
    editingId.value = item.id;
    dialogType.value = "asueto";
    
    // Cargar datos en el formulario
    formAsueto.value = {
      fecha: dayjs(item.fecha).toDate(),
      descripcion: item.descripcion,
    };
    
    showDialog.value = true;
  };

  const editHorario = (item) => {
    isEditing.value = true;
    editingId.value = item.id;
    dialogType.value = "horario";
    
    // Cargar datos en el formulario
    formHorario.value = {
      selectedDay: item.dia,
      startTime: item.hora_inicio,
      endTime: item.hora_fin,
    };
    
    showDialog.value = true;
  };

  // FUNCIONES PARA ELIMINAR

  const eliminarAsueto = (item) => {
    confirmDialog.value = true;
    confirmModal.value = {
      modal: true,
      title: "¿Eliminar día de asueto?",
      description: `¿Está seguro que desea eliminar este día de asueto? Esta acción no se puede deshacer.`,
      callback: () => asuetoServices.eliminarAsueto(item.id),
      onConfirmAction: () => loadAsuetos(),
    };
  };

  const eliminarHorario = (item) => {
    confirmDialog.value = true;
    confirmModal.value = {
      modal: true,
      title: "¿Eliminar horario de atención?",
      description: `¿Está seguro que desea eliminar el horario de atención del ${item.dia}? Esta acción no se puede deshacer.`,
      callback: () => asuetoServices.eliminarDiaLaboral(item.id),
      onConfirmAction: () => loadDiasLaborales(),
    };
  };

  const closeDialog = () => {
    showDialog.value = false;
    isEditing.value = false;
    editingId.value = null;
    resetForms();
  };

  const resetForms = () => {
    formAsueto.value = {
      fecha: null,
      descripcion: null,
    };
    formHorario.value = {
      selectedDay: null,
      startTime: null,
      endTime: null,
    };
    $vFormAsueto.value.$reset();
    $vFormHorario.value.$reset();
  };

  const validarPropiedades = (campo, placeholder) => {
    if (!campo) return { placeholder };
    const errores = campo.$errors?.map((e) => e.$message) ?? [];
    return {
      placeholder,
      onInput: campo.$touch,
      onBlur: campo.$touch,
      "error-messages": errores,
    };
  };

  // FUNCIÓN handleSave MODIFICADA PARA SOPORTAR EDICIÓN
  const handleSave = async () => {
    const validation = currentValidation.value;
    validation.$touch();

    if (validation.$invalid) {
      notify("Por favor, complete los campos requeridos", "error");
      return;
    }

    try {
      const datos = { ...currentForm.value };

      if (dialogType.value === "asueto") {
        if (isEditing.value) {
          // Actualizar asueto existente
          await asuetoServices.actualizarAsueto(editingId.value, datos).then((response) => {
            if (response.status === 200) {
                notify(response.data, "success");
            }
          });
        } else {
          // Crear nuevo asueto
          await asuetoServices.crearAsueto(datos);
        }
        await loadAsuetos();
      } else {
        if (isEditing.value) {
          // Actualizar horario existente
          await asuetoServices.actualizarDiaLaboral(editingId.value, datos).then((response) => {
            if (response.status === 200) {
                notify(response.data, "success");
            }
          });
        } else {
          // Crear nuevo horario
          await asuetoServices.crearDiaLaboral(datos);
        }
        await loadDiasLaborales();
      }

      closeDialog();
    } catch (error) {
      const action = isEditing.value ? "actualizar" : "guardar";
      const tipo = dialogType.value === "asueto" ? "día de asueto" : "día laboral";
      notify(`Error al ${action} ${tipo}`, "error");
    }
  };

  return {
    loading,
    tabs,
    showDialog,
    confirmDialog,
    confirmModal,
    dialogType,
    formAsueto,
    formHorario,
    tableConfigDiasAsueto,
    tableConfigDiasHabiles,
    reloadAsuetos,
    reloadDiasLaborales,
    loadDiasLaborales,
    openDialogAsueto,
    openDialogHorario,
    accionesDiasHabiles,
    accionesDiasAsueto,
    closeDialog,
    $vFormAsueto,
    $vFormHorario,
    validarPropiedades,
    currentForm,
    currentValidation,
    dialogTitle,
    handleSave,
    resetForms,
  };
};

export default useAsueto;