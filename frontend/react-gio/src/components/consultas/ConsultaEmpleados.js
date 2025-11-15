// src/components/consultas/ConsultaEmpleados.js
import React, { useState } from 'react';
import TablaEmpleados from '../TablaEmpleados';

const ConsultaEmpleados = () => {
  const [empleadoId, setEmpleadoId] = useState('');
  const [empleadoEncontrado, setEmpleadoEncontrado] = useState(null);
  const [empleados, setEmpleados] = useState([]);
  const [mensaje, setMensaje] = useState('');

  const buscarEmpleado = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/empleados/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
      });

      if (!res.ok) throw new Error('Empleado no encontrado');

      const data = await res.json();
      console.log('Empleado encontrado:', data);
      setEmpleadoEncontrado(data);
      setMensaje('');
    } catch (error) {
      setEmpleadoEncontrado(null);
      setMensaje('❌ Empleado no encontrado');
    }
  };

  const listarEmpleados = async () => {
    try {
      const res = await fetch('http://localhost:8080/empleados', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
      });

      if (!res.ok) throw new Error('Error al listar empleados');

      const data = await res.json();
      setEmpleados(data);
      setMensaje('');
    } catch (error) {
      setMensaje('❌ Error al listar empleados');
    }
  };

  return (
    <div>
      <h5>Consulta de Empleados</h5>

      <div className="d-flex gap-2 mb-3">
        <input
          htmlFor="empleadoId"
          name='empleadoId'
          id="empleadoId"
          type="text"
          className="form-control"
          placeholder="ID del empleado"
          value={empleadoId}
          onChange={(e) => setEmpleadoId(e.target.value)}
        />
        <button className="btn btn-primary" onClick={() => buscarEmpleado(empleadoId)}>
          Buscar
        </button>
        <button className="btn btn-secondary" onClick={listarEmpleados}>
          Listar todos
        </button>
      </div>

      {mensaje && <div className="alert alert-warning">{mensaje}</div>}

      {empleadoEncontrado && (
        <div className="alert alert-info">
          <strong>ID:</strong> {empleadoEncontrado.id} <br />
          <strong>Nombre:</strong> {empleadoEncontrado.nombreEmpleado} <br />
          <strong>Cargo:</strong> {empleadoEncontrado.cargo} <br />
          <strong>Teléfono:</strong> {empleadoEncontrado.telefono} <br />
        </div>
      )}

      {empleados.length > 0 && <TablaEmpleados empleados={empleados} />}
    </div>
  );
};

export default ConsultaEmpleados;
