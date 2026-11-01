import network from './network.services'

const getEstadosEncuestas = () => {
  return network.get('/catalogos/estado-encuestas')
}

const getCategorias = () => {
  return network.get('/catalogos/categorias')
}

const getEstadosSolicitud = () => {
  return network.get('/solicitudes/obtener/estados/solicitud')
}

const getTipoRespuestas = () => {
  return network.get('/catalogos/tipo-respuestas')

}

const fetchGeneros = () => {
  return network.get('/public/generos');
}

const fetchTipoPersona = () => {
  return network.get('/catalogo/tipo-personas');
}

const fetchTipoPersonaPublica = () => {
  return network.get('/public/tipo-personas');
}

const fetchTipoDoc = () => {
  return network.get('/public/tipo-documentos');
}

const fetchCtlLogPagos = () => {
  return network.get('/catalogo/tipo-log-pago');
}

const fetchCategoriasAnuncios = () => {
  return network.get('/public/anuncios/categorias')
}

const getTipoInvalidacionDte = () => {
  return network.get('/catalogo/tipo-invalidacion-dte');
}

const fetchTipoDTE = (params) => {
  return network.get("/catalogo/tipo-dte", { params });
};

const fetchTipoEstablecimiento = () => {
  return network.get("/catalogo/tipo-establecimiento");
}

const fetchPersonas = (params = {}) => {
  return network.get("/catalogo/personas", { params });
}

const obtenerClasesDocumento = () => {
  return network.get("/catalogo/clase-documento");
}

export default {
  getEstadosEncuestas,
  fetchGeneros,
  getCategorias,
  getTipoRespuestas,
  fetchTipoPersona,
  fetchTipoDoc,
  fetchCtlLogPagos,
  fetchTipoPersonaPublica,
  fetchCategoriasAnuncios,
  getEstadosSolicitud,
  getTipoInvalidacionDte,
  fetchTipoDTE,
  fetchTipoEstablecimiento,
  fetchPersonas,
  obtenerClasesDocumento,
}
