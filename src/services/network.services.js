import axios from "axios";
import useNoti from "@/composables/useNoti";
import { ref } from "vue";

const { notify } = useNoti();

export const isLoading = ref(false);

export const isBlobApiErrorResponse = async (blob) => {
  const fileError = await blob.text();

  if (!fileError) return [false];

  const json = JSON.parse(fileError);
  return [true, json];
};

let config = {
  baseURL:
    import.meta.env.VITE_VUE_APP_API_URL || "http://127.0.0.1:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
  responseType: "json",
};

const instance = axios.create(config);

instance.interceptors.request.use(
  function (config) {
    if (
      !config.url.startsWith("/fotos-360") &&
      !config.url.includes("guardar-respuesta-automatico")
    ) {
      isLoading.value = true;
    }
    const token = localStorage.getItem("token");

    if (token && config.headers !== null) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    isLoading.value = false;
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    isLoading.value = false;
    const { status, data } = response;
    if ((status === 201) && typeof data === "string") {
      const { notify } = useNoti();
      notify(data, "success");
    }
    return response;
  },
  async (error) => {
    let message = "Algo salio mal, contactar con soporte";
    let type = "error";

    // Manejo de errores de tipo archivo

    const isErrorBlob = error.response.data instanceof Blob;

    if (isErrorBlob) {
      const [isApiError, decoded] = await isBlobApiErrorResponse(
        error.response.data
      );

      if (isApiError) {
        notify(decoded.description, type, { clearOnUrlChange: false });
        isLoading.value = false;

        return Promise.reject(decoded.description);
      }
    }

    if (error.isAxiosError && error.response) {
      const { status } = error.response;

      switch (status) {
        case 0:
        case "ERR_NETWORK":
          message = "No se pudo establecer conexión con el servidor.";
          break;
        case 500:
          message = "Error de servidor.";
          break;
        case 401: {
          message = error.response?.data?.description;
          const token = !!localStorage.getItem("token");
          localStorage.setItem("sesionCerrada", "true");
          localStorage.removeItem("token");
          if (error.config.url !== "/public/login" && token) {
            alert("Su sesión ha sido cerrada");
            window.location = "/login";
          }
          break;
        }
        default:
          if (status >= 400 && status < 500) {
            message = getErrorMessage(error.response.data); // Extract error message(s)
          } else {
            message = error.response.statusText;
          }
      }
    } else {
      message = error.message || "Error desconocido."; // Handle non-Axios errors
    }

    notify(message, type, { clearOnUrlChange: false });
    isLoading.value = false;

    return Promise.reject(message ?? error.message);
  }
);

function getErrorMessage(errorData) {
  if (Array.isArray(errorData)) {
    return errorData
      .map((err) => (err.description ? err.description : err.message))
      .join(", ");
  } else if (errorData?.description) {
    return errorData.description;
  } else {
    return "";
  }
}

export default instance;
