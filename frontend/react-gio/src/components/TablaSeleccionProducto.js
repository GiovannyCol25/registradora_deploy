// src/components/TablaVentasPorProducto.js
import React from 'react';

function TablaVentasPorProducto({ ventas }) {
  const total = ventas.reduce((acc, venta) => acc + (venta.precioUnitario * venta.cantidad), 0);

  return (
    <div className="bg-card-dark p-3 rounded text-white mb-4">
      <h5 className="mb-3">Ventas por Producto</h5>
      <table className="table table-striped table-dark">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>ID</th>
            <th>Fecha</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((v, i) => (
            <tr key={i}>
              <td>{v.nombreProducto}</td>
              <td>{v.cantidad}</td>
              <td>${v.precioUnitario.toFixed(2)}</td>
              <td>{v.id}</td>
              <td>{new Date(v.fechaVenta).toLocaleDateString()}</td>
              <td>${(v.precioUnitario * v.cantidad).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h6 className="mt-3">
        Total vendido hoy: <strong>${total.toFixed(2)}</strong>
      </h6>
    </div>
  );
}

export default TablaVentasPorProducto;
