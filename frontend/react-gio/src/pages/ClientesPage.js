import React, { useState } from 'react';
import TablaClientes from '../components/TablaClientes';
import FormularioClientes from '../components/FormularioClientes';

function ClientesPage() {
  // Estado para manejar los datos del formulario, búsqueda, mensaje y clientes
  const [formData, setFormData] = useState({
    id: null,
    nombre: '',
    telefono: ''
  });

  // Lista temporal de clientes agregados
  const [clientesAgregados, setClientesAgregados] = useState([]);

  // Maneja cambios en el formulario
  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const [busqueda, setBusqueda] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [clientes, setClientes] = useState([]);

  const API_URL = 'http://localhost:8080/clientes'; 

  // Maneja el cambio en el campo de búsqueda
  const registrarCliente = async () => {

    const { nombre, telefono } = formData;
    // Validar que los campos no estén vacíos
    if (!nombre || !telefono) {
      setMensaje('⚠️ Todos los campos son obligatorios');
      return;
    }
    // Validar que el teléfono tenga 10 dígitos
    if (telefono.length !== 10 || isNaN(telefono)) {
      setMensaje('⚠️ El teléfono debe tener 10 dígitos');
      return;
    }

    try {
      // Preparar los datos del formulario
      const registro = {
        nombre: formData.nombre,
        telefono: formData.telefono
      };

      // Validar que los campos no estén vacíos
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
        // Enviar los datos del formulario al servidor
        body: JSON.stringify(registro)
      });

      // Verificar si la respuesta es exitosa
      if (response.ok) {
        const data = await response.json();
        console.log('Cliente registrado:', data);
        setClientes((prevClientes) => [...prevClientes, data]); // Agregar el nuevo cliente a la lista
        setMensaje('Cliente registrado exitosamente');
        setFormData({ id: null, nombre: '', telefono: '' });
      } else {
        setMensaje('Error al registrar cliente');
      }

      // Limpiar el campo de búsqueda
    } catch (error) {
      console.error('Error al registrar cliente:', error);
      setMensaje('Error al registrar cliente');
    }
  };

  // Maneja el cambio en el campo de búsqueda
  const buscarCliente = async () => {
    if (!busqueda.trim()) {
      setMensaje('⚠️ Por favor, ingrese un ID o nombre para buscar');
      return;
    }

    const opcionBusqueda = busqueda.trim();
    let url = '';

    const esId = !isNaN(opcionBusqueda) && opcionBusqueda.length <= 6;
    url = esId 
    ? `${API_URL}/${opcionBusqueda}` 
    : `${API_URL}/nombre/${opcionBusqueda}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        setMensaje('No se encontraron clientes');
        setClientes([]);
        return;
      }

      const data = await response.json();
      console.log('Datos obtenidos:', data);
      console.log('Respuesta del servidor:', response);
      // Verificar si la respuesta es exitosa
      
      if (esId){
        setFormData({
          id: data.id,
          nombre: data.nombre,
          telefono: data.telefono
        });
        setClientes([]);
        setMensaje(`🔍 Cliente encontrado: ${data.nombre}`);
      } else {
        if (Array.isArray(data) && data.length > 0) {
          setClientes(data);
          setMensaje(`🔍 Se encontraron ${data.length} clientes con el nombre "${opcionBusqueda}"`);
        } else {
          setClientes([]);
          setMensaje('❌ No se encontraron resultados');
        }
      }
    } catch (error) {
      console.error('Error al buscar cliente:', error);
      setMensaje('❌ Error al buscar cliente');
      setClientes([]);
    }
  };

  const actualizarCliente = async () => {
    try {
      const response = await fetch(`${API_URL}/${busqueda}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData)
      });
      // Verificar si la respuesta es exitosa
      if (response.ok) {
        const data = await response.json();
        console.log('Cliente actualizado:', data);
        // Actualizar el cliente en la lista de clientes
        setClientes((prevClientes) => [...prevClientes, data]);
        setMensaje('Cliente actualizado exitosamente');
        setFormData({ id: null, nombre: '', telefono: '' });
      } else {
        setMensaje('❌ Error al actualizar cliente');
      }
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      setMensaje('❌ Error al actualizar cliente');
    }
  };  

  const eliminarCliente = async (e) => {
    try {
      await fetch(`${API_URL}/${busqueda}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
      });
      setMensaje('Cliente eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      setMensaje('❌ Error al eliminar cliente');
    }
  };
  
  const handleEditar = (cliente) => {
    setFormData({
      id: cliente.id,
      nombre: cliente.nombre,
      telefono: String(cliente.telefono)
    });
    setBusqueda(cliente.id); // Actualiza el campo de búsqueda con el ID del cliente
    setClientes([]);  
  }

  // Agrega cliente a la lista temporal
  const agregarCliente = () => {
    if (!formData.nombre || !formData.telefono) {
      setMensaje('⚠️ Todos los campos son obligatorios');
      return;
    }
    if (formData.telefono.length !== 10 || isNaN(formData.telefono)) {
      setMensaje('⚠️ El teléfono debe tener 10 dígitos');
      return;
    }
    setClientesAgregados(prev => [
      ...prev,
      { ...formData, id: Date.now() } // id temporal
    ]);
    setFormData({ id: null, nombre: '', telefono: '' });
    setMensaje('Cliente agregado a la lista temporal');
  };

  // Envía todos los clientes agregados al backend
  const registrarClientes = async () => {
    try {
      // Aquí puedes hacer un fetch para enviar todos los clientes agregados
      // Ejemplo:
      // await fetch(API_URL, { method: 'POST', body: JSON.stringify(clientesAgregados) });
      setMensaje('Clientes registrados exitosamente');
      setClientesAgregados([]);
    } catch (error) {
      setMensaje('Error al registrar clientes');
    }
  };
  
  return (
    <div className="p-4 max-w-md mx-auto rounded-xl shadow-md space-y-4">
      <h2 className="text-xl text-withe font-bold text-black-800">Gestión de Clientes</h2>

      {/* Componente de formulario para registrar o actualizar clientes */}
      <FormularioClientes
        formData={formData}
        onChange={onChange}
        onRegistrar={registrarCliente}
        onBuscar={buscarCliente}
        onActualizar={actualizarCliente}
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        mensaje={mensaje}
        setMensaje={setMensaje}
        onAgregar={agregarCliente}
      />

      {/* Tabla para mostrar los clientes registrados */}
      {clientes.length > 0 && (
        <TablaClientes
        clientes={clientes}
        eliminarCliente={eliminarCliente}
        editarCliente={handleEditar}
        registrarCliente={registrarCliente}
        onRegistrar={buscarCliente}
        />
      )}

      {/* Tabla temporal de clientes agregados */}
      {/*Bloque para el renderizado */}
      {clientesAgregados.length > 0 && (
        <TablaClientes
          clientes={clientesAgregados}
          eliminarCliente={eliminarCliente}
          editarCliente={handleEditar}
        />
      )}

      {/* Botón para registrar todos los clientes agregados */}
      {clientesAgregados.length > 0 && (
        <button className="btn btn-success w-100 mt-3" onClick={registrarClientes}>
          Registrar todos los clientes
        </button>
      )}
      {/* Mensaje de estado */}
      {mensaje && <div className="text-center text-info mt-3">{mensaje}</div>}
    </div>
  );
}
export default ClientesPage;
