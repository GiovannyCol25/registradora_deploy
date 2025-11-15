import React, { useState } from 'react';
import FormularioEmpleado from '../components/FormularioEmpleado'; // Componente para el formulario de empleados
import TablaEmpleados from '../components/TablaEmpleados'; // Componente para mostrar la tabla de empleados
import BuscarEmpleado from '../components/BuscarEmpleado'; // Componente para buscar empleados

//const token = sessionStorage.getItem('token'); // Obtiene el token de sesión del almacenamiento local

function EmpleadosPage() {
  // Estado para manejar los datos del empleado actual en el formulario
  const [empleado, setEmpleado] = useState({
    nombreEmpleado: '',
    cargo: '',
    telefono: '',
    usuario: {
      login: '',
      clave: '',
      rol: 'EMPLEADO',
    },
  });

  // Estado para manejar mensajes de éxito o error
  const [mensaje, setMensaje] = useState('');

  // Estado para manejar la lista de empleados obtenida del servidor
  const [empleados, setEmpleados] = useState([]);

  // Estado para manejar el resultado de una búsqueda de empleado
  const [empleadoEncontrado, setEmpleadoEncontrado] = useState(null);

  // Función para manejar los cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Si el campo pertenece al objeto `usuario`, actualiza esa parte del estado
    if (['login', 'clave', 'rol'].includes(name)) {
      setEmpleado({
        ...empleado,
        usuario: { ...empleado.usuario, [name]: value },
      });
    } else {
      // Si no, actualiza directamente el estado del empleado
      setEmpleado({ ...empleado, [name]: value });
    }
  };

  // Función para registrar un nuevo empleado
  const registrarEmpleado = async (e) => {
    e.preventDefault();

    const { nombreEmpleado, cargo, telefono, usuario } = empleado;

    // Validación: Verifica que todos los campos estén llenos
    if (!nombreEmpleado || !cargo || !telefono || !usuario.login || !usuario.clave || !usuario.rol) {
      setMensaje('⚠️ Todos los campos son obligatorios');
      return;
    }

    try {
      // Realiza una solicitud POST al servidor para registrar el empleado
      const res = await fetch('http://localhost:8080/empleados', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify(empleado),
      });

      if (!res.ok) throw new Error('Error al registrar el empleado');

      const data = await res.json();

      // Muestra un mensaje de éxito y limpia el formulario
      setMensaje(`✅ Empleado registrado:\n🆔 ID: ${data.id}\n👤 Nombre: ${data.nombreEmpleado}`);
      setEmpleado({
        nombreEmpleado: '',
        cargo: '',
        telefono: '',
        usuario: { login: '', clave: '', rol: 'EMPLEADO' },
      });

      // Actualiza la lista de empleados
      listarEmpleados();
    } catch (error) {
      console.error('Error:', error);
      setMensaje('❌ Error al guardar el empleado');
    }
  };

  // Función para obtener la lista de empleados del servidor
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
    } catch (error) {
      console.error('Error al listar empleados:', error);
      setMensaje('❌ Error al listar empleados');
    }
  };

  // Función para eliminar un empleado por su ID
  const eliminarEmpleado = async (id) => {
    if (!id) {
      console.error('No se encontró ID de empleado para eliminar');
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/empleados/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
      });

      if (res.ok) {
        alert('Empleado eliminado correctamente');
        listarEmpleados(); // Actualiza la lista de empleados
      } else {
        alert('Error al eliminar empleado');
      }
    } catch (error) {
      console.error('Error al eliminar empleado:', error);
    }
  };

  // Función para buscar un empleado por su ID
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
      console.log('Empleado encontrado:', data); // Verifica el empleado encontrado
      setEmpleado(data); // 🔁 ← Aquí cargamos directamente en el formulario
      setEmpleadoEncontrado(data); // Actualiza el estado con el empleado encontrado
    } catch (error) {
      console.error('Error al buscar empleado:', error);
      setEmpleadoEncontrado(null); // Limpia el estado si no se encuentra el empleado
      setMensaje("❌ No se encontró el empleado con ese ID");
    }
  };

  const actualizarEmpleado = async () => {
    try {

      if (!empleado.id) {
        setMensaje("❌ No se puede actualizar sin un ID de empleado.");
        return;
      } // Verifica que el ID del empleado esté presente

      console.log('Empleado a actualizar:', empleado); // Verifica el empleado que se va a actualizar
      const res = await fetch(`http://localhost:8080/empleados/${empleado.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,

        },
        body: JSON.stringify(empleado),
      });
  
      if (!res.ok) throw new Error('Error al actualizar');
  
      const data = await res.json();
      console.log('Empleado actualizado:', data); // Verifica el empleado actualizado
      // Muestra un mensaje de éxito y limpia el formulario
      setMensaje(`✅ Empleado actualizado correctamente:\n🆔 ${data.id}\n👤 ${data.nombreEmpleado}`);
      
      // Limpia el formulario después de actualizar
      setEmpleadoEncontrado(null);
      listarEmpleados();

    } catch (error) {
      console.error('Error al actualizar:', error);
      setMensaje("❌ Error al actualizar el empleado");
    }
  };  

  return (
    <div className="container mt-4">
      {/* Título de la página */}
      <h4 className="text-white text-center mb-4">Registro de Empleados y Usuarios</h4>
      
        <div className="col-md-6 mb-4">
          
          {/* Formulario para registrar empleados */}
          <FormularioEmpleado
            empleado={empleado}
            onChange={handleChange}
            onSubmit={registrarEmpleado}
            onEliminar={eliminarEmpleado}
            onActualizar={actualizarEmpleado}
          />

          {/* Mensaje de éxito o error */}
          {mensaje && (
            <div className="alert alert-info text-center mt-3">
              {mensaje}
            </div>
          )}

          {/* Componente para buscar empleados */}
          <BuscarEmpleado onBuscar={buscarEmpleado} />
          </div>

        <div className="col-md-6">
          {/* Muestra los datos del empleado encontrado */}
          {empleadoEncontrado && (
            <div className="alert alert-success mt-3">
              <h5>Empleado Encontrado:</h5>
              <p>🆔 ID: {empleadoEncontrado.id}</p>
              <p>👤 Nombre: {empleadoEncontrado.nombreEmpleado}</p>
              <p>📞 Teléfono: {empleadoEncontrado.telefono}</p>
              <p>🧰 Cargo: {empleadoEncontrado.cargo}</p>
            </div>
          )}

          <div className="text-center mt-4">
            <button className="btn btn-outline-light" onClick={listarEmpleados}>
              📋 Listar Empleados
            </button>
          </div>


          {/* Tabla para mostrar la lista de empleados */}
          <TablaEmpleados 
          empleados={empleados} 
          onEliminar={eliminarEmpleado} />
          </div>
        </div>
    
  );
}

export default EmpleadosPage; // Exporta el componente para su uso en otras partes de la aplicación