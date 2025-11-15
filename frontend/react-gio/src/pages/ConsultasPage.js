import React, { useState } from 'react';

// Importa el componente que se mostrará en la pestaña de empleados
import ConsultaEmpleados from '../components/consultas/ConsultaEmpleados';
import ConsultaClientes from '../components/consultas/ConsultaClientes';
import ConsultaProveedores from '../components/consultas/ConsultaProveedores';
import ConsultaProductos from '../components/consultas/ConsultaProductos';
import ConsultaVentas from '../components/consultas/ConsultaVentas';
import ConsultaCompras from '../components/consultas/ConsultaCompras';
import ConsultaUtilidades from '../components/consultas/ConsultaUtilidades';

const ConsultasPage = () => {
  const [tabSeleccionada, setTabSeleccionada] = useState('empleados'); // Por ahora solo una pestaña

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Consultas del Sistema</h2>

      {/* Navegación de pestañas */}
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={`nav-link ${tabSeleccionada === 'empleados' ? 'active' : ''}`}
            onClick={() => setTabSeleccionada('empleados')}
          >
            Empleados
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${tabSeleccionada === 'clientes' ? 'active' : ''}`}
            onClick={() => setTabSeleccionada('clientes')}
          >
            Clientes
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${tabSeleccionada === 'proveedores' ? 'active' : ''}`}
            onClick={() => setTabSeleccionada('proveedores')}
          >
            Proveedores
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${tabSeleccionada === 'productos' ? 'active' : ''}`}
            onClick={() => setTabSeleccionada('productos')}
          >
            Productos 
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${tabSeleccionada === 'ventas' ? 'active' : ''}`}
            onClick={() => setTabSeleccionada('ventas')}
          >
            Ventas
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${tabSeleccionada === 'compras' ? 'active' : ''}`}
            onClick={() => setTabSeleccionada('compras')}
          >
            Compras
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${tabSeleccionada === 'utilidades' ? 'active' : ''}`}
            onClick={() => setTabSeleccionada('utilidades')}
          >
            Utilidades
          </button>
        </li>
      </ul>
      
      {/* Contenido de cada tab */}
      <div className="mt-4">
        {tabSeleccionada === 'empleados' && <ConsultaEmpleados />}
        {/* Agrega aquí más condiciones para futuras pestañas */}
      </div>
      <div className="mt-4">
        {tabSeleccionada === 'clientes' && <ConsultaClientes />}
      </div>
      <div className="mt-4">
        {tabSeleccionada === 'proveedores' && <ConsultaProveedores />}
      </div>
      <div className="mt-4">
        {tabSeleccionada === 'productos' && <ConsultaProductos />} 
      </div>
      <div className="mt-4">
        {tabSeleccionada === 'ventas' && <ConsultaVentas />}
      </div>
      <div className="mt-4">
        {tabSeleccionada === 'compras' && <ConsultaCompras />}
      </div>
      <div className="mt-4">
        {tabSeleccionada === 'utilidades' && <ConsultaUtilidades />}
      </div>
    </div>
  );
};

export default ConsultasPage;