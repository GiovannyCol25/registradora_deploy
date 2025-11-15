import React, {useState}  from "react";
import TablaClientes from '../TablaClientes';
import FormularioClientes from "../FormularioClientes";

const API_URL = 'http://localhost:8080/clientes';

const ConsultaClientes = () => {
    const [busqueda, setBusqueda] = useState('');
    const [clientes, setClientes] = useState([]);
    const [mensaje, setMensaje] = useState('');
    const [formData, setFormData] = useState({ id: '', nombre: '', telefono: '' });

    const buscarCliente = async () => {

    if (!busqueda.trim()) {
        setMensaje('⚠️ Por favor, ingrese un ID o nombre para buscar');
        return;
        }

    const opcionBusqueda = busqueda.trim();
    const esId = !isNaN(opcionBusqueda) && opcionBusqueda.length <= 6;
    const url = esId 
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
        setMensaje('❌ No se encontraron clientes');
        setClientes([]);
        setFormData({ id: '', nombre: '', telefono: '' });
        return;
      }

      const data = await response.json();

      if (esId) {
        setFormData({
          id: data.id,
          nombre: data.nombre,
          telefono: data.telefono,
        });
        setClientes([]);
        setMensaje(`🔍 Cliente encontrado: ${data.nombre}`);
      } else {
        if (Array.isArray(data) && data.length > 0) {
          setClientes(data);
          setFormData({ id: '', nombre: '', telefono: '' });
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
      setFormData({ id: '', nombre: '', telefono: '' });
    }
  };

  return (
    <div>
      <h5>Consulta de Clientes</h5>

      <div className="d-flex gap-2 mb-3">
        <input
          htmlFor="busqueda"
          name="busqueda"
          id="busqueda"
          type="text"
          className="form-control"
          placeholder="Buscar por ID o nombre"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button className="btn btn-primary" onClick={buscarCliente}>
          Buscar
        </button>
      </div>

      {mensaje && <div className="alert alert-info">{mensaje}</div>}

      {formData.id && (
        <div className="mb-3">
          <FormularioClientes
            formData={formData}
            setFormData={setFormData}
            modoEdicion={true}
          />
        </div>
      )}

      {/* Tabla de clientes encontrados */}
      {clientes.length > 0 && (
        <TablaClientes
          clientes={clientes}
          onSelectCliente={(cliente) => {
            setFormData(cliente);
            setClientes([]);
          }}
        />
      )}
    </div>
  );
};

export default ConsultaClientes;