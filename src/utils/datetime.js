import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.extend(relativeTime);
dayjs.locale("es");

export const formatearFecha = (fecha, formato = 'DD/MM/YYYY HH:mm:ss') =>  dayjs(fecha).format(formato);

export const formatearSoloFecha = (fecha, formato = 'DD/MM/YYYY') => {
    if (!fecha) return '';
    const fechaStr = typeof fecha === 'string' && !fecha.includes('T') ? fecha + 'T00:00:00' : fecha;
    return dayjs(fechaStr).format(formato);
};

export const fromNow = (fecha) =>  dayjs(fecha).fromNow();
