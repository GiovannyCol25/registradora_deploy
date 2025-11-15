// src/components/TablaProductosRegistrados.js
import React from 'react';

function TablaProductosRegistrados({ productos, formatearMiles }) {
  return (
    <div className="mt-5 table-responsive">
      <h4 className="text-white text-center">Productos Registrados</h4>
      <table className="table table-light table-striped mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Código</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.codigoBarras}</td>
              <td>{p.nombreProducto}</td>
              <td>{formatearMiles(p.precioVenta)}</td>
              <td>{p.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaProductosRegistrados;
