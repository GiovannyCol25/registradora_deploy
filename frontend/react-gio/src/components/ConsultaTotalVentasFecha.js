import React, { useState } from 'react';

function ConsultaTotalVentasFecha() {
  const [fecha, setFecha] = useState('');
  const [total, setTotal] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const consultarTotal = async () => {
    try {
      const res = await fetch(`http://localhost:8080/ventas/ventas-diarias/total/${fecha}`);
      if (!res.ok) throw new Error('No se encontró información para esta fecha');
      const data = await res.json();
      setTotal(data.totalVentas);
      setMensaje('');
    } catch (error) {
      setMensaje(error.message);
      setTotal(null);
    }
  };

  return (
    <div className="bg-card-dark p-3 rounded text-white shadow-sm">
      <h5>Total de Ventas por Fecha</h5>
      <div className="d-flex gap-2 mb-3">
        <input
          type="date"
          className="form-control form-control-dark"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
        <button className="btn btn-primary" onClick={consultarTotal}>Consultar</button>
      </div>
      {mensaje && <div className="alert alert-warning">{mensaje}</div>}
      {total !== null && (
        <div className="alert alert-success">
          <strong>Total:</strong> ${total.toFixed(2)}
        </div>
      )}
    </div>
  );
}

export default ConsultaTotalVentasFecha;
