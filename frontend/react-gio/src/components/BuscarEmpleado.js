import React, { useState } from 'react';

function BuscarEmpleado({ onBuscar }) {
  const [id, setId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id.trim() !== '') {
      onBuscar(id);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex mb-4">
      <input
        htmlFor="empleadoId"
        name='empleadoId'
        id="empleadoId"
        type="number"
        className="form-control me-2"
        placeholder="Buscar Empleado por ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <button type="submit" className="btn btn-info">
        Buscar
      </button>
    </form>
  );
}

export default BuscarEmpleado;
