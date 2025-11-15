import React from "react";

function TablaProveedores({ proveedores, eliminarProveedor, enviarEditar, modo = "edicion" }){

    if (!proveedores || proveedores.length === 0) {
        return null; // No renderiza nada si no hay resultados
    }

    return (
        <div className="bg-card-dark shadow-sm p-3 rounded">
            <table className="table table-dark table-striped mt-3">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Razon Social</th>
                        <th>NIT</th>
                        <th>Telefono</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(proveedores) && proveedores.length > 0 ?(
                        proveedores.map((p) => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td>{p.razonSocial}</td>
                                <td>{p.nit}</td>
                                <td>{p.telefono}</td>
                                <td>
                                    <button 
                                        className="btn btn-primary ms-2"
                                        onClick={() => enviarEditar(p)}
                                        >
                                            {modo === "compra" ? "Seleccionar" : "Editar"}
                                    </button>
                                    {modo === "edicion" && (
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => eliminarProveedor(p.id)}
                                    >
                                        Eliminar
                                    </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    ):(
                        <tr>
                            <td colSpan="4" className="text-center">No hay clientes registrados.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default TablaProveedores;