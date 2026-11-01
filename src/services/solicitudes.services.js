import network from './network.services'

const obtenerSolicitudes = (id_nivel, params) =>
  network.get(`/solicitudes/nivel/${id_nivel}`, {params})

const crearSolicitud = (data) =>
  network.post('/solicitudes', data)

const aprobarSolicitud = (data) =>
  network.put('/solicitudes/aprobar-solicitud', data)

const aprobarSolicitudAdjudicacion = (data) =>
  network.put('/solicitudes/aprobar/solicitud/adjudicacion', data)

const actualizarCategoriaSolicitud = (data) =>
  network.put('/solicitudes/actualizar/categoria', data)

const rechazarSolicitud = (data) =>
  network.put('/solicitudes/rechazar-solicitud', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
  })

const verificarCreacionSolicitud = (params) => network.get('/solicitudes/verificar-creacion-solicitud', { params});

const crearSolicitudConCuestionario = (data, params) => network.post('/solicitudes/crear-solicitud-con-cuestionario', data, {
  headers: {
    'Content-Type': 'multipart/form-data'
  },
  params
});

const cargarRespuestasCuestionario = (idSolicitud, params) => network.get(`/solicitudes/cargar-respuestas-cuestionario/${idSolicitud}`, { params });

const cargarSolicitudPorId = (idSolicitud, params = {}) => network.get(`/solicitudes/cargar-solicitud/${idSolicitud}`, { params });

const autoGuardado = (idFormulario, data) => network.post(`/solicitudes/guardar-respuesta-automatico/${idFormulario}`, data, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

const cargarBorradorRespuestas = (idFormulario, params) => network.get(`/solicitudes/borrador-respuestas/${idFormulario}`, { params });

const precargarRespuestas = (idFormulario) => network.get(`/solicitudes/precargar-respuestas/${idFormulario}`);

const listar_historico = (params) => network.get('/solicitudes/historico', { params });

const guardarRespuestasObs = (id_solicitud, formulario,) =>
  network.post(`/solicitudes/guardar-respuesta-observaciones/${id_solicitud}`,  formulario, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
  });

const obtenerSolicitud = (id_solicitud_local, params ) =>
  network.get(`/solicitudes/obtener-observacion/${id_solicitud_local}`, { params});

const eleminarSolicitud = (id_solicitud) =>
  network.delete(`/solicitudes/eliminar-solicitud/${id_solicitud}`)

const obtenerSolicitudesPendientes = (params ) =>
  network.get('/solicitudes/pendientes', { params});

const obtenerSolicitudesPrevias = (params) =>
  network.get(`/solicitudes/previas`, { params });

const obtenerSolicitudesPendientesEvaluar = (params) =>
  network.get("/solicitudes/pendientes/evaluar", { params });

const obtenerSolicitudesSinAdjudicacion = (params ) =>
  network.get('/solicitudes/pendientes/sin-adjudicacion', { params});

const obtenerSolicitudesLocalesPendientes = (params ) =>
  network.get('/solicitudes/local/pendientes', { params});

const obtenerContadorPendiente = (params ) =>
  network.get('/solicitudes/contador-pendientes', { params});

const obtenerConteoLocalesAsignados = (id_solicitud, params ) =>
  network.get(`/solicitudes/obtener-conteo/locales/${id_solicitud}`, { params});

const validarLocalesAsignados = (id_solicitud, params ) =>
  network.get(`/solicitudes/conteo-locales-asignados/locales/${id_solicitud}`, { params});

const obtenerComercianteSinAdjudicacion = (id_solicitud, params ) =>
  network.get(`/solicitudes/obtener-comerciante/sin-adjudicacion/${id_solicitud}`, { params});

const dejarSinEfecto = (id_solicitud, params ) =>
  network.get(`/solicitudes/pendientes/dejar-sin-efecto/${id_solicitud}`, { params});

const solicitudesFinalizadas = (params ) =>
  network.get('/solicitudes/listar/finalizadas', { params});

const obtenerBotones = (id_solicitud, params) =>
  network.get(`/solicitudes/obtenerBotones/${id_solicitud}`, { params });

const generarBitacorasIniciales = (id_solicitud, params) =>
  network.post(`/solicitudes/generar-bitacoras-iniciales/${id_solicitud}`, { params });

const alterarEstadoSolicitud = (id_solicitud, params) =>
  network.post(`/solicitudes/alterar/estado/${id_solicitud}`, params, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

const verificarCategoria = (idCategoria, idComercio, params) => network.get(`/solicitudes/verificar-categoria/${idCategoria}/${idComercio}`, params);

const obtenerBitacoraSolicitud = (idSolicitud, params) =>
  network.get(`/solicitudes/bitacora/${idSolicitud}`, { params });

const cargarDocumentoSolicitud = (idSolicitud) => network.get(`/solicitudes/visualizar-documento-solicitud/${idSolicitud}`, { responseType: "blob" });

const cargarDocumentoCalificacion = (idSolicitud) => network.get(`/solicitudes/visualizar-documento-calificacion/${idSolicitud}`, { responseType: "blob" });

const cargarDisponibilidadCategorias = (idSolicitud, params) => network.get(`/solicitudes/disponibilidad/categorias/${idSolicitud}`, { params });

const actualizarNombreComercialSolicitud = (data) =>
  network.put('/solicitudes/actualizar/nombre_comercial', data)

const actualizarModoSeleccion = (idSolicitud, data) => network.put(`/solicitudes/actualizar/modo-seleccion/${idSolicitud}`, data);

const agregarMetrajesSolicitud = (data) => network.post('/solicitudes/agregar-metrajes', data);

const eliminarStockDeSolicitud = (idStock) => network.delete(`/solicitudes/eliminar-stock/${idStock}`);

export default {
  obtenerSolicitudes,
  crearSolicitud,
  aprobarSolicitud,
  rechazarSolicitud,
  verificarCreacionSolicitud,
  crearSolicitudConCuestionario,
  cargarRespuestasCuestionario,
  cargarSolicitudPorId,
  autoGuardado,
  cargarBorradorRespuestas,
  listar_historico,
  obtenerSolicitud,
  guardarRespuestasObs,
  generarBitacorasIniciales,
  eleminarSolicitud,
  obtenerSolicitudesPendientes,
  obtenerSolicitudesLocalesPendientes,
  obtenerContadorPendiente,
  aprobarSolicitudAdjudicacion,
  obtenerConteoLocalesAsignados,
  validarLocalesAsignados,
  obtenerSolicitudesSinAdjudicacion,
  obtenerComercianteSinAdjudicacion,
  dejarSinEfecto,
  solicitudesFinalizadas,
  precargarRespuestas,
  obtenerBotones,
  alterarEstadoSolicitud,
  obtenerSolicitudesPendientesEvaluar,
  verificarCategoria,
  obtenerSolicitudesPrevias,
  actualizarCategoriaSolicitud,
  obtenerBitacoraSolicitud,
  cargarDocumentoSolicitud,
  cargarDocumentoCalificacion,
  cargarDisponibilidadCategorias,
  actualizarNombreComercialSolicitud,
  actualizarModoSeleccion,
  agregarMetrajesSolicitud,
  eliminarStockDeSolicitud,
}
