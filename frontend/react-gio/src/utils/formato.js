// utils/formato.js
export const formatearMiles = (numero) => {
    if (!numero && numero !== 0) return '';
    return new Intl.NumberFormat('es-CO').format(numero);
  };
  