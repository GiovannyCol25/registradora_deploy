import React, { useState } from 'react';
import FormularioProducto from '../components/FormularioProducto'; // Componente para el formulario de productos
import TablaProductos from '../components/TablaProductos'; // Componente para mostrar productos en una tabla
import TablaProductosRegistrados from '../components/TablaProductosRegistrados'; // Componente para mostrar productos registrados
import { formatearMiles } from '../utils/formato'; // Utilidad para formatear números

function ProductosPage() {
  // Estado para manejar el producto actual en el formulario
  const [producto, setProducto] = useState({ codigoBarras: '', nombreProducto: '', precioVenta: '', stock: '' });

  // Estado para manejar la lista de productos agregados
  const [productos, setProductos] = useState([]);

  // Estado para manejar la lista de productos registrados en el servidor
  const [productosRegistrados, setProductosRegistrados] = useState([]);

  // Estado para manejar mensajes de error o éxito
  const [mensaje, setMensaje] = useState('');
  // Estado para manejar el criterio de búsqueda y los resultados
  const [criterioBusqueda, setCriterioBusqueda] = useState('');
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);

  // Función para agregar un producto a la lista
  const agregarProducto = (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario
    const { codigoBarras, nombreProducto, precioVenta } = producto;

    // Validación: Verifica que todos los campos estén llenos
    if (!producto.codigoBarras || !producto.nombreProducto || !producto.precioVenta) {
      setMensaje('⚠️ Todos los campos son obligatorios');
      return;
    }

    // Agrega el producto a la lista de productos
    setProductos([
      ...productos,
      { codigoBarras, nombreProducto, precioVenta: parseFloat(precioVenta), stock: parseInt(producto.stock) },
    ]);

    // Limpia el formulario y el mensaje
    setProducto({ codigoBarras: '', nombreProducto: '', precioVenta: '', stock: '' });
    setMensaje('');
  };

  // Función para eliminar un producto de la lista
  const eliminarProducto = (index) => {
    const copia = [...productos]; // Crea una copia de la lista de productos
    copia.splice(index, 1); // Elimina el producto en el índice especificado
    setProductos(copia); // Actualiza el estado
  };

  // Función para registrar los productos en el servidor
  const registrarProductos = async () => {
    // Validación: Verifica que haya productos para registrar
    if (productos.length === 0) {
      setMensaje('⚠️ No hay productos para registrar');
      return;
    }

    try {
      // Realiza una solicitud POST al servidor con la lista de productos
      const res = await fetch('http://localhost:8080/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
         },
        body: JSON.stringify(productos), // Envía la lista de productos como cuerpo de la solicitud
      });
      
      if (!res.ok) {
        throw new Error('Error al registrar los productos'); // Manejo de errores
      }
      
      const data = await res.json(); // Obtiene la respuesta del servidor
      setMensaje('✅ Registro exitoso'); // Muestra un mensaje de éxito
      setProductos([]); // Limpia la lista de productos
      setProductosRegistrados(data); // Actualiza la lista de productos registrados
    } catch (error) {
      setMensaje('❌ Error al registrar los productos'); // Muestra un mensaje de error
    }
  };

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
        // MODIFICADO PARA ASEGURAR QUE STOCK ESTE DEFINIDO
        setResultadosBusqueda(
          data.map((p) => ({
            id: p.id || '',
            codigoBarras: p.codigoBarras || '',
            nombreProducto: p.nombreProducto || '',
            precioVenta: p.precioVenta || '',
            stock: Number(p.stock) || 0, // Asegura que stock sea un número
        }))
        );
        setMensaje(`🔍 ${data.length} resultado(s) encontrado(s)`);
      }else {
      setProducto({
        id: data.id || '',
        codigoBarras: data.codigoBarras || '',
        nombreProducto: data.nombreProducto || '',
        precioVenta: data.precioVenta || '',
        stock: data.stock ?? ''
      }); // Actualiza el producto con los datos obtenidos
      setMensaje(`🔍 Producto encontrado:`);
      //setResultadosBusqueda(data);
      //setMensaje(`🔍 ${data.length} resultado(s) encontrado(s)`);
    }
    } catch (error) {
      setMensaje('❌ Error en la búsqueda de productos');
      setProducto({ codigoBarras: '', nombreProducto: '', precioVenta: '', stock: '' });
      setResultadosBusqueda([]); // Limpia los resultados de búsqueda
    }
  };

  const actualizarProducto = async () => {
    try {
      //CONVERSION DE DATOS PARA EL ENVIO AL BACKEND
      const productoActualizado = {
        ...producto,
        precioVenta: parseFloat(producto.precioVenta) || 0,
        stock: parseInt(producto.stock, 10) || 0,
      };

      const res = await fetch(`http://localhost:8080/productos/${producto.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify(productoActualizado),
      });

      if (!res.ok) throw new Error('Error al actualizar el producto');

      const data = await res.json();

      // ✅ Actualiza la lista de productos registrados
    setProductosRegistrados((prev) => {
      const existe = prev.find((p) => p.id === data.id);
      if (existe) {
        // Si ya existe, reemplaza el producto
        return prev.map((p) => (p.id === data.id ? data : p));
      } else {
        // Si no existe, agrégalo
        return [...prev, data];
      }
    });

      setMensaje('✅ Producto actualizado exitosamente');
      setProducto({ codigoBarras: '', nombreProducto: '', precioVenta: '', stock: ''});
      setResultadosBusqueda([]);
    } catch (err) {
      setMensaje('❌ Error al actualizar el producto');
    }
  };

  return (
    <div className="container mt-2">
      {/* Título de la página */}
      <h5 className="text-center text-white mb-2">Registro de Productos</h5>

      {/* Formulario para agregar productos */}
      <FormularioProducto
        producto={producto}
        setProducto={setProducto}
        onAgregar={agregarProducto}
      />

      {/* Tabla para mostrar los productos agregados */}
      {productos.length > 0 && (
        <TablaProductos
          productos={productos}
          onEliminar={eliminarProducto}
          onRegistrar={registrarProductos}
          formatearMiles={formatearMiles}
        />
      )}

      {/* Botón para actualizar producto seleccionado */}
      {producto.codigoBarras && (
        <button
          className="btn btn-warning mt-2 w-100"
          onClick={actualizarProducto}
        >
          Actualizar producto
        </button>
      )}

      {/* Mensaje */}
      {mensaje && <div className="text-center mt-3 text-info">{mensaje}</div>}
      
      {/* Formulario de búsqueda */}
      <div className="mt-3">
        <input
          htmlFor="criterioBusqueda"
          id="criterioBusqueda"
          name='criterioBusqueda'
          type="text"
          placeholder="Buscar por ID, nombre o código de barras"
          className="form-control mb-2"
          value={criterioBusqueda}
          onChange={(e) => setCriterioBusqueda(e.target.value)}
        />
        <button className="btn btn-secondary w-100" onClick={buscarProductos}>
          Buscar producto
        </button>
      </div>

      {/* Tabla de resultados de búsqueda */}
      {resultadosBusqueda.length > 0 && (
        <table className="table table-striped table-hover mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Código Barras</th>
              <th>Stock</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {resultadosBusqueda.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nombreProducto}</td>
                <td>{formatearMiles(p.precioVenta)}</td>
                <td>{p.codigoBarras}</td>
                <td>{p.stock}</td>
                <td>
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => {
                      setProducto(p); // Carga el producto en el formulario
                      setResultadosBusqueda([]); // Limpia la tabla
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

      {/* Mensaje de error o éxito */}
      {mensaje && <div className="text-center mt-3 text-info">{mensaje}</div>}

      {/* Tabla para mostrar los productos registrados */}
      {productosRegistrados.length > 0 && (
        <TablaProductosRegistrados
          productos={productosRegistrados}
          formatearMiles={formatearMiles}
        />
      )}
    </div>
  );
}

export default ProductosPage; // Exporta el componente para su uso en otras partes de la aplicación