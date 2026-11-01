import network from './network.services'

const cargarTiposFormularios = (params) => network.get('/public/tipos-formularios', { params });

const cargarFormulario = (id, params) => network.get(`/public/formulario/${id}`, { params });

const enviarFormulario = (idFormulario, params) => network.post(`/public/enviar-formulario/${idFormulario}`, params);

const guardarRespuestaAutomatico = (idFormulario, params) => network.post(`/public/guardar-respuesta-automatico/${idFormulario}`, params);

export default {
    cargarTiposFormularios,
    cargarFormulario,
    enviarFormulario,
    guardarRespuestaAutomatico
}
