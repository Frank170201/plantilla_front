export const calcularPesoArchivoEnMB = (size, decimales = 2) => {
  if (!size) return 0;
  
  const sizeInMB = size / (1024 * 1024);
  
  return parseFloat(sizeInMB.toFixed(decimales));
};
