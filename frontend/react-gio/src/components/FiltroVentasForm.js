// FiltroVentasForm.js
import React, { useRef } from 'react';

function FiltroVentasForm({ onFiltrar }) {
  const formaPagoRef = useRef();
  const fechaInicioRef = useRef();
  const fechaFinRef = useRef();

  const aplicarFiltro = (e) => {
    e.preventDefault();
    onFiltrar({
      formaPago: formaPagoRef.current.value,
      fechaInicio: fechaInicioRef.current.value,
      fechaFin: fechaFinRef.current.value,
    });
  };

  return (
    <form className="bg-card-dark text-white p-3 mb-3 rounded" onSubmit={aplicarFiltro}>
      <h5>Filtrar Ventas</h5>
      <div className="row g-2">
        <div className="col-md-3">
          <input type="text" ref={formaPagoRef} placeholder="Forma de pago" className="form-control form-control-dark" />
        </div>
        <div className="col-md-3">
          <input type="date" ref={fechaInicioRef} className="form-control form-control-dark" />
        </div>
        <div className="col-md-3">
          <input type="date" ref={fechaFinRef} className="form-control form-control-dark" />
        </div>
        <div className="col-md-3">
          <button type="submit" className="btn btn-primary w-100">Aplicar Filtro</button>
        </div>
      </div>
    </form>
  );
}

export default FiltroVentasForm;
