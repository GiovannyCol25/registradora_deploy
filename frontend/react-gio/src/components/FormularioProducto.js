// src/components/FormularioProducto.js

import React from 'react';

// Componente para el formulario de productos
function FormularioProducto({ producto, setProducto, onAgregar }) {
  // Maneja los cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target; // Obtiene el nombre y valor del campo
    if (name === 'precioVenta' || name === 'stock') {
      setProducto({ ...producto, [name]: value === '' ? '' : value }); // Actualiza el estado del producto
    } else {
      setProducto({ ...producto, [name]: value }); // Actualiza el estado del producto
    }
  };

  return (
    // Formulario con estilos y evento de envío
    <form className="bg-card-dark shadow-sm p-4 rounded mb-4" onSubmit={onAgregar}>
      {/* Campo para el código de barras */}
      <div className="row mb-3">
        <div className="col-12 col-md-4 mb-3">
          <label htmlFor='codigoBarras' className="form-label text-white">Código de Barras</label>
          <input
            type="text"
            name="codigoBarras"
            id="codigoBarras"
            value={producto.codigoBarras} // Valor actual del estado
            onChange={handleChange} // Maneja los cambios en el campo
            className="form-control form-control-dark"
            placeholder="Ingrese el código de barras"
          />
        </div>

        {/* Campo para el nombre del producto */}
        <div className="col-12 col-md-4 mb-3">
          <label htmlFor='nombreProducto' className="form-label text-white">Nombre del Producto</label>
          <input
            type="text"
            name="nombreProducto"
            id="nombreProducto"
            value={producto.nombreProducto} // Valor actual del estado
            onChange={handleChange} // Maneja los cambios en el campo
            className="form-control form-control-dark"
            placeholder="Ingrese el nombre"
          />
        </div>

        {/* Campo para el precio de venta */}
        <div className="col-12 col-md-4 mb-3">
          <label htmlFor='precioVenta' className="form-label text-white">Precio de Venta</label>
          <input
            type="number"
            name="precioVenta"
            id="precioVenta"
            value={producto.precioVenta} // Valor actual del estado
            onChange={handleChange} // Maneja los cambios en el campo
            className="form-control form-control-dark"
            placeholder="Ingrese el precio"
          />
        </div>

        {/*Campo para el stock del producto*/}
        <div className="col-12 col-md-4 mb-3">
          <label htmlFor='stock' className="form-label text-white">Stock</label>
          <input
            type="number"
            name="stock"
            id="stock"
            value={producto.stock} // Valor actual del estado
            onChange={handleChange} // Maneja los cambios en el campo
            className="form-control form-control-dark"
            placeholder="Ingrese el stock"
          />
        </div>
      </div>
        {/* Botón para añadir el producto */}
        <button type="submit" className="btn btn-info w-100">Agregar Producto</button>
    </form>
  );
}

export default FormularioProducto; // Exporta el componente para su uso en otras partes de la aplicación