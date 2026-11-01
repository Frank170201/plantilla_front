import { computed, ref } from "vue";
import useVuelidate from "@vuelidate/core";
import { createReloadTable, createTableConfig, loadTableData } from "@/utils/tableConfig";
import { helpers, required } from "@vuelidate/validators";
import solicitudcontactoServices from "@/services/solicitudcontacto.services";
import { convertToFormData, limpiarTexto } from "@/utils/data";
import ticketsServices from "@/services/tickets.services";
import formulariosServices from "@/services/formularios.services";
import dayjs from "dayjs";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";
import { debounce } from "lodash";
import useColecturia from "@/views/colecturia/composables/useColecturia";

const useServiceDesk = () => {
  const { comercios, cargarComercios } = useColecturia();
  const { user, validarRoles } = useAuthStore();
  const router = useRouter();

  const search = ref("");

  // Estados principales
  const showDialog = ref(false);
  const tipoSolicitudes = ref([]);
  const agentes = ref([]);
  const ticket = ref(null);
  const historial = ref([]);
  
  // Estados para comentarios
  const showPhotoUpload = ref(false);
  const photoUploadKey = ref(0);
  const marcarComoSolucion = ref(false);
  const agenteId = ref(null);

  // Previsualización de archivos
  const adjuntoDataUrl = ref(null);
  const dialogPreviewPdf = ref(false);
  const dialogPreviewImagen = ref(false);

  // Usuario
  const usuarioActual = ref(user)

  // Formularios
  const form = ref({
    asunto: "",
    tipo: null,
    comercio: null,
    descripcion: "",
    selectedFiles: [],
  });

  const commentForm = ref({
    descripcion: "",
    selectedFiles: [],
  });

  // Configuración de tabla
  const baseHeaders = [
    {
      align: "center",
      title: "ID",
      key: "id",
      sortable: false,
      value: (item) => `#${item.id}`,
    },
    {
      align: "center",
      title: "Solicitud",
      key: "asunto",
      sortable: false,
    },
    {
      align: "center",
      title: "Estado",
      key: "estado",
      sortable: false,
    },
    {
      align: "center",
      title: "Comercio",
      key: "comercio.nombre",
      sortable: false,
    },
    {
      align: "center",
      title: "Cliente",
      key: "cliente",
      sortable: false,
      value: (item) => item?.cliente?.email ? limpiarTexto(item?.cliente?.email) : "No asignado",
    },
    {
      align: "center",
      title: "Agente asignado",
      key: "agente",
      sortable: false,
      value: (item) => item?.agente?.email ? limpiarTexto(item?.agente?.email) : "No asignado",
    },
    {
      align: "center",
      title: "Fecha de creación",
      key: "created_at",
      sortable: false,
      value: (item) => dayjs(item.created_at).format("DD/MM/YYYY hh:mm a"),
    },
    {
      align: "center",
      title: "Fecha de actualización",
      key: "updated_at",
      sortable: false,
      value: (item) => dayjs(item.updated_at).format("DD/MM/YYYY hh:mm a"),
    },
  ];

  const tableConfig = ref(createTableConfig({ baseHeaders }));

  // Validaciones
  const rules = computed(() => ({
    asunto: {
      required: helpers.withMessage("Este campo es requerido", required),
    },
    tipo: {
      required: helpers.withMessage("Este campo es requerido", required),
    },
    comercio: {
      required: helpers.withMessage("Este campo es requerido", required),
    },
    descripcion: {
      required: helpers.withMessage("Este campo es requerido", required),
    },
  }));

  const $vProperty = useVuelidate(rules, form);

  // Computeds
  const puedeResponder = computed(() => {
    const usuarioActual = user;
    return (
      (ticket.value?.cliente && usuarioActual?.id === ticket.value.cliente.id) ||
      (ticket.value?.agente && usuarioActual?.id === ticket.value.agente.id)
    );
  });

  const isEmptyDescripcion = computed(() => {
    if (!commentForm.value.descripcion) return true;
    const text = commentForm.value.descripcion
      .replace(/<(.|\n)*?>/g, "") // quitar etiquetas HTML
      .trim();
    return text.length === 0;
  });

  // Métodos de utilidad para archivos
  const getFileExtension = (filename) => {
    if (!filename) return "";
    const parts = filename.split(".");
    return parts.length > 1 ? parts[parts.length - 1] : "";
  };

  const getFileIcon = (extension) => {
    const icons = {
      pdf: "mdi-file-pdf-box",
      doc: "mdi-file-word-box",
      docx: "mdi-file-word-box",
      xls: "mdi-file-excel-box",
      xlsx: "mdi-file-excel-box",
      ppt: "mdi-file-powerpoint-box",
      pptx: "mdi-file-powerpoint-box",
      odt: "mdi-file-document",
      ods: "mdi-file-table",
      odp: "mdi-file-presentation-box",
      jpg: "mdi-file-image",
      jpeg: "mdi-file-image",
      png: "mdi-file-image",
    };
    return icons[extension?.toLowerCase()] || "mdi-file";
  };

  const esAgente = (usuario) => {
    if (!usuario) return false;
    return ticket.value?.agente && usuario.id === ticket.value.agente.id;
  };

  // Métodos de navegación
  const clickColumn = async (item) => {
    router.push(`/atencion-usuario/ticket/${item.id}`);
  };

  // Métodos de validación
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

  // Métodos de limpieza
  const limpiarFormulario = () => {
    // Limpiar URLs de archivos
    form.value.selectedFiles.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });

    // Resetear formulario
    form.value.asunto = "";
    form.value.tipo = null;
    form.value.comercio = null;
    form.value.descripcion = "";
    form.value.selectedFiles = [];

    // Resetear validaciones
    $vProperty.value.$reset();
  };

  const limpiarComentarioFormulario = () => {
    // Limpiar URLs de archivos
    commentForm.value.selectedFiles.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });

    commentForm.value.descripcion = "";
    commentForm.value.selectedFiles = [];
    marcarComoSolucion.value = false;
    showPhotoUpload.value = false;
    photoUploadKey.value++;
  };

  // Métodos de diálogo
  const openDialog = () => {
    showDialog.value = true;
  };

  const closeDialog = () => {
    limpiarFormulario();
    showDialog.value = false;
  };

  // Métodos de archivos
  const onFilesSelected = (files) => {
    // Limpiar URLs anteriores
    form.value.selectedFiles.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });

    // Crear nuevas URLs para los archivos
    form.value.selectedFiles = files.map((file) => {
      if (!file.preview) {
        file.preview = URL.createObjectURL(file);
      }
      return file;
    });
  };

  const onCommentFilesSelected = (files) => {
    // Limpiar URLs anteriores
    commentForm.value.selectedFiles.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });

    // Crear nuevas URLs para los archivos
    commentForm.value.selectedFiles = files.map((file) => {
      if (!file.preview) {
        file.preview = URL.createObjectURL(file);
      }
      return file;
    });
  };

  const togglePhotoUpload = () => {
    showPhotoUpload.value = !showPhotoUpload.value;
  };

  const descargarArchivo = async (archivo) => {
    const { data, headers } = await formulariosServices.obtenerAdjunto(archivo.adjunto);

    const blob = new Blob([data], {
        type: headers["content-type"] || "application/pdf",
      });

    if (/image\/.*/ig.test(headers['content-type'])) {
      adjuntoDataUrl.value = URL.createObjectURL(blob);
      dialogPreviewImagen.value = true;
      return;
    }

    if (headers['content-type'].includes('pdf')) {
      adjuntoDataUrl.value = URL.createObjectURL(blob);
      dialogPreviewPdf.value = true;
      return;
    }
    
    const url = URL.createObjectURL(blob);
    const filename = archivo.nombre_archivo;

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  };

  // Métodos de API - Obtención de datos
  const obtenerTipos = async () => {
    const { data } = await solicitudcontactoServices.obtenerTipoSolicitud();
    tipoSolicitudes.value = data;
  };

  const obtenerAgentes = async () => {
    const { data } = await ticketsServices.consultarAgentes();
    agentes.value = data;
  };

  const obtenerDetalleTicket = async (id) => {
    const { data } = await ticketsServices.obtenerDetalleTicket(id);
    ticket.value = data;
  };

  const obtenerHistorialTicket = async (id) => {
    const { data } = await ticketsServices.historialTicket(id);
    historial.value = data;
  };

  const cargarSolicitudes = async () => {
    let params = {
      ...(search.value && { busqueda: search.value }),
    }
    await loadTableData(tableConfig, ticketsServices.obtenerSolicitudes, params);
  };

  const obtenerListadoTickets = async () => {
    let params = {
      ...(search.value && { busqueda: search.value }),
    }
    await loadTableData(tableConfig, ticketsServices.obtenerListadoTickets, params);
  };

  // Métodos de API - Acciones
  const crearSolicitud = async () => {
    const values = {
      asunto: form.value.asunto,
      id_tipo: form.value.tipo,
      id_comercio: form.value.comercio,
      descripcion: form.value.descripcion,
      archivos: form.value.selectedFiles,
    };

    const formData = convertToFormData(values);

    await ticketsServices.crearSolicitud(formData).then((res) => {
      if (res.status === 201) {
        limpiarFormulario();
        showDialog.value = false;
        cargarSolicitudes();
      }
    });
  };

  const crearComentario = async (ticketId) => {
    const values = {
      ...(marcarComoSolucion.value && { esSolucion: marcarComoSolucion.value }),
      comentario: commentForm.value.descripcion,
      archivos: commentForm.value.selectedFiles,
    };

    const formData = convertToFormData(values);
    await ticketsServices.crearComentario(formData, ticketId);

    // Limpiar formulario
    limpiarComentarioFormulario();

    // Recargar datos
    await Promise.all([
      obtenerDetalleTicket(ticketId),
      obtenerHistorialTicket(ticketId)
    ]);
  };

  const confirmarSolucionTicket = async (ticketId, aceptada) => {
    await ticketsServices.confirmarSolucion(ticketId, { aceptada });
    // Recargar los datos
    await Promise.all([
      obtenerDetalleTicket(ticketId),
      obtenerHistorialTicket(ticketId)
    ]);
  };

  const marcarComentarioComoSolucion = async (ticketId, comentarioId, esSolucion) => {
    try {
      await ticketsServices.marcarComentarioComoSolucion(
        ticketId,
        comentarioId,
        { esSolucion }
      );
      // Recargar datos
      await Promise.all([
        obtenerDetalleTicket(ticketId),
        obtenerHistorialTicket(ticketId)
      ]);
    } catch (error) {
      console.error("Error al marcar como solución:", error);
      throw error;
    }
  };

  const asignarAgente = async (ticketId) => {
    await ticketsServices.asignarAgente(ticketId, { id_agente: agenteId.value });

    // Recargar datos
    await Promise.all([
      obtenerDetalleTicket(ticketId),
      obtenerHistorialTicket(ticketId)
    ]);
    
    // Limpiar el campo de agente
    agenteId.value = null;
  };

  const reloadTable = createReloadTable(tableConfig, cargarSolicitudes);
  const reloadListadoTickets = createReloadTable(tableConfig, obtenerListadoTickets);

  const debounceSearch = debounce(obtenerListadoTickets, 1000);
    
  const filter = () => {
    debounceSearch();
  };

  return {
    usuarioActual,
    search,
    ticket,
    historial,
    agentes,
    router,
    showDialog,
    form,
    commentForm,
    tableConfig,
    tipoSolicitudes,
    $vProperty,
    showPhotoUpload,
    photoUploadKey,
    marcarComoSolucion,
    agenteId,
    comercios,
    puedeResponder,
    isEmptyDescripcion,
    adjuntoDataUrl,
    dialogPreviewPdf,
    dialogPreviewImagen,
    getFileExtension,
    getFileIcon,
    esAgente,
    validarRoles,
    clickColumn,
    validarPropiedades,
    openDialog,
    closeDialog,
    togglePhotoUpload,
    limpiarFormulario,
    limpiarComentarioFormulario,
    onFilesSelected,
    onCommentFilesSelected,
    descargarArchivo,
    obtenerTipos,
    obtenerAgentes,
    obtenerDetalleTicket,
    obtenerHistorialTicket,
    cargarSolicitudes,
    obtenerListadoTickets,
    crearSolicitud,
    crearComentario,
    confirmarSolucionTicket,
    marcarComentarioComoSolucion,
    asignarAgente,
    reloadTable,
    reloadListadoTickets,
    filter,
    cargarComercios,
  };
};

export default useServiceDesk;