import React from "react";

function FormularioProveedor({formData, onChange, mensaje, onBuscar, setBusquedaProveedor, onAgregar, busquedaProveedor, onActualizar, onRegistrar}) {
    return (
        // Componente de formulario para gestionar proveedores
        <form className="bg-card-dark shadow-sm p-3 rounded mb-4">

            {/*Campo para el ID del proveedor*/}
            <div className="mb-3">
                <label htmlFor="busquedaProveedor" className="form-label text-white">Buscar Proveedor</label>
                <input
                    type="text"
                    placeholder="Buscar Proveedor por ID o Nombre"
                    value={busquedaProveedor}
                    onChange={(e) => setBusquedaProveedor(e.target.value)}
                    className="form-control form-control-dark"
                    name="busquedaProveedor"
                    id="busquedaProveedor"
                />
                <button
                    type="button"
                    onClick={onBuscar}
                    className="btn btn-primary mt-2">
                    Buscar Proveedor
                </button>
            </div>

            {/*Campo para razon social del proveedor*/}
            <div className="mb-3">
                <label htmlFor="razonSocial" className="form-label text-blue">Razón Social del Proveedor</label>
                <input
                    type="text"
                    name="razonSocial"
                    id="razonSocial"
                    placeholder="Ingrese la Razón Social del proveedor"
                    value={formData.razonSocial || ''}
                    onChange={onChange}
                    className="form-control form-control-dark text-blue"
                    autoFocus
                />
            </div>

            {/*Campo para el NIT del proveedor*/}
            <div className="mb-3">
                <label htmlFor="nit" className="form-label text-white">NIT</label>
                <input
                    type="text"
                    name="nit"
                    id="nit"
                    placeholder="Ingrese el NIT del proveedor"
                    value={formData.nit || ''}
                    onChange={onChange}
                    className="form-control form-control-dark text-blue"
                />
            </div>
            {/*Campo para el teléfono del proveedor*/}
            <div className="mb-3">
                <label htmlFor="telefono" className="form-label text-blue">Teléfono</label>
                <input
                    type="Number"
                    name="telefono"
                    id="telefono"
                    placeholder="Ingrese el teléfono del proveedor"
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
    )
}

export default FormularioProveedor;