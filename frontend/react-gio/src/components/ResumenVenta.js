// src/components/ResumenVenta.js
import React from 'react';
import { formatearMiles } from '../utils/formato';

// Componente para mostrar el resumen de la venta
function ResumenVenta({ venta }) {
  if (!venta) return null;

    // Formatea los detalles de la venta
  return (
    <div className="alert alert-success mt-3">
      <h5>✅ Venta Registrada con Éxito</h5>
      <hr />
      <p><strong>ID Venta:</strong> {venta.id}</p>
      <p><strong>Fecha:</strong> {new Date(venta.fechaVenta).toLocaleString()}</p>
      <p><strong>Total Venta:</strong> ${formatearMiles(venta.totalVenta)}</p>
      <p><strong>Forma de Pago:</strong> {venta.formaDePago}</p>
      <p><strong>Descuento:</strong> ${formatearMiles(venta.descuento)}</p>
      <p><strong>Productos:</strong></p>
      <ul>
        {venta.detalles.map((d, idx) => (
          <li key={idx}>
            {d.cantidad} x {d.nombreProducto} (${formatearMiles(d.precioUnitario)})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ResumenVenta;
