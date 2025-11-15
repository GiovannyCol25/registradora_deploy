import React  from "react";
import TablaCompras from "../components/TablaCompras";
import FormularioCompras from "../components/FormularioCompras";
import ResumenCompra from "../components/ResumenCompra";
import { formatearMiles } from "../utils/formato";
import TablaProveedores from "../components/TablaProveedores";

function ComprasPage() {
    const [producto, setProducto] = React.useState({
        id: '',
        nombreProducto: '',
        codigoBarras: '',
        precioCompra: 0,
        cantidad: 1,
    });

    const [criterioBusqueda, setCriterioBusqueda] = React.useState('');
    const [mensaje, setMensaje] = React.useState('');
    const [totalCompra, setTotalCompra] = React.useState(0);
    //const [productos, setProductos] = React.useState([]);
    const [resultadosBusqueda, setResultadosBusqueda] = React.useState([]);
    const [productosAgregados, setProductosAgregados] = React.useState([]);
    // Actualiza el total de la compra cuando cambian los productos agregados
    React.useEffect(() => {
      const total = productosAgregados.reduce((acum, prod) => {
        return acum + (prod.precioCompra * prod.cantidad);
      }, 0);
      setTotalCompra(total);
    }, [productosAgregados]);
    const [compraConfirmada, setCompraConfirmada] = React.useState(null);
    const [criterioProveedor, setCriterioProveedor] = React.useState('');
    const [proveedor, setProveedor] = React.useState(null);
    const [resultadosProveedor, setResultadosProveedor] = React.useState([]);
    const [numeroFactura, setNumeroFactura] = React.useState('');
 
    const handleEnviar = (proveedor) => {
        setProveedor({
            id: proveedor.id,
            rezonSocial: proveedor.razonSocial || '',
            nit: proveedor.nit || '',
            telefono: parseInt(proveedor.telefono) || ''
        });
        setResultadosProveedor([proveedor]);
        setMensaje(`✅ Proveedor seleccionado: ${proveedor.razonSocial}`);
    };

    const consultarProveedor = async () => {
        if (!criterioProveedor.trim()) {
            setMensaje("⚠️ Debes ingresar un criterio de búsqueda válido");
            return;
        }
        const criterio = criterioProveedor.trim();
        let url = isNaN(criterio)
        ? `http://localhost:8080/proveedores/nombre/${criterio}`
        : `http://localhost:8080/proveedores/${criterio}`;
        try {
            const res = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                }
            });
            if (res.ok) {
                const data = await res.json();
                const lista = Array.isArray(data) ? data : [data];

                if (lista.length > 0) {
                    setResultadosProveedor(lista);// Guarda resultados
                    setMensaje(`✅ Se encontraron ${lista.length} proveedor(es)`);
                } else {
                    setMensaje("❌ No se encontró ningún proveedor");
                    setResultadosProveedor([]);
                }
            } else {
                setMensaje("❌ Error al consultar el proveedor");
            setResultadosProveedor([]);
            }
        } catch (error) {
            //console.error("Error al consultar el proveedor:", error);
            setMensaje("❌ Error al consultar el proveedor");
            setResultadosProveedor([]);
        }
    };
    
    const consultarProducto = async () => {
        if (!criterioBusqueda.trim()) {
            setMensaje("⚠️ Debes ingresar un criterio de búsqueda válido");
            return;
        }

        const criterio = criterioBusqueda.trim();
        let url = '';

        if (!isNaN(criterio) && criterio.length <= 6) {
            url = `http://localhost:8080/productos/${criterio}`;
        } else if (!isNaN(criterio) && criterio.length > 6) {
            url = `http://localhost:8080/productos/codigoBarras/${criterio}`;
        } else {
            url = `http://localhost:8080/productos/nombre/${criterio}`;
        }
        //console.log("Consultando URL:", url);

        try {
            const res = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                }
            });

            if (res.ok) {
                //console.log("Respuesta del servidor:", res);
                const data = await res.json();
                if (Array.isArray(data)) {
                    //console.log("Datos de productos encontrados:", data);
                    setResultadosBusqueda(data);
                } else {
                    setProducto({
                        // Asignar los datos del producto encontrado
                        id: data.id,
                        nombreProducto: data.nombreProducto,
                        codigoBarras: data.codigoBarras,
                        precioCompra: data.precioCompra,
                        cantidad: 1
                    });
                    setMensaje("✅ Producto encontrado");
                }
    } 

            } catch (error) {
            //console.error("Error al consultar el producto:", error);
            setMensaje("❌ Producto no encontrado");
        }
    };

    const agregarProducto = () => {
        if (!producto.id) {
            setMensaje("⚠️ Debes buscar un producto válido");
            return;
        }
        setProductosAgregados([...productosAgregados, producto]);
        setProducto({
            id: '',
            nombreProducto: '',
            codigoBarras: '',
            precioCompra: 0,
            cantidad: 1,
        });
        //console.log("Producto agregado:", producto);
        setMensaje("✅ Producto agregado");
    };

    const eliminarProducto = (index) => {
        const nuevosProductos = productosAgregados.filter((_, i) => i !== index);
        setProductosAgregados(nuevosProductos);
    };

    const registrarCompra = async () => {
    if (productosAgregados.length === 0) {
        setMensaje("⚠️ Debes agregar al menos un producto a la compra");
        return;
    }

    if (!proveedor || !proveedor.id) {
        setMensaje("⚠️ Debes seleccionar un proveedor");
        return;
    }

    // Validar que todos los productos tengan precioUnitario
    const productosValidados = productosAgregados.map(p => {
        return {
        productoId: p.id,
        cantidad: p.cantidad,
        precioUnitario: p.precioUnitario ?? p.precioCompra ?? 0 // fallback
        };
    });

    // Validar que no haya precios faltantes
    const hayPrecioInvalido = productosValidados.some(p => p.precioUnitario <= 0);
    if (hayPrecioInvalido) {
        setMensaje("⚠️ Todos los productos deben tener un precio válido");
        return;
    }

    const compra = {
        proveedorId: proveedor.id,
        numeroFactura: numeroFactura,
        totalCompra: totalCompra,
        detalleCompraDtoList: productosValidados
    };

    try {
        console.log("✔️ Objeto enviado al backend:", compra);
        const response = await fetch('http://localhost:8080/compras', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify(compra),
        });

        if (!response.ok) {
        throw new Error("Error al registrar la compra");
        }

        const compraRegistrada = await response.json();
        setCompraConfirmada(compraRegistrada);
        setMensaje(`✅ Compra registrada con éxito. ID: ${compraRegistrada.id}`);
        console.log("📦 Compra confirmada:", compraRegistrada);

        // Limpiar el formulario
        setProductosAgregados([]);
        setTotalCompra(0);
        setProducto({
        id: '',
        nombreProducto: '',
        codigoBarras: '',
        precioUnitario: 0,
        cantidad: 1,
        });
        setNumeroFactura('');
    } catch (error) {
        console.error("❌ Error al registrar la compra:", error);
        setMensaje("❌ Error al registrar la compra");
    }
  };
  return (
    <div className="container mt-4">
      <h1>Compras</h1>
      <div className="row">
        <div className="col-md-6">
        {/* Formulario de Compras */}
        <FormularioCompras
        producto={producto}
        setProducto={setProducto}
        criterioBusqueda={criterioBusqueda}
        setCriterioBusqueda={setCriterioBusqueda}
        consultarProducto={consultarProducto}
        mensaje={mensaje}
        setMensaje={setMensaje}
        totalCompra={totalCompra}
        setTotalCompra={setTotalCompra}
        agregarProducto={agregarProducto}
        registrarCompra={registrarCompra}
        proveedor={proveedor}
        setProveedor={setProveedor}
        criterioProveedor={criterioProveedor}
        setCriterioProveedor={setCriterioProveedor}
        consultarProveedor={consultarProveedor}
        compra={productosAgregados}
        numeroFactura={numeroFactura}
        setNumeroFactura={setNumeroFactura}
        />
        </div>
        <div className="col-md-6">
            {/*Resultados de búsqueda */}
            {resultadosBusqueda.length > 0 && (
                <table className="table table-dark table-striped mt-3">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Acciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {resultadosBusqueda.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>{p.codigoBarras}</td>
                                    <td>{p.nombreProducto}</td>
                                    <td>${formatearMiles(p.precioCompra)}</td>
                                    <td>
                                        <button 
                                            className="btn btn-sm btn-info"
                                            onClick={() => {
                                                setProducto({
                                                    id: p.id,
                                                    nombreProducto: p.nombreProducto,
                                                    codigoBarras: p.codigoBarras,
                                                    precioCompra: p.precioCompra,
                                                    cantidad: 1
                                                });
                                                // setResultadosBusqueda([]);
                                                setMensaje(`📝 Producto seleccionado: ${p.nombreProducto}`);
                                            }}
                                        >
                                            Seleccionar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                </table>
            )}

            {/*Tabla de resultados de búsqueda */}
            <div className="bg-card-dark p-3 rounded text-white mb-4">
            <TablaCompras
                titulo="🛒 Productos a comprar"
                eliminarCompra={eliminarProducto}
                compras={productosAgregados}
                totalCompra={totalCompra}
                setTotalCompra={setTotalCompra}
                eliminarProducto={eliminarProducto}
                registrarCompra={registrarCompra}
                />
                <ResumenCompra compra={compraConfirmada} />
                <button
                    className="btn btn-success w-100 mt-3"
                    onClick={registrarCompra}
                    >
                    Registrar Compra
                </button>

            </div>
            {/*Mensaje de estado */}
            {mensaje && <div className="text-center mt-3 text-info">{mensaje}</div>}

            <div>
                {/*Tabla para mostrar proveedor*/}
                <TablaProveedores
                onClick={consultarProveedor}
                proveedores={resultadosProveedor}
                enviarEditar={handleEnviar}
                modo="compra" // prop para manejo del botón seleccionar de la tabla
                registrarCompra={registrarCompra}
                />
            </div>
        </div>
    </div>
    </div>
  );
}

export default ComprasPage;