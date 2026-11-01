export const formatearLista = (textoEnriquecido = "") => {
  return textoEnriquecido
    .replace(/<ol>/g, '<ol style="margin-top:8px; padding-left:20px;">')
    .replace(
      /<ul>/g,
      '<ul style="margin-top:8px; list-style-type:disc; padding-left:20px;">'
    );
};

const mapearPropiedades = (propiedadesEnTexto = '') => {
  const coincidencias = propiedadesEnTexto.matchAll(/([\w-]+)="([^"]*)"/gm);

  if (!coincidencias) return {};

  return Array.from(coincidencias).reduce((propiedades, coincidencia) => {
    const propiedad = coincidencia[1];
    const valor = coincidencia[2];

    return ({ ...propiedades, [propiedad]: valor });
  }, {});
};

const verificarPropiedades = (texto, regex) => {
  const match = texto.match(regex);

  let propiedades = null;

  if (match) {
    propiedades = mapearPropiedades(match[1]);
  }

  return [!!match, propiedades];
};

const obtenerTextoPlano = (texto = '', textos = [], agregarEnArbol = true) => {
  const coincidenciaTermino = texto.match(/\$([áéíóúÁÉÍÓÚñÑ\w\s,.\d]+)\$(\d+)\$/i);

  if (coincidenciaTermino) {
    const cadenaPrevia = obtenerTextoPlano(texto.substring(0, coincidenciaTermino.index), textos, false);
    if (typeof cadenaPrevia === 'string' && cadenaPrevia.length > 0) textos.push({ tipo: 'HTML', children: cadenaPrevia });

    const [, termino, definicion] = coincidenciaTermino;
    textos.push({ tipo: 'TERMINO', children: termino, definicion });

    const textoRestante = texto.substring(coincidenciaTermino.index + coincidenciaTermino[0].length);
    obtenerTextoPlano(textoRestante, textos, true);

    return textos;
  }

  const coincidenciaCaracterEspacio = texto.match(/(@|<br>)/);

  if (coincidenciaCaracterEspacio) {
    const cadenaPrevia = obtenerTextoPlano(texto.substring(0, coincidenciaCaracterEspacio.index), textos, false);
    if (typeof cadenaPrevia === 'string' && cadenaPrevia.length > 0) textos.push({ tipo: 'HTML', children: cadenaPrevia });

    textos.push({ tipo: 'HTML', variante: 'br' });
    const textoRestante = texto.substring(coincidenciaCaracterEspacio.index + coincidenciaCaracterEspacio[0].length);
    obtenerTextoPlano(textoRestante, textos, true);

    return textos;
  }

  if (texto.length > 0 && agregarEnArbol) {
    textos.push({ tipo: 'HTML', children: texto });
  }

  return texto;
};

const agregarTextoPlanoEnArbol = (texto, arbol) => {
  if (Array.isArray(texto)) {
    arbol.push(...texto);
  } else {
    arbol.push({ tipo: 'HTML', children: texto });
  }
};

const traducirTextoEnriquecido = (texto = '', arbol = [], anidamiento = false) => {
  const coincidenciaEtiqueta = texto.match(/<(\w+).*?>/);

  // Manejo de contenido de tipo etiqueta
  if (coincidenciaEtiqueta) {
    const etiqueta = coincidenciaEtiqueta[1];
    const contenidoEtiqueta = texto.match(new RegExp(`<${etiqueta}.*?>(.*?)</${etiqueta}>`));
    const esEtiquetaAutoCierre = !contenidoEtiqueta;

    const textoPrevio = texto.substring(0, coincidenciaEtiqueta.index);
    if (textoPrevio) agregarTextoPlanoEnArbol(obtenerTextoPlano(textoPrevio), arbol);

    const regexPropiedades = esEtiquetaAutoCierre ? new RegExp(`<${etiqueta}(.*?)>`) : new RegExp(`<${etiqueta}(.*?)>.*</${etiqueta}>`);
    const [tienePropiedades, propiedades] = verificarPropiedades(texto, regexPropiedades);

    const nuevoElemento = {
      tipo: 'HTML',
      variante: etiqueta,
      ...tienePropiedades && ({ propiedades }),
      ...!esEtiquetaAutoCierre && ({ children: traducirTextoEnriquecido(contenidoEtiqueta?.[1] ?? '', [], true) }),
    };

    arbol.push(nuevoElemento);

    const cadenaDeTextoRestante = esEtiquetaAutoCierre
      ? texto.substring(coincidenciaEtiqueta.index + coincidenciaEtiqueta[0].length)
      : texto.substring(coincidenciaEtiqueta.index + contenidoEtiqueta[0].length);

    return traducirTextoEnriquecido(cadenaDeTextoRestante, arbol);
  }

  // Manejo de texto plano
  const textoPlano = obtenerTextoPlano(texto);

  if (textoPlano) agregarTextoPlanoEnArbol(textoPlano, arbol);

  // Salida de recursión (usando variable 'anidamiento')
  return anidamiento ? textoPlano : arbol;
};

export const obtenerTerminosEnTextoEnriquecido = (texto = '') => {
  const coincidencias = texto.matchAll(/\$([áéíóúÁÉÍÓÚñÑ\w\s,.\d]+)\$(\d+)\$/ig);

  return Array.from(coincidencias).map((coincidencia) => ({ termino: coincidencia[1], definicion: coincidencia[2] }));
};

export const interceptarTerminosEnArbol = (estructura, handler) => {
  if (estructura.tipo === 'HTML') {
    if (Array.isArray(estructura.children)) {
      estructura.children.forEach((subEstructura) => {
        if (typeof subEstructura !== 'string') {
          interceptarTerminosEnArbol(subEstructura, handler);
        }
      });
    }
  } else {
    handler(estructura);
  }
};

export default traducirTextoEnriquecido;
