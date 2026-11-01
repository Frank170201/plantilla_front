import { isNil } from "lodash";

export const formatearNombrePersona = (persona) => {
    return [
        persona.primer_nombre,
        persona.segundo_nombre,
        persona.tercer_nombre,
        persona.apellido_casada,
        persona.primer_apellido,
        persona.segundo_apellido,
    ].filter((elemento) => !isNil(elemento)).join(' ');
};

export const formatComerciante = (item) => {
  const nombreComercial = (item.solicitud_adjudicacion?.nombre_comercial || item.solicitud.nombre_comercial) ?? "-";

  if (!item.comerciante?.persona) {
    return nombreComercial;
  }
  
  const { persona } = item.comerciante;
  let representante = "";
  
  if (persona.tipo_persona?.id === 2) {
    representante = formatearNombrePersona(persona.RepresentanteLegal);
  } else {
    representante = persona.nombre_completo;
  }
  
  return representante ? `${nombreComercial} (${representante})` : nombreComercial;
};