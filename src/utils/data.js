/* eslint-disable no-prototype-builtins */
import { isNil } from 'lodash';

export const convertToFormData = (data, formData = new FormData(), parentKey) => {
    if (parentKey && typeof data === 'object' && data !== null && data instanceof File) {
        formData.append(parentKey, data);
    } else {
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            const value = data[key];
            const formKey = parentKey ? `${parentKey}[${key}]` : key;

            if (isNil(value)) continue;

            if (
                typeof value === 'object' &&
                value !== null &&
                !Array.isArray(value) &&
                !(value instanceof File) &&
                !(value instanceof Date)
            ) {
                convertToFormData(value, formData, formKey);
            } else if (Array.isArray(value)) {
                for (let i = 0; i < value.length; i++) {

                  if (value[i] === null || typeof value[i] !== 'object') {
                    formData.append(`${formKey}[${i}]`, value[i]);
                  } else {
                    convertToFormData(value[i], formData, `${formKey}[${i}]`);
                  }
                }
            } else if (value instanceof Date) {
                formData.append(formKey, value.toUTCString());
            } else if (value instanceof File) {
                formData.append(formKey, value);
            } else {
                formData.append(formKey, value);
            }
          }
        }
    }
    return formData;
}


export const toMoneyFormat = (value, loading, options) => {
  if (loading) return 'Cargando...';

  if (!value || isNaN(value)) {
      return '$0.00';
  }

  return Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      ...options,
  }).format(value);
};

export function splitByChunks(value, chunkSize = 4, separator = " ") {
  const str = String(value);
  const chunks = [];

  for (let i = 0; i < str.length; i += chunkSize) {
    chunks.push(str.slice(i, i + chunkSize));
  }

  return chunks.join(separator);
}

export const capitalizar = texto => texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();

export const limpiarTexto = (texto) => texto.trim().replace(/@.*$/, "");

export const normalizarTextoPorCantidadRegistros = (texto, cantidadRegistros) => {
  if (cantidadRegistros === 1) {
    return texto.replace(/\[[a-z]\]/ig, '');
  }

  return texto.replaceAll(/\[([a-z])\]/ig, (_match, caracter) => caracter);
}
