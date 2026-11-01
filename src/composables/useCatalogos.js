import catalogosServices from "@/services/catalogos.services";
import usuariosServices from "@/services/usuarios.services";
import { ref } from "vue";

const useCatalogos = () => {
  const generos = ref([]);
  const tipoPersonas = ref([]);
  const tipoDocs = ref([]);
  const ctlLogPagos = ref([]);
  const catalogoCategorias =  ref([]);
  const catalogoEstados =  ref([]);
  const catalogoTipoDTE = ref([]);
  const catalogoEstablecimientos = ref([]);

  const listarGeneros = async () => {
    const { data } = await catalogosServices.fetchGeneros();
    generos.value = data;
  }

  const listarTipoPersonas = async () => {
    const { data } = await catalogosServices.fetchTipoPersona();
    tipoPersonas.value = data;
  }

  const listarTipoDocs = async () => {
    const { data } = await catalogosServices.fetchTipoDoc();
    tipoDocs.value = data;
  }

  const listarUsuarios = async (params) => {
    return await usuariosServices.fetchUsuarios(params);
  }

  const listarCtlLogPagos = async () => {
    const { data } = await catalogosServices.fetchCtlLogPagos();
    ctlLogPagos.value = data;
  }
  
  const listarTipoPersonasPublico = async () => {
    const { data } = await catalogosServices.fetchTipoPersonaPublica();
    tipoPersonas.value = data;
  }
  
  const listarCategorias = async () => {
    const { data } = await catalogosServices.fetchCategoriasAnuncios();
    catalogoCategorias.value = data;
  }

  const listarEstados = async () => {
    const { data } = await catalogosServices.getEstadosSolicitud();
    catalogoEstados.value = data;
  }

  const obtenerTipoDTE = async (params) => {
    const { data } = await catalogosServices.fetchTipoDTE(params);

    const addLabel = data.map((item) => ({
      ...item,
      nombre: `${item.codigo} - ${item.nombre}`,
    }));

    catalogoTipoDTE.value = addLabel;
  }

  const obtenerTipoEstablecimiento = async () => {
    const { data } = await catalogosServices.fetchTipoEstablecimiento();
    catalogoEstablecimientos.value = data;
  }

  return {
    tipoDocs,
    tipoPersonas,
    generos,
    ctlLogPagos,
    catalogoCategorias,
    catalogoEstados,
    catalogoTipoDTE,
    catalogoEstablecimientos,
    listarGeneros,
    listarUsuarios,
    listarTipoPersonas,
    listarTipoDocs,
    listarCtlLogPagos,
    listarTipoPersonasPublico,
    listarCategorias,
    listarEstados,
    obtenerTipoDTE,
    obtenerTipoEstablecimiento,
  }
}

export default useCatalogos
