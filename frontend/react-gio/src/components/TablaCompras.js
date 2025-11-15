import React from "react";
import { formatearMiles } from "../utils/formato";

function TablaCompras({ titulo = "Productos", compras, eliminarCompra, resultadosProveedor, index }) {
    /*if (!resultadosProveedor || resultadosProveedor.length === 0) {
        return null; // No muestra nada si no hay resultados
    }*/
    if (!compras || compras.length === 0) {
        return null;
    }

    return (
        <div className="bg-card-dark p-3 rounded text-white mb-4">
        <h5>Productos agregados a la Compra</h5>
        <table className="table table-dark table-striped responsive">
            <thead>
            <tr>
                <th>ID</th>
                <th>Código</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th>Acciones</th>
            </tr>
            </thead>
            <tbody>
            {/* Aquí se renderizarían las compras */}
            {compras.map((compra, index) => (
                <tr key={compra.id}>
                    <td>{compra.id}</td>
                    <td>{compra.codigoBarras}</td>
                    <td>{compra.nombreProducto}</td>
                    <td>${formatearMiles(compra.precioCompra)}</td>
                    <td>{compra.cantidad}</td>
                    <td>${formatearMiles((compra.precioCompra * compra.cantidad).toFixed(2))}</td>
                    <td>
                        <button
                            className="btn btn-sm btn-danger"
                            onClick={() => eliminarCompra(index)}
                        >
                            Eliminar
                        </button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
    }

export default TablaCompras;