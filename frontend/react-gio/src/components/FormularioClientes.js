import React from "react";

function FormularioClientes({ formData, onChange, onRegistrar, onBuscar, onActualizar, busqueda, setBusqueda, setCliente, mensaje, onAgregar, handleChange }) {  
    return (
        // Componente de formulario para gestionar clientes
        <form className="bg-card-dark shadow-sm p-3 rounded mb-4">
            {/*Campo para el nombre del cliente*/}
            <div className="mb-3">
                <label htmlFor="busqueda" className="form-label text-white">Buscar Cliente</label>
                <input
                    type="text"
                    placeholder="Buscar cliente por ID o nombre"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="form-control form-control-dark"
                    name="busqueda"
                    id="busqueda"
                />
                <button
                    type="button"
                    onClick={onBuscar}
                    className="btn btn-primary mt-2">
                    Buscar Cliente
                </button>
            </div>
            {/*Formulario para registrar o actualizar un cliente*/}
            <div className="mb-3">
                <label htmlFor="nombre" className="form-label text-white">Registrar Cliente</label>
                <input
                    type="text"
                    name="nombre"
                    id="nombre"
                    placeholder="Ingrese el nombre del cliente"
                    value={formData.nombre}
                    onChange={onChange}
                    className="form-control form-control-dark"
                    autoFocus
                />
            </div>

            {/*Campo para el teléfono del cliente*/}
            <div className="mb-3">
                <label htmlFor="telefono" className="form-label text-white">Teléfono</label>
                <input
                    type="telefono"
                    name="telefono"
                    id="telefono"
                    placeholder="Ingrese el teléfono del cliente"
                    value={formData.telefono || ''}
                    onChange={onChange}
                    className="form-control form-control-dark text-blue"
                />
            </div>

            <div className="mb-3">
                <button type="button" className="btn btn-success" onClick={onAgregar}>Agregar</button>
                <button type="button" className="btn btn-info ms-2" onClick={onActualizar}>Actualizar</button>
                <button type="button" className="btn btn-primary ms-2" onClick={onRegistrar}>Registrar</button>
            </div>
            {mensaje && <div className="text-blue-600 font-medium">{mensaje}</div>}
        </form>        
  );
}
export default FormularioClientes;