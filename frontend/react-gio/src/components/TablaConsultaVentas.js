import React from "react";

const TablaConsultaVentas = ({
  ventas,
  paginaActual,
  totalPaginas,
  cambiarPagina,
  onSeleccionar,
}) => {
  return (
    <div className="table-responsive">
      <table className="table table-bordered table-dark table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Forma de Pago</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {ventas.length > 0 ? (
            ventas.map((v, i) => (
              <tr key={i}>
                <td>{v.id}</td>
                <td>{new Date(v.fechaVenta).toLocaleDateString()}</td>
                <td>${v.totalVenta}</td>
                <td>{v.formaDePago}</td>
                <td>
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => onSeleccionar(v)}
                  >
                    Ver
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No hay ventas registradas
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ✅ Paginación */}
      <div className="d-flex justify-content-between">
        <button
          className="btn btn-secondary"
          onClick={() => cambiarPagina(paginaActual - 1)}
          disabled={paginaActual <= 0}
        >
          Anterior
        </button>
        <span>
          Página {paginaActual + 1} de {totalPaginas}
        </span>
        <button
          className="btn btn-secondary"
          onClick={() => cambiarPagina(paginaActual + 1)}
          disabled={paginaActual >= totalPaginas - 1}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default TablaConsultaVentas;