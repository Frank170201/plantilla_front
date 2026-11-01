import { helpers, required, email, numeric } from "@vuelidate/validators";

const CATALOGO_MENSAJES_VALIDACION = {
  required: "El campo es requerido",
  email: "El campo debe ser un correo electrónico válido",
  regex: "El campo debe contener un valor que cumpla el formato solicitado",
  numeric: "El campo solo debe contener valores numéricos",
  maxLength: "El campo excede el límite de caracteres permitidos",
};

const toNum = (v) => {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
};

export function AttributeMapper(instanciaVuelidate, propiedad) {
    if (!new.target) {
        return new AttributeMapper(instanciaVuelidate, propiedad);
    }

    const validaciones = instanciaVuelidate[propiedad];

    this['error-messages'] = validaciones?.$errors.map((error) => error.$message);
    this['hide-details'] = !validaciones?.$errors.length;
    this.oninput = validaciones?.$touch;
    this.onblur = validaciones?.$touch;
}

export class ValidationBuilder {
  constructor() {
    this._catalogo_mensajes = CATALOGO_MENSAJES_VALIDACION;
    this._reglas = {};
  }

  setCatalogoMensajes(catalogo) {
    this._catalogo_mensajes = catalogo ?? CATALOGO_MENSAJES_VALIDACION;

    return this;
  }

  getCatalogoMensajes() {
    return this._catalogo_mensajes;
  }

  required(mensaje, omitirValidacion = false) {
    if (omitirValidacion) return this;

    const regla = "required";
    this._reglas[regla] = helpers.withMessage(mensaje ?? this._catalogo_mensajes[regla], required);

    return this;
  }

  email(mensaje, omitirValidacion = false) {
    if (omitirValidacion) return this;

    const regla = "email";
    this._reglas[regla] = helpers.withMessage(mensaje ?? this._catalogo_mensajes[regla], email);

    return this;
  }

  regex(mensaje, patron, omitirValidacion = false) {
    if (omitirValidacion) return this;

    const regla = "regex";

    this._reglas[regla] = helpers.withMessage(mensaje ?? this._catalogo_mensajes[regla], (value) => (value ? patron.test(value) : true));

    return this;
  }

  numeric(mensaje, omitirValidacion) {
    if (omitirValidacion) return this;

    const regla = "numeric";

    this._reglas[regla] = helpers.withMessage(mensaje ?? this._catalogo_mensajes[regla], numeric);

    return this;
  }

  construirReglas() {
    return this._reglas;
  }

  maxLength(max, mensaje, omitirValidacion = false) {
    if (omitirValidacion) return this;

    const regla = "maxLength";
    this._reglas[regla] = helpers.withMessage(
      mensaje ?? `El campo no puede tener más de ${max} caracteres`,
      (value) => !value || value.length <= max,
    );

    return this;
  }

  min(min = 0, mensaje, omitirValidacion = false) {
    if (omitirValidacion) return this;

    const regla = "minValue";
    this._reglas[regla] = helpers.withMessage(mensaje ?? `El valor debe ser mayor o igual a ${min}`, (value) => toNum(value) >= min);

    return this;
  }
}
