import { helpers, required, maxValue, minValue  } from "@vuelidate/validators";
import { format, endOfDay, startOfDay } from "date-fns";


const obtenerObjetoPregunta = (pregunta, idPreguntaPadre) => ({
    id: pregunta.id, 
    label: pregunta.label, 
    validaciones: pregunta.configuracion_extra?.validaciones ?? [],
    opciones: pregunta.configuracion_extra?.opciones ?? [],
    tipo: pregunta.tipo,
    mostrar_pregunta_anidada_cuando: pregunta.configuracion_extra.mostrar_pregunta_anidada_cuando,
    ...idPreguntaPadre && ({ id_pregunta_padre: idPreguntaPadre }),
});

export const obtenerPreguntasEnJerarquia = (jerarquia, preguntas = []) => {
    jerarquia.forEach((elemento) => {
        if (elemento.es_seccion) {
            obtenerPreguntasEnJerarquia(elemento.preguntas, preguntas);
            return;
        }

        if (['DIVIDER', 'TEXTO_ENRIQUECIDO'].includes(elemento.tipo.codigo)) return;

        preguntas.push(obtenerObjetoPregunta(elemento));

        const preguntasDependientes = elemento.preguntas_dependientes;

        if (Array.isArray(preguntasDependientes)) {
            preguntasDependientes.forEach((preguntaDependiente) => {
                preguntas.push(obtenerObjetoPregunta(preguntaDependiente, elemento.id));
            });
        }
    });

    return preguntas;
}

export const esControlDeFormulario = (elemento) => !elemento.es_seccion && elemento.tipo.nombre !== 'divider';

export const mapearValidaciones = (validaciones = [], opciones = {}) => {
    const { saltar_required: saltarRequired } = opciones;
    const objetoValidacionesVuetify = {};

    validaciones.forEach((validacion) => {
        if (validacion.es_regex) {
            const regex = helpers.regex(new RegExp(validacion.valor));
            objetoValidacionesVuetify.regex = helpers.withMessage(`Formato no válido.`, regex);
            return;
        }

        switch(validacion.tipo) {
            case 'required': {
                if (saltarRequired) break;

                objetoValidacionesVuetify.required = helpers.withMessage(`Campo requerido.`, required);
            }
            break;
            case 'minDate': {
                const fechaMinima = validacion.valor === 'HOY' ? startOfDay(new Date()) : new Date(validacion.valor);
                objetoValidacionesVuetify.minDate = helpers.withMessage(
                    `Seleccione una fecha mayor a ${format(fechaMinima, 'dd/MM/yyyy')}.`, 
                    minValue(fechaMinima),
                );
            }
            break;
            case 'maxDate': {
                const fechaMaxima = validacion.valor === 'HOY' ? endOfDay(new Date()) : new Date(validacion.valor);
                objetoValidacionesVuetify.maxDate = helpers.withMessage(
                    `Seleccione una fecha menor a ${format(fechaMaxima, 'dd/MM/yyyy')}.`, 
                    maxValue(fechaMaxima),
                );
            }
            break;
            case 'min': {
                objetoValidacionesVuetify.min = helpers.withMessage(
                    `El valor debe ser mayor o igual a ${validacion.valor}.`, 
                    minValue(validacion.valor),
                );
            }
            break;
            case 'max': {
                objetoValidacionesVuetify.max = helpers.withMessage(
                    `El valor debe ser menor o igual a ${validacion.valor}.`, 
                    maxValue(validacion.valor),
                );
            }
            break;
        }
    });

    return objetoValidacionesVuetify;
}

export const delimitarFinDeSecciones = (preguntas) => {
    const copiaPreguntas = preguntas.slice();
    const indexFinSecciones = preguntas.findIndex((pregunta) => !pregunta.es_seccion);

    if (indexFinSecciones > 0) {
        copiaPreguntas.splice(indexFinSecciones, 0, { tipo: { codigo: 'DIVIDER' } })
    }

    return copiaPreguntas;
}

export const mostrarPreguntaAnidada = (valoresQueMostraranPregunta, valorPreguntaPadre) => {    
    if (!valorPreguntaPadre) return false;

    let contieneUnValorQueMuestraPregunta = false;

    if (Array.isArray(valorPreguntaPadre)) {
        contieneUnValorQueMuestraPregunta = valorPreguntaPadre.some((valor) => valoresQueMostraranPregunta.includes(valor));
    } else {
        contieneUnValorQueMuestraPregunta = valoresQueMostraranPregunta.includes(valorPreguntaPadre);
    }

    return contieneUnValorQueMuestraPregunta;
};

export const prefijoJustificaciones = '_JUSTIFICACION_PREGUNTA_';