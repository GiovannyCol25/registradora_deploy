import React from 'react';

function TablaEmpleados({ empleados, onEliminar }) {
  return (
    <div className="bg-card-dark p-4 rounded shadow-sm text-white mt-4">
      <h5 className="mb-3">📋 Empleados Registrados</h5>

      {empleados.length === 0 ? (
        <p>No hay empleados registrados.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-dark table-bordered table-hover align-middle">
            <thead className="table-light text-dark">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Cargo</th>
                <th>Teléfono</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {empleados.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td>{emp.nombreEmpleado}</td>
                  <td>{emp.cargo}</td>
                  <td>{emp.telefono}</td>
                  <td>{emp.usuario?.login || '-'}</td>
                  <td>{emp.usuario?.rol || '-'}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => onEliminar(emp.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TablaEmpleados;
