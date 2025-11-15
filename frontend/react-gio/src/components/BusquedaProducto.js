import React, { useState } from 'react';

function BusquedaProducto({ onBuscar }) {
  const [busqueda, setBusqueda] = useState('');

  const handleBuscar = (e) => {
    e.preventDefault();
    if (busqueda.trim()) {
      onBuscar(busqueda.trim());
    }
  };

  return (
    <form onSubmit={handleBuscar} className="row g-2 mb-3">
      <div className="col-md-10">
        <input
          htmlFor='busquedaProducto'
          id='busquedaProducto'
          name='busquedaProducto'
          type="text"
          className="form-control form-control-dark"
          placeholder="ID, código o nombre"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>
      <div className="col-md-2">
        <button type="submit" className="btn btn-primary w-100">Buscar</button>
      </div>
    </form>
  );
}

export default BusquedaProducto;