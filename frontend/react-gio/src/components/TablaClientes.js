import React from "react";

function TablaClientes({ clientes, eliminarCliente, editarCliente, registrarCliente, onRegistrar }) {
    return (
        <div className="bg-card-dark shadow-sm p-3 rounded table-responsive">
            <table className="table table-dark table-striped mt-3">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Teléfono</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Asegúrate de que 'clientes' es un array y no undefined*/}
                    {Array.isArray(clientes) && clientes.length > 0 ? (
                        clientes.map((c) => (
                            <tr key={c.id}>
                                <td>{c.id}</td>
                                <td>{c.nombre}</td>
                                <td>{c.telefono}</td>
                                <td>
                                    <button 
                                        className="btn btn-primary ms-2"
                                        onClick={() => editarCliente(c)}
                                        >
                                            Seleccionar
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => eliminarCliente(c.id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">No hay clientes registrados.</td>
                        </tr>
                    )
                    }
                    </tbody>
                </table>
            </div>
        );
}

export default TablaClientes;