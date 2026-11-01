import formulariosServices from "@/services/formularios.services";
import { defineStore } from "pinia";


export const useFormulariosStore = defineStore('formularios', {
  state: () => ({
    configuracion_adicional: { 
      validaciones: [],
      opciones: [],
      placeholder: null,
      descripcion: null,
    },
    catalogo_tipos_validacion: [],
    catalogo_tipos_validacion_cargado: false,
    catalogo_tipos_pregunta: [],
    catalogo_tipos_pregunta_cargado: false,
    secciones_abiertas: [],
  }),
  actions: {
    restablecerConfiguracionAdicional() {
      this.configuracion_adicional.placeholder = null;
      this.configuracion_adicional.descripcion = null;
      this.configuracion_adicional.validaciones = [];
      this.configuracion_adicional.opciones = [];
    },
    async cargarCatalogoTiposPregunta() {
      if (this.catalogo_tipos_pregunta_cargado) return;
      
      const response = await formulariosServices.cargarTiposPregunta();
  
      if (response.status === 200) {
        this.catalogo_tipos_pregunta = response.data;
        this.catalogo_tipos_pregunta_cargado = true;
      }
    },
    async cargarCatalogoTiposValidacion() {
      if (this.catalogo_tipos_validacion_cargado) return;
  
      const response = await formulariosServices.cargarTiposValidaciones();
  
      if (response.status === 200) {
        this.catalogo_tipos_validacion = response.data;
        this.catalogo_tipos_validacion_cargado = true;
      }
    },
    limpiarSeccionesAbiertas() {
      this.secciones_abiertas = [];
    },
  },
});
