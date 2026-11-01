import FaqServices from "@/services/faq.services";
import { useAuthStore } from "@/store/auth";

import { ref } from "vue";

const selected = ref(null);

export default function useFAQ() {
  const { user } = useAuthStore();
  const loading = ref(false);
  const paginate = ref({
    page: 1,
    items_per_page: 10,
    total_items: 0,
  });
  const faq = ref([]);
  const search = ref("");
  const paginacion = ref(true);
  const transform = (item) => ({
    id: item?.id || "",
    pregunta: item?.pregunta || "",
    respuesta: item?.respuestaPlana || "",
    activo: item?.activo ?? true,
  });
  const addEditDialog = ref(false);
  const dialogo_confirmar = ref(false);

  const listarFAQ = async () => {
    let params = {
      page: paginate.value.page,
      per_page: paginate.value.items_per_page,
      busqueda: search.value,
      paginacion: paginacion.value,
    };
    loading.value = true;
    const { data, headers } = await FaqServices.listarFAQ(params);
    faq.value = data;
    paginate.value.total_items = Number(headers.total_rows);
    loading.value = false;
  };

  const openDialog = (item) => {
    selected.value = item ? transform({ ...item }) : transform(null);
    addEditDialog.value = true;
  };

  const guardarFAQ = async (body) => {
    return await FaqServices.crearFAQ(body);
  };

  const actualizarFAQ = async (id, body) => {
    return await FaqServices.actualizarFAQ(id, body);
  };

  const confirmModalDelete = (id) => {
    selected.value = transform({ id });
    dialogo_confirmar.value = true;
  };

  const eliminarFAQ = async (id) => {
    return await FaqServices.eliminarFAQ(id);
  };

  const obtenerMenuDinamico = (item) => {
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
        disabled: false,
        callback: () => openDialog(item),
      },
    ];

    if (user.is_admin) {
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
        disabled: false,
        callback: () => confirmModalDelete(item.id),
      });
    }

    return btns;
  };

  return {
    loading,
    paginate,
    faq,
    search,
    paginacion,
    selected,
    addEditDialog,
    dialogo_confirmar,
    transform,
    openDialog,
    listarFAQ,
    guardarFAQ,
    actualizarFAQ,
    obtenerMenuDinamico,
    eliminarFAQ,
  };
}
