import React from 'react';
import FiltroVentasForm from './FiltroVentasForm';

function TablaVentas({ ventas, pagina, totalPaginas, onPaginar, onFiltrar }) {
  return (
    <div className="bg-card-dark p-3 rounded text-white shadow-sm">
      <h5>Ventas</h5>
      <FiltroVentasForm onFiltrar={onFiltrar} />
      <div className="table-responsive">
        <table className="table table-dark table-striped table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th scope='col'>ID</th>
              <th scope='col'>Fecha</th>
              <th scope='col'>Total</th>
              <th scope='col'>Forma de Pago</th>
              <th scope='col'>Detalles</th>
            </tr>
          </thead>
          <tbody>
            {(ventas || []).map((venta) => (
              <tr key={venta.id}>
                <td>{venta.id}</td>
                <td>{new Date(venta.fechaVenta).toLocaleDateString()}</td>
                <td>${venta.totalVenta.toFixed(2)}</td>
                <td>{venta.formaDePago}</td>
                <td style={{ minWidth: '150px' }}>
                  <ul className="mb-0 ps-3">
                    {venta.detalles.map((d, i) => (
                      <li key={i} style={{ whiteSpace: "nowrap" }}>
                        {d.nombreProducto} - Cant: {d.cantidad} - ${d.precioUnitario.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <nav className="mt-3">
        <ul className="pagination justify-content-center">
          {pagina > 0 && (
            <li className="page-item">
              <button className="page-link" onClick={() => onPaginar(pagina - 1)}>Anterior</button>
            </li>
          )}
          {[...Array(totalPaginas)].map((_, i) => (
            <li key={i} className={`page-item ${i === pagina ? 'active' : ''}`}>
              <button className="page-link" onClick={() => onPaginar(i)}>{i + 1}</button>
            </li>
          ))}
          {pagina < totalPaginas - 1 && (
            <li className="page-item">
              <button className="page-link" onClick={() => onPaginar(pagina + 1)}>Siguiente</button>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}

export default TablaVentas;
