import React, { useState } from "react";
import FormularioVenta from "../components/FormularioVenta";
import TablaProductosVenta from "../components/TablaProductosVenta";
import { formatearMiles } from "../utils/formato";
import ResumenVenta from "../components/ResumenVenta";
import TablaClientes from "../components/TablaClientes";

function VentasPage() {
  const [productoActual, setProductoActual] = useState({
    id: '',
    nombre: '',
    codigo: '',
    precio: 0,
    cantidad: 1,
    descuento: 0,
  });

  // Estado para manejar los productos agregados, dinero recibido, forma de pago y mensajes
  // y los resultados de búsqueda
  const [productosAgregados, setProductosAgregados] = useState([]);
  const [dineroRecibido, setDineroRecibido] = useState(0);
  const [formaDePago, setFormaDePago] = useState("Efectivo");
  const [mensaje, setMensaje] = useState('');
  const [criterioBusqueda, setCriterioBusqueda] = useState('');
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  const [ventaConfirmada, setVentaConfirmada] = useState(null);
  const [clienteBuscado, setClienteBuscado] = React.useState('');
  const [resultadosCliente, setResultadosCliente] = React.useState([]);
  const [cliente, setCliente] = React.useState(null);

  // Calcular el total de la venta y el cambio
  const totalVenta = productosAgregados.reduce((total, p) => {
    const subtotal = p.precio * p.cantidad;
    const descuento = subtotal * (p.descuento / 100);
    return total + (subtotal - descuento);
  }, 0);

  const cambio = dineroRecibido - totalVenta;

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
    
    try {
      const res = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        }
      });

      if (!res.ok) throw new Error("Producto no encontrado");
      const data = await res.json();

      // Si es array (por nombre), actualizar lista; si es uno solo, usar directo
      if (Array.isArray(data)) {
        setResultadosBusqueda(data);
      } else {
        // Si es un solo producto, actualizar el producto actual
        setProductoActual({
          ...productoActual,
          // Asignar los datos del producto encontrado
          id: data.id,
          nombre: data.nombre,
          codigo: data.codigo,
          precio: data.precio
        });
        setMensaje("✅ Producto encontrado");
      }

    } catch (error) {
      setMensaje("❌ Producto no encontrado");
    }
  };

  const agregarProducto = () => {
    if (!productoActual.id) {
      setMensaje("⚠️ Debes buscar un producto válido");
      return;
    }
    setProductosAgregados([...productosAgregados, productoActual]);
    setProductoActual({
      id: '',
      nombre: '',
      codigo: '',
      precio: 0,
      cantidad: 1,
      descuento: 0,
    });
    setMensaje("✅ Producto agregado");
  };

  const eliminarProducto = (index) => {
    const nuevosProductos = productosAgregados.filter((_, i) => i !== index);
    setProductosAgregados(nuevosProductos);
  };

  const handleEditar = (cliente) => {
        setCliente({
            id: cliente.id,
            nombre: cliente.nombre || '',
            telefono: String(cliente.telefono) || ''
        })
        setResultadosCliente([cliente]);
        setMensaje(`✅ Cliente seleccionado: ${cliente.nombre}`);
    }

    const buscarCliente = async () => {
        if(!clienteBuscado.trim()){
            setMensaje('⚠️ Por favor, ingrese un ID o nombre para buscar');
            return;
        }
        const opcionCliente = clienteBuscado.trim();
        let url = isNaN(opcionCliente)
            ? `http://localhost:8080/clientes/nombre/${opcionCliente}`
            : `http://localhost:8080/clientes/${opcionCliente}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                }
            });

            if (response.ok) {
            const data = await response.json();
            const listaClientes = Array.isArray(data) ? data : [data];
            console.log("Clientes encontrados:", listaClientes);
            console.log("Cliente buscado:", opcionCliente);
            console.log("Respuesta completa:", response);

            if (listaClientes.length > 0){
                setResultadosCliente(listaClientes);
                setMensaje(`✅ Se encontraron ${listaClientes.length} clientes`);
            } else {
                setMensaje("No se encontro ningún cliente");
                setResultadosCliente([]);
            }
        } else {
            setMensaje("❌ Error al consultar el clientes");
            setResultadosCliente([]);
        }
    } catch (error) {
        console.error("Error al consultar el proveedor:", error);
        setMensaje("❌ Error al consultar el proveedor");
        setResultadosCliente([]);
    }
  };

  const registrarVenta = async () => {
    if (productosAgregados.length === 0) {
      setMensaje("⚠️ Debes agregar al menos un producto");
      return;
    }

    if (dineroRecibido < totalVenta) {
      setMensaje("⚠️ El dinero recibido es insuficiente");
      return;
    }

    const detalleVenta = productosAgregados.map(p => ({
        nombreProducto: p.nombre,
        cantidad: p.cantidad,
        precioUnitario: p.precio
      }));

      try {
      // Preparar el objeto de venta
      const venta = {
        detalles: detalleVenta,
        formaDePago,
        totalVenta,
        descuento: 0,
        dineroRecibido
      };

      if (cliente && cliente.id) {
        venta.clienteId = cliente.id;
      }
      
      const res = await fetch("http://localhost:8080/ventas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify(venta),
      });
      console.log("Respuesta de la venta:", res);
      console.log("Datos enviados:", venta);
      // Verificar si la respuesta es exitosa
      if (!res.ok) throw new Error("Error al registrar la venta");
      // Si la respuesta es exitosa, limpiar el mensaje y estados
      const ventaRegistrada = await res.json();
      setVentaConfirmada(ventaRegistrada);
      console.log("Venta registrada:", ventaRegistrada);
      setMensaje("✅ Venta registrada con éxito");

      // Limpiar estados
      setProductosAgregados([]);
      setDineroRecibido(0);
      setFormaDePago("Efectivo");
      setProductoActual({
        id: '',
        nombre: '',
        codigo: '',
        precio: 0,
        cantidad: 1,
        descuento: 0,
      });
    } catch (error) {
      console.error("Error:", error);
      setMensaje("❌ Error al registrar la venta");
    }
  };

  return (
    <div className="container-fluid mt-4 px-3">
      <h1>Registrar Venta</h1>
        <div className="row">      
          <div className="col-12 col-md-6 mb-4">
          {/* Formulario */}
          <FormularioVenta
            producto={productoActual}
            setProducto={setProductoActual}
            agregarProducto={agregarProducto}
            dineroRecibido={dineroRecibido}
            setDineroRecibido={setDineroRecibido}
            cambio={cambio}
            totalVenta={totalVenta}
            consultarProducto={consultarProducto}
            mensaje={mensaje}
            criterioBusqueda={criterioBusqueda}
            setCriterioBusqueda={setCriterioBusqueda}
            clienteBuscado={clienteBuscado}
            setClienteBuscado={setClienteBuscado}
            cliente={cliente}
            buscarCliente={buscarCliente}
          />
        </div>

        <div className="col-12 col-md-6">
          {/* Resultados de búsqueda */}
          {resultadosBusqueda.length > 0 && (
            <table className="table table-dark table-striped mt-3">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {resultadosBusqueda.map((p) => (
                  <tr key={p.id}>
                    {console.log("Producto recibido:", p)}
                    <td>{p.id}</td>
                    <td>{p.codigoBarras}</td>
                    <td>{p.nombreProducto}</td>
                    <td>${formatearMiles(p.precioVenta)}</td>
                    <td>{p.stock}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-info"
                        onClick={() => {
                          setProductoActual({
                            ...productoActual,
                            id: p.id,
                            nombre: p.nombreProducto,
                            codigo: p.codigoBarras,
                            precio: p.precioVenta
                          });
                          setResultadosBusqueda([]);
                          setMensaje(`📝 Producto seleccionado: ${p.nombre}`);
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

          {/* Tabla productos agregados */}
          <TablaProductosVenta
            productos={productosAgregados}
            eliminarProducto={eliminarProducto}
            formaDePago={formaDePago}
            setFormaDePago={setFormaDePago}
            totalVenta={totalVenta}
            registrarVenta={registrarVenta}
          />
          <ResumenVenta venta={ventaConfirmada} />
          </div>
          <div>
                {/*Tabla para mostrar cliente*/}
                <TablaClientes
                clienteBuscado={clienteBuscado}
                setClienteBuscado={setClienteBuscado}
                clientes={resultadosCliente}
                cliente={cliente}
                editarCliente={handleEditar}
                buscarCliente={buscarCliente}
                />
            </div>
          {/* Mensaje de estado */}
          {mensaje && <div className="text-center mt-3 text-info">{mensaje}</div>}
          
        </div>
    </div>
  );
}

export default VentasPage;