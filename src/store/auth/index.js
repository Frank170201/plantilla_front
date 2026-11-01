import { defineStore } from "pinia";
import useNoti from "@/composables/useNoti";
import authServices from "@/services/auth.services";
import router from "@/router";
import { jwtDecode } from "jwt-decode";
import { useDashboardStore } from "@/store/dashboard";
import { LocalStorage } from "@/utils/LocalStorage";
// import { set } from "lodash";
const { notify } = useNoti();

const verificarRedireccionExterna = () => {
  const params = new URLSearchParams(window.location.search);
  const origen = params.get('origin_app');

  return Boolean(origen);
}

const redireccionarInternamente = ({ token, refreshToken }, callback) => {
  LocalStorage.token = token;
  LocalStorage.refresh_token = refreshToken;

  const { roles, user: user, perfiles, comercios } = jwtDecode(LocalStorage.token);

  const informacionUsuario = {
    id: user.id,
    email: user.email,
    name: user.nombre,
    roles,
    perfiles,
    comercios,
    is_admin: roles.includes("ROLE_ADMIN"),
    id_tipo_comerciante: user.id_tipo_comerciante,
    nombre_comercial: user.nombre_comercial || "",
    id_comerciante: user.id_comerciante || null,
  };

  callback?.(informacionUsuario);

  router.push({ name: 'marketPanel' });
}

const redireccionarExternamente = ({ token, redirectTo }) => {
  const params = new URLSearchParams({
    token,
  });

  window.location.href = `${redirectTo}/auth-callback?${params.toString()}`;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: {
      email: null,
      name: null,
      is_admin: false,
      roles: [],
      perfiles: [],
      comercios: [],
      nombre_comercial: "",
      id_comerciante: null,
    },
    pinia_is_loading: false,
    ruta_gestor: null,
    foto_usuario: null,

    // 2FA
    should_confirm_2fa : false,
  }),
  actions: {
    async obtenerRutaGestor() {
      const { data } = await authServices.obtenerRutaGestor();
      this.ruta_gestor = data;
    },
    async login(email, password, origen) {
      this.pinia_is_loading = true;

      try {
        const { data } = await authServices.login(email, password, origen);

        // Verificación si se requiere código por correo electrónico
        if (data?.data?.should_send_email_code) {
          this.should_confirm_2fa = true;
          notify(data.message);
        }

        // Verificación si se requiere autenticación por aplicación TOTP
        if (data?.data?.uses_totp_auth) {
          this.should_confirm_2fa = true;
        }

        const esRedireccionExterna = verificarRedireccionExterna();

        if (esRedireccionExterna) {
          redireccionarExternamente(data);
          return;
        }

        redireccionarInternamente(data, (usuario) => {
          this.user = usuario;
        });
      } catch (error) {
        //
      } finally {
        this.pinia_is_loading = false;
      }
    },
    async verifyCode(email, code) {
      this.pinia_is_loading = true;

      try {
        const { data } = await authServices.verifyTwoFactorCode(email, code);

        LocalStorage.token = data.token;
        LocalStorage.refresh_token = data.refreshToken;

        const { roles, user, perfiles, comercios } = jwtDecode(LocalStorage.token);

        this.user = {
          email: user.email,
          name: user.nombre,
          roles,
          perfiles,
          comercios,
          is_admin: roles.includes("ROLE_ADMIN"),
          id_tipo_comerciante: user.id_tipo_comerciante,
          nombre_comercial: user.nombre_comercial || "",
          id_comerciante: user.id_comerciante || null,
        };

        // CloseDialog2FA
        this.should_confirm_2fa = false;

        router.push({ name: 'dashboard' });
        return true;
      } catch (error) {
        //
      } finally {
        this.pinia_is_loading = false;
      }
    },
    // async obtenerFotoUsuario() {
    //   if (!this.foto_usuario) {
    //     const { data } = await authServices.obtenerFotoUsuario();
    //     this.foto_usuario = data;
    //   }
    // },
    async validateToken(tokenValidar) {
      this.pinia_is_loading = true;
      try {
        const {
          data: { token, refreshToken },
        } = await authServices.validarToken(tokenValidar).catch(() => {
          notify(
            "Ha ocurrido un error al validar la sesión, por favor intente nuevamente.",
            "error"
          );
          setTimeout(() => {
            router.push("/");
          }, 3000);
        });
        localStorage.setItem("token", token);
        localStorage.setItem("refresh_token", refreshToken);
        const { roles, user, perfiles } = jwtDecode(
          localStorage.getItem("token")
        );
        this.user = {
          email: user.email,
          name: user.nombre,
          roles,
          perfiles,
          is_admin: roles.includes("ROLE_ADMIN"),
        };
        router.push({
          name: 'dashboard'
        });
      } catch (error) {
        // window.location = '/login'
      } finally {
        this.pinia_is_loading = false;
      }
    },
    validarRoles(roles) {
      if (this.user.is_admin) {
        return true;
      }

      const rolesArray = Array.isArray(roles) ? roles : [roles];

      return rolesArray.some((rol) => this.user.roles.includes(rol));
    },
    reset() {
      this.user = {
        email: null,
        name: null,
        is_admin: false,
        roles: [],
      };
    },
    async logout() {
      const useDashboard = useDashboardStore();
      useDashboard.$reset();
      this.reset();
      await authServices.logout();

      localStorage.clear();
      localStorage.setItem("sesionCerrada", "true");
      window.location = "/login";
    },
    cargarToken() {
      const token = localStorage.getItem("token");
      if (token) {
        const { roles, user, perfiles } = jwtDecode(token);
        this.user = {
          email: user.email,
          name: user.nombre,
          roles,
          perfiles,
          is_admin: roles.includes("ROLE_ADMIN"),
        };
      }
    },
    cambiarEstadoCargando(estado) {
      this.pinia_is_loading = estado;
    },
    async validarUsuario(token){
      await authServices.validarUsuario(token);
    }
  },
  getters: {
    obtenerEstadoCargando() {
      return this.pinia_is_loading;
    },
  },
  persist: true
});
