import React from 'react';

function TablaVentasPorProducto({ ventas }) {
  let total = ventas.reduce((acc, v) => acc + (v.precioUnitario * v.cantidad), 0);

  return (
    <div className="bg-card-dark p-3 rounded text-white mb-4 table-responsive shadow-sm">
      <h5>Ventas por Producto</h5>
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
              <td>${(v.cantidad * v.precioUnitario).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h6 className="mt-3">Total vendido hoy: <strong>${total.toFixed(2)}</strong></h6>
    </div>
  );
}

export default TablaVentasPorProducto;
