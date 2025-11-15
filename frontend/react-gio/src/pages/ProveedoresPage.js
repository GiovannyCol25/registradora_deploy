import React, { useState } from 'react';

import FormularioProveedor from '../components/FormularioProveedor';
import TablaProveedores from '../components/TablaProveedores';

function ProveedoresPage() {
  const [formData, setFormData] = useState({
    id: null,
    razonSocial: '',
    nit: '',
    telefono: '',
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "telefono" ? parseInt(value) || 0 : value,
    }));
  }

  const [mensaje, setMensaje] = useState('');
  const [proveedores, setProveedores] = useState([]);
  const [busquedaProveedor, setBusquedaProveedor] = useState('');
  const API_URL = 'http://localhost:8080/proveedores';

  const registrarProveedor = async () => {
    const {razonSocial, nit, telefono} = formData;
    // validar que los campos no están vacíos
    if(!razonSocial || !nit || !telefono) {
      setMensaje('⚠️ Todos los campos son obligatorios');
      return;
    }

    try{
      const registro = {
        razonSocial: formData.razonSocial,
        nit: formData.nit,
        telefono: formData.telefono
      };

      console.log("Datos actuales del formulario:", formData);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
        // Envía los datos del formulario al servidos
        body: JSON.stringify(registro)
      });

      //Verificar respuesta exitosa
      console.log("datos enviados al servidor: ", registro)
      if(response.ok){
        const data = await response.json();
        console.log("Cliente registrado:", data);
        setMensaje('Proveedor registrado exitosamente');
        setProveedores(prev => [...prev, data]);
        setFormData({
          id: null,
          razonSocial: '',
          nit: '',
          telefono: '',
        });
      }else{
        setMensaje('Error al registrar proveedor');
      }
      
    }catch(error){
      setMensaje('Error al registrar proveedor');
    }
  };

  const consultarProveedor = async () => {
    if(!busquedaProveedor.trim()){
      setMensaje('⚠️ Por favor, ingrese un ID o nombre de Proveedor');
      return;
    }

    const proveedorBuscado = busquedaProveedor.trim(); 
    let url = ''; 

    if(!isNaN(proveedorBuscado)){
      //Buscar por ID
      url = `http://localhost:8080/proveedores/${proveedorBuscado}`;
    } else {
      url = `http://localhost:8080/proveedores/nombre/${proveedorBuscado}`;
    }

    try{
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
      });
      console.log("validar response", response);

      if(!response.ok){
        setMensaje('No se encontraron resultados');
        setProveedores([]);
        return;
      }

      const data = await response.json();

      if (Array.isArray(data)){
        setProveedores(data);
      } else {
        setProveedores([data]); //convierte en Array un objeto
      }

      setMensaje(`✅ Se encontraron ${Array.isArray(data) ? data.length : 1} proveedor(es)`)
      console.log(data);
    } catch(error){
      setMensaje("❌ No se encontró el proveedor");
    }
  };

  // Método para que el botón Agregar envíe los datos 
  // al formulario y limpia la tabla
  const handleEnviar = (proveedor) => {
    setFormData({
      id: proveedor.id,
      razonSocial: proveedor.razonSocial || '',
      nit: proveedor.nit || '',
      telefono: parseInt(proveedor.telefono) || ''
    });
    setBusquedaProveedor(proveedor.id);
  };

  const actualizarProveedor = async () => {
    try {
      console.log("📤 Datos enviados a backend (actualizarProveedor):", formData);
      const response = await fetch(`${API_URL}/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData)
      });
      if(response.ok){
        const data = await response.json();
        console.log("validar envío de datos al backend", data)
        setMensaje('Proveedor actualizado exitosamente');
        setProveedores(prev =>
          prev.map(p => (p.id === data.id ? data : p))
        );

        setFormData({
          id: null,
          razonSocial: '',
          nit: '',
          telefono: '',
        });
      }else{
        setMensaje('Error al actualizar proveedor');
      } 
    }catch(error){
      setMensaje('Error al actualizar proveedor');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto rounded-xl shadow-md space-y-4">
      <h2 className="text-xl text-white font-bold text-black-800">Gestión de Proveedores</h2>

      { /* Componente de formulario para registrar o actualizar proveedores */ }
      <FormularioProveedor
        formData={formData}
        onChange={onChange}
        mensaje={mensaje}
        onRegistrar={registrarProveedor}
        onBuscar={consultarProveedor}
        busquedaProveedor={busquedaProveedor}
        setBusquedaProveedor={setBusquedaProveedor}
        onActualizar={actualizarProveedor}
        //setProveedores{setFormData}
      />

      {/*Tabla para mostrar proveedores registrados*/}
      {proveedores.length > 0 && (
        <TablaProveedores
        proveedores={proveedores}
        enviarEditar={handleEnviar}
        modo="edición" // prop para manejo del botón seleccionar de la tabla
        />
      )}

    </div>
  );
}

export default ProveedoresPage;