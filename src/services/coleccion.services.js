import network from './network.services';

const obtenerConfiguracionColeccion = (params) =>
    network.get('/configuracion-coleccion', { params });

const obtenerRoles = (params) => network.get('/roles', { params });

const crearConfiguracion = (body) =>
    network.post('/configuracion-coleccion', body);

const actualizarConfiguracion = (id, body) =>
    network.put(`/configuracion-coleccion/${id}`, body);

const borrarConfiguracion = (id) =>
    network.delete(`/configuracion-coleccion/${id}`);

const asignarPerfil = (id_coleccion, params) =>
    network.post(`/configuracion-coleccion/asignar-perfil/${id_coleccion}`, params);

const removerRol = (id_coleccion, params) =>
    network.post(`/configuracion-coleccion/remover-rol/${id_coleccion}`, params);


export default {
    obtenerConfiguracionColeccion,
    crearConfiguracion,
    actualizarConfiguracion,
    borrarConfiguracion,
    obtenerRoles,
    asignarPerfil,
    removerRol
}