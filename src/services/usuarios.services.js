import network from './network.services'

const fetchUsuarios = (params) => {
  return network.get('/users', { params });
}

const fetchPerfiles = (params) => {
  return network.get('/perfiles/por-roles/obtener', { params });
}

const createUsuario = (params) => {
  return network.post('/users', params);
}

const updateUsuario = (id, params) => {
  return network.put(`/users/${id}`, params);
}

const eliminarUsuario = (id, params) => {
  return network.delete(`/users/${id}`, params);
}

const obtenerEstados = (params) =>
  network.get('/users/listado-estados', { params });

const actualizarEstado = (id_usuario, data) =>
  network.put(`/users/actualizar-estado/${id_usuario}`, data);

const listarNotificaciones = () =>
  network.get("/users/listar-notificaciones");

const updatePassword = (params) => network.put('/users/update/password', params);

const verificarUsuario = (id, params) => {
  return network.put(`/users/verificar-usuario/${id}`, params);
}

const resetPassword = (id_usuario, params) => {
  return network.put(`/users/reset/password/${id_usuario}`, params);
}

export default {
  fetchUsuarios,
  fetchPerfiles,
  createUsuario,
  updateUsuario,
  obtenerEstados,
  actualizarEstado,
  listarNotificaciones,
  updatePassword,
  eliminarUsuario,
  verificarUsuario,
  resetPassword,
}
