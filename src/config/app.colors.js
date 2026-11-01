export const COLORES_DEL_SITIO = {
    'primario-1': '#043432',
    'primario-2': '#00A9D5',
    'complementario-1': '#B7A896',
    'complementario-2': '#00D6BD',
    'complementario-3': '#192541',
    'complementario-4': '#212529',
    'complementario-5': '#1A4B48',
    'complementario-6': '#C5A07A',
    'neutro-1': '#E8EAEF',
    'neutro-2': '#9CA4AE',
    'neutro-3': '#6D737A',
    'neutro-4': '#EDEFF6',
    'neutro-5': '#BCBEC0',
    'carbon': '#000000',
    'nieve': '#FFF',
};

export const inyectarColoresDelSitio = () => {
    const colores = Object.entries(COLORES_DEL_SITIO);

    const variables = colores.reduce((prev, [nombre, color]) => {
        return `
            ${prev}
            --${nombre}: ${color};
            \n
        `
    }, '');

    const classes = colores.reduce((prev, [nombre, color]) => {
        return `
            ${prev}
            .fondo-${nombre} { background-color: ${color} !important; }
            .color-${nombre} { color: ${color} !important; }
            .borde-${nombre} { border-color: ${color} !important; }
            \n
        `
    }, '');

    const css = `
        :root {
            ${variables}
        }

        ${classes};
    `

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
};
