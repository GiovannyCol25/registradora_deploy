import React from 'react';
import { formatearMiles } from '../utils/formato';

const TablaListadoCompras = ({ compras = [] }) => {
  if (!Array.isArray(compras)) {
    console.warn("Prop 'compras' es undefined o no es un array:", compras);
    return <p>No hay compras para mostrar.</p>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Factura</th>
            <th>Proveedor ID</th>
            <th>Detalles</th>
          </tr>
        </thead>
        <tbody>
           {compras.map((compra) => (
            <tr key={compra.id}>
              <td>{compra.id}</td>
              <td>{new Date(compra.fechaCompra).toLocaleDateString()}</td>
              <td>{compra.totalCompra}</td>
              <td>{compra.numeroFactura}</td>
              <td>{compra.proveedorId}</td>
              <td>
                <ul>
                  {(compra.detalleCompraDtoList || []).map((detalle, i) => (
                    <li key={detalle.id}>
                      {detalle.nombreProducto} x{detalle.cantidad} @ ${formatearMiles(detalle.precioUnitario)}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaListadoCompras;