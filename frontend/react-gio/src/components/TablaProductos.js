// src/components/TablaProductos.js
import React from 'react';

function TablaProductos({ productos, onEliminar, onRegistrar, formatearMiles }) {
  return (
    <div className="bg-card-dark shadow-sm p-3 rounded table-responsive">
      <table className="table table-dark table-striped mt-3">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p, i) => (
            <tr key={i}>
              <td>{p.codigoBarras}</td>
              <td>{p.nombreProducto}</td>
              <td>{formatearMiles(p.precioVenta)}</td>
              <td>{p.stock}</td>
              <td>
                <button className="btn btn-sm btn-danger" onClick={() => onEliminar(i)}>X</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="btn btn-success w-100 mt-2" onClick={onRegistrar}>
        Registrar Productos
      </button>
    </div>
  );
}

export default TablaProductos;
