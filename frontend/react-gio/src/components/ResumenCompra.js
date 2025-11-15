import React from "react";
import { formatearMiles } from "../utils/formato";

function ResumenCompra({ compra }) {
  if (!compra) return null;

  // Formatea los detalles de la compra
  return (
    <div className="alert alert-success mt-3">
      <h5>✅ Compra Registrada con Éxito</h5>
      <hr />
      <p><strong>ID Compra:</strong> {compra.id}</p>
      <p><strong>Fecha:</strong> {new Date(compra.fechaCompra).toLocaleString()}</p>
      <p><strong>Total Compra:</strong> ${formatearMiles(compra.totalCompra)}</p>
      <p><strong>Productos:</strong></p>
      <ul>
        {compra.detalleCompraDtoList.map((d, idx) => (
          <li key={idx}>
            {d.cantidad} x {d.nombreProducto} (${formatearMiles(d.precioUnitario)})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ResumenCompra;