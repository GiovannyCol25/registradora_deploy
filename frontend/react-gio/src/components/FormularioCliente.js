// src/components/FormularioCliente.js
import React from 'react';

function FormularioCliente({ cliente, onChange, onSubmit }) {
  return (
    <form
      className="bg-card-dark shadow-sm p-4 rounded mb-3"
      onSubmit={onSubmit}
    >
      <div className="mb-3">
        <label htmlFor='nombre' className="form-label text-white">Nombre del Cliente</label>
        <input
          type="text"
          name="nombre"
          id="nombre"
          value={cliente.nombre}
          onChange={onChange}
          className="form-control form-control-dark"
          placeholder="Ingresar nombre del cliente"
        />
      </div>

      <div className="mb-4">
        <label htmlFor='telefono' className="form-label text-white">Número de Teléfono</label>
        <input
          type="number"
          name="telefono"
          id="telefono"
          value={cliente.telefono}
          onChange={onChange}
          className="form-control form-control-dark"
          placeholder="Ingresar número de teléfono"
        />
      </div>

      <button type="submit" className="btn btn-primary w-100">
        Registrar
      </button>
    </form>
  );
}

export default FormularioCliente;
