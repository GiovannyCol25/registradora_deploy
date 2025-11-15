import React, { useState } from 'react';

const ConsultaUtilidades = () => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost:8080/ventas/utilidad';

  const fetchUtilidad = async (tipo) => {
    setLoading(true);
    let url = API_URL;

    switch (tipo) {
      case 'rango':
        url += `?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
        break;
      case 'diaria':
        url += `/diaria`;
        break;
      case 'semanal':
        url += `/semanal`;
        break;
      case 'mensual':
        url += `/mensual`;
        break;
      default:
        return;
    }

    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        alert('No autorizado. Por favor, inicia sesión.');
        return;
      }

      const res = await fetch(url, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log(res);

      if (!res.ok) {
        if (res.status === 403) {
          alert('Acceso denegado. No tienes permiso para realizar esta acción.');
      } else {
        alert('Error al consultar utilidad');
        }
        throw new Error('Error en la respuesta del servidor');
      }

      const data = await res.json();
      setResultado(data);
      console.log(data);
    } catch (error) {
      console.error(error);
      alert('Error al consultar utilidad');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card-dark">
      <h4>Consulta de Utilidades</h4>
      <p>Selecciona el tipo de consulta o un rango de fechas para calcular la utilidad.</p>

      {/* Filtro por rango */}
      <div className="d-flex gap-2 mb-3">
        <input
          htmlFor="fechaInicio"
          name='fechaInicio'
          id="fechaInicio"
          type="date"
          className="form-control-dark"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
        />
        <input
          htmlFor="fechaFin"
          name='fechaFin'
          id="fechaFin"
          type="date"
          className="form-control-dark"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
        />
        <button
          className="btn btn-primary"
          onClick={() => fetchUtilidad('rango')}
          disabled={!fechaInicio || !fechaFin || loading}
        >
          {loading ? 'Consultando...' : 'Consultar Rango'}
        </button>
      </div>

      {/* Botones rápidos */}
      <div className="d-flex gap-2 mb-3">
        <button className="btn btn-outline-info" onClick={() => fetchUtilidad('diaria')}>Hoy</button>
        <button className="btn btn-outline-info" onClick={() => fetchUtilidad('semanal')}>Esta Semana</button>
        <button className="btn btn-outline-info" onClick={() => fetchUtilidad('mensual')}>Este Mes</button>
      </div>

      {/* Resultado */}
      {resultado && (
        <div className="card bg-dark text-white p-3 mt-3">
          <h5>Resultado:</h5>
          <p><strong>Periodo:</strong> {resultado.periodo || `${fechaInicio} - ${fechaFin}`}</p>
          <p><strong>Utilidad Total:</strong> ${resultado.totalUtilidad?.toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};

export default ConsultaUtilidades;
