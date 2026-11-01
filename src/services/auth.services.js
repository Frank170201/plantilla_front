import network from "./network.services";

const solicitarRestablecimientoPassword = (email) => network.post("/public/password/reset", { email });

const restablecerPassword = (body, token) => network.put("/public/password/change", body, {
  headers: {
    Authorization: `Bearer ${token}`,
  }
});

const login = async (email, password, origin) =>
  await network.post("/public/login", { email, password, origin_application: origin });

const logout = async () => await network.post("/logout");

const getMenu = () => network.get("rutas/get-rutas");
const validarToken = (token) => network.post("/validar-token", { token });

const obtenerRutaGestor = () => network.get("/rutas/get-rutas-gestor");

// const obtenerFotoUsuario = () => network.get("/foto");

const validarUsuario = (token) => network.get(`/public/verification/account/${token}`);

// 2FA
const verifyTwoFactorCode = (email, code) => network.post("public/2fa/validate", { email, code });
const getQrCode = () => network.get("/autenticacion/obtener/qr");
const validateMethod = (code) => network.patch("/autenticacion/validar/metodo", { code });
const obtenerMetodosConfigurados = (id, params) => network.get(`/autenticacion/metodos/${id}`, { params });
const reconfigurarMetodo = (idUsuario, idMetodo, params) => network.put(`/autenticacion/metodo/actualizar/${idUsuario}/${idMetodo}`, { params });
const eliminarMetodoConfigurado = (idMetodo, params) => network.delete(`/autenticacion/metodo/eliminar/${idMetodo}`, { params });

export default {
  login,
  getMenu,
  logout,
  validarToken,
  obtenerRutaGestor,
  validarUsuario,
  // obtenerFotoUsuario
  verifyTwoFactorCode,
  getQrCode,
  validateMethod,
  solicitarRestablecimientoPassword,
  restablecerPassword,
  obtenerMetodosConfigurados,
  reconfigurarMetodo,
  eliminarMetodoConfigurado,
};
