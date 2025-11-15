import React, {useState} from "react";
import TablaProveedores from '../TablaProveedores';
import FormularioProveedor from "../FormularioProveedor";

function ConsultaProveedores() {
    const [busquedaProveedor, setBusquedaProveedor] = useState('');
    const [proveedores, setProveedores] = useState([]);
    const [mensaje, setMensaje] = useState('');
    const [formData, setFormData] = useState({ id: '', razonSocial: '', nit: '', telefono: '' });

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

  return (
    <div>
        <h5>Consulta de Proveedores</h5>
        <div className="d-flex gap-2 mb-3">
            <input
                htmlFor="busquedaProveedor"
                name="busquedaProveedor"
                id="busquedaProveedor"
                type="text"
                className="form-control"
                placeholder="Buscar por ID o nombre de Proveedor"
                value={busquedaProveedor}
                onChange={(e) => setBusquedaProveedor(e.target.value)}
            />
            <button className="btn btn-primary" onClick={consultarProveedor}>Buscar</button>
        </div>
        {mensaje && <div className="alert alert-info">{mensaje}</div>}
        {proveedores.length > 0 && (
            <TablaProveedores 
            proveedores={proveedores}
            onSelectProveedor={(proveedor) => {
                setFormData(proveedor);
                setProveedores([]);
            }}
            />
        )}
        {formData.id && (
            <FormularioProveedor
            formData={formData}
            setFormData={setFormData}
            modoEdicion={true}
        />
        )}
        </div>
    );
}

export default ConsultaProveedores;