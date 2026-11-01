/**
 * Crea una configuración base para una tabla con encabezados y paginación.
 *
 * @param {Array<Object>} baseHeaders - Encabezados de la tabla.
 * @param {Array<Object>} [additionalHeaders=[]] - Encabezados adicionales a agregar.
 * @returns {Object} Objeto de configuración de tabla con headers, paginación e items vacíos.
 */

export const createTableConfig = ({ baseHeaders = [], additionalHeaders = [], groupBy = null }) => ({
  headers: [...baseHeaders, ...additionalHeaders],
  paginacion: {
    page: 1,
    per_page: 10,
    total_rows: 0,
  },
  items: [],
  ...(groupBy && { groupBy }),
});


/**
 * Carga los datos paginados desde un servicio y actualiza la configuración de la tabla.
 *
 * @param {Ref<Object>} tableRef - Referencia reactiva al objeto de configuración de la tabla.
 * @param {Function} serviceMethod - Método del servicio que devuelve los datos y headers.
 * @param {Object} [params={}] - Parámetros adicionales a enviar al servicio.
 * @returns {Promise<void>} Promesa que se resuelve al cargar y asignar los datos.
 *
 * @example
 * const tableConfig = ref(createTableConfig(commonHeaders, [
 *   { align: "center", title: "Acciones", key: "acciones", sortable: false },
 * ]));
 *
 * await loadTableData(tableConfig, getPagosPendientes, { estado: 'pendiente' });
 */

export const loadTableData = async (tableRef, serviceMethod, params = {}) => {
  const { data, headers } = await serviceMethod({
    page: tableRef.value.paginacion.page,
    per_page: tableRef.value.paginacion.per_page,
    ...params,
  });

  tableRef.value.paginacion.page = Number(headers.page);
  tableRef.value.paginacion.total_rows = Number(headers.total_rows);
  tableRef.value.paginacion.per_page = Number(headers.per_page);
  tableRef.value.items = data;
};


/**
 * Crea una función de recarga que actualiza la paginación de la tabla
 * y ejecuta una función de recarga personalizada (por ejemplo, para volver a consultar datos del backend).
 *
 * Útil para vincularse con el evento `@update:options` de `v-data-table-server`.
 *
 * @param {import('vue').Ref<Object>} tableRef - Referencia reactiva a la configuración de la tabla (con paginación).
 * @param {Function} reloadFunction - Función que se ejecutará después de actualizar los datos de paginación.
 * @returns {Function} Función que recibe un objeto `{ page, itemsPerPage }` y actualiza la tabla.
 *
 * @example
 * const tableConfig = ref(createTableConfig(headers));
 *
 * const reloadData = () => {
 *   loadTableData(tableConfig, getPagos, { params });
 * };
 *
 * const onUpdateOptions = createReloadTable(tableConfig, reloadData);
 *
 * <TableComponent :config="tableConfig" @update:options="onUpdateOptions" />
 * 
 */
export const createReloadTable = (tableRef, reloadFunction) => {
  return ({ page, itemsPerPage, ...params } = {}) => {
    if(page) tableRef.value.paginacion.page = page;
    if (itemsPerPage) tableRef.value.paginacion.per_page = itemsPerPage;
    reloadFunction(params);
  };
};
