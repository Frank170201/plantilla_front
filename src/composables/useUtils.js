import useNoti from "@/composables/useNoti";
import { saveAs } from "file-saver";
const { notify } = useNoti();
export default () => {
  const descargarArchivo = async (callback, tipo, nombreArchivo) => {
    const tiposArchivos = {
      pdf: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    };
    if (!callback && typeof callback !== "function") {
      notify("No se ha enviado una función para descargar el archivo", "error");
      return;
    }
    if (!tipo) {
      notify("No se ha enviado un tipo de archivo", "error");
      return;
    }
    if (!nombreArchivo) {
      notify("No se ha enviado un nombre para el archivo", "error");
      return;
    }

    const { data } = await callback();
    const blob = new Blob([data], { type: tiposArchivos[tipo] });
    saveAs(blob, nombreArchivo);
  };
  const totalPaginas = ({ total_items, items_per_page }) =>
    Math.ceil(+total_items / +items_per_page);

  const totalPaginasTexto = ({ total_items, items_per_page, page }) =>
    `Página ${page} de ${Math.ceil(+total_items / +items_per_page)}`;
  return { descargarArchivo, totalPaginas, totalPaginasTexto };
};

const haveRoles = (roles) => {

}
