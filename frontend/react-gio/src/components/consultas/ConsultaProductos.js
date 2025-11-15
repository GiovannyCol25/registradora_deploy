import React, {useState} from "react";
//import TablaProductos from '../TablaProductos';
import FormularioProducto from "../FormularioProducto";
import TablaProductosRegistrados from "../TablaProductosRegistrados";

const ConsultaProductos = () => {
    const [producto, setProducto] = useState({ codigoBarras: '', nombreProducto: '', precioVenta: '' });
    const [mensaje, setMensaje] = useState('');
    const [criterioBusqueda, setCriterioBusqueda] = useState('');
    const [resultadosBusqueda, setResultadosBusqueda] = useState([]);

    const buscarProductos = async () => {
        if (!criterioBusqueda.trim()) {
        setMensaje('⚠️ Ingresa un criterio de búsqueda');
        return;
        }

        const criterio = criterioBusqueda.trim();

        let url = "";
        //Busca por ID si es un número entero corto
        if (!isNaN(criterio) && criterio.length <= 6) {
        url = `http://localhost:8080/productos/${criterio}`;
        }
        //Buscar por código de barras si es un número largo
        else if (!isNaN(criterio) && criterio.length > 6) {
        url = `http://localhost:8080/productos/codigoBarras/${criterio}`;
        }
        //Buscar por nombre si es una cadena de texto
        else {
        url = `http://localhost:8080/productos/nombre/${criterio}`;
        }

        try {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            },
        });

        if (!res.ok) throw new Error('Error al buscar productos');

        const data = await res.json();
        //Si es un Array de la búsqueda por nombre muestra tabla de selección
        if (Array.isArray(data)) {
            setResultadosBusqueda(data);
            setMensaje(`🔍 ${data.length} resultado(s) encontrado(s)`);
        }else {
        setProducto(data); // Actualiza el producto con los datos obtenidos
        setMensaje(`🔍 Producto encontrado:`);
        setResultadosBusqueda([]);
        //setMensaje(`🔍 ${data.length} resultado(s) encontrado(s)`);
        }
        } catch (error) {
        setMensaje('❌ Error en la búsqueda de productos');
        console.error(error);
        setProducto({ codigoBarras: '', nombreProducto: '', precioVenta: '' });
        setResultadosBusqueda([]); // Limpia los resultados de búsqueda
        }
    };

    return (
        <div>
            <h5>Consulta de Productos</h5>

            <div className="d-flex gap-2 mb-3">
                <input
                    htmlFor="criterioBusqueda"
                    name='criterioBusqueda'
                    id="criterioBusqueda"
                    type="text"
                    className="form-control"
                    placeholder="Buscar por ID, código de barras o nombre"
                    value={criterioBusqueda}
                    onChange={(e) => setCriterioBusqueda(e.target.value)}
                />
                <button className="btn btn-primary" onClick={buscarProductos}>
                    Buscar
                </button>
                </div>

                {mensaje && <div className="alert alert-warning">{mensaje}</div>}

                {producto.id && (
                    <div className="mb-3">
                        <FormularioProducto
                            producto={producto}
                            setProducto={setProducto}
                            modoEdicion={true}
                            />
                    </div>
                )}
                {resultadosBusqueda.length > 0 && (
                    <TablaProductosRegistrados
                    productos={resultadosBusqueda} 
                    formatearMiles={(num) => new Intl.NumberFormat().format(num)}
                    onSelectProducto={(producto) => {
                        setProducto(producto);
                        setProducto([]);
                    }}
                    />
                )}
            </div>
    );
}

export default ConsultaProductos;