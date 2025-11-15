// src/components/FormularioVenta.js
import React from 'react';
import { formatearMiles } from '../utils/formato';

function FormularioVenta({ 
  producto, 
  setProducto, 
  agregarProducto, 
  dineroRecibido, 
  setDineroRecibido, 
  cambio,
  criterioBusqueda,
  setCriterioBusqueda,
  consultarProducto,
  buscarCliente,
  setClienteBuscado,
  clienteBuscado,
  cliente,
  mensaje,
  totalVenta
 }) {

  // Procesa el cambio en los inputs del producto
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Para campos numéricos, convierte el valor a número
    const processedValue = (name === 'cantidad' || name === 'descuento') ? Number(value) : value;
    setProducto({ ...producto, [name]: processedValue });
  };

  // Cálculo de total con descuento para el producto actual
  const totalConDescuento = (producto.precio * producto.cantidad - producto.descuento) || 0;

  return (
    <form className="bg-card-dark shadow-sm p-4 rounded mb-4 text-white">
      {/*busqueda de cliente*/}
      <div className="mb-3">
        <label htmlFor="buscarCliente" className="form-label">Consulta de Clientes</label>
        <input 
          type="text"
          className="form-control form-control-dark"
          id="buscarCliente"
          name="buscarCliente"
          value={clienteBuscado}
          onChange={e => setClienteBuscado(e.target.value)}
          placeholder="Ingrese ID Nombre del Cliente"
        />
      </div>
      <div className="d-flex align-items-end mb-4">
        <button
          type="button"
          name='buscarCliente'
          className="btn btn-secondary w-100"
          onClick={buscarCliente}
        >
          Buscar Cliente
        </button>
        
      </div>

      <div className="mb-3">
        <label htmlFor='buscar' className="form-label">Buscar Producto</label>
        <input 
        type="text" 
        className="form-control form-control-dark" 
        name="buscar" 
        id="buscar"
        placeholder="ID, Nombre o Código"
        value={criterioBusqueda}
        onChange={e => setCriterioBusqueda(e.target.value)}
        autoFocus
        />
      </div>

      <div className="row mb-4">
        <div className="col-12 col-sm-6 mb-2">
          <button 
          type="button"
          name='consultar' 
          className="btn btn-secondary w-100"
          onClick={consultarProducto}
          >
            Buscar
          </button>
        </div>
        <div className="col-12 col-sm-6 mb-2">
          <button 
          type="button" 
          className="btn btn-info w-100" 
          onClick={agregarProducto}>Agregar</button>
        </div>
      </div>

      <div className="bg-card-dark mb-3 shadow-sm">
        <h5 className="mb-3">Detalles del Producto</h5>
        <div className="row mb-3">
          <div className="col-12 col-md-4 mb-3">
            <label htmlFor='id'>ID Producto</label>
            <input type="text" 
            className="form-control form-control-dark" 
            name="id"
            id='id'
            placeholder="ID del Producto" 
            value={producto.id} 
            readOnly />
          </div>
          <div className="col-12 col-md-4 mb-3">
            <label htmlFor='nombreProducto'>Nombre del Producto</label>
            <input type="text" 
            className="form-control form-control-dark" 
            id='nombreProducto'
            name="nombreProducto" value={producto.nombre} readOnly />
          </div>
          <div className="col-12 col-md-4 mb-3">
            <label htmlFor='codigo'>Código de Barras</label>
            <input type="text" 
            className="form-control form-control-dark" 
            name="codigo" 
            id='codigo'
            placeholder="Código de Barras"
            value={producto.codigo} readOnly />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-12 col-md-4 mb-3">
            <label htmlFor='precio'>Precio de Venta</label>
            {/* Visualiza el precio formateado */}
            <input type="number" 
            className="form-control form-control-dark" 
            name="precio" 
            id='precio'
            placeholder="Precio del Producto"
            value={producto.precio}
            onChange={handleChange}
            readOnly={!(producto.id === 12 || producto.id === 13)}
            />

          </div>
          <div className="col-12 col-md-4 mb-3">
            <label htmlFor='cantidad'>Cantidad</label>
            <input type="number" 
            className="form-control form-control-dark" 
            name="cantidad" 
            id='cantidad'
            placeholder="Cantidad del Producto"
            value={producto.cantidad ?? 0} onChange={handleChange} />
          </div>
          <div className="col-12 col-md-4 mb-3">
            <label htmlFor='descuento'>Descuento en valor</label>
            <input type="number" 
            className="form-control form-control-dark" 
            name="descuento"
            id='descuento'
            placeholder="Descuento en COP" 
            value={producto.descuento ?? 0} onChange={handleChange} />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor='totalConDescuento'>Total con Descuento</label>
            <input type="text" 
            className="form-control form-control-dark" 
            name="totalConDescuento"
            id='totalConDescuento'
            placeholder="Total con Descuento"
            value={formatearMiles(totalConDescuento ?? 0)} readOnly />
          </div>
          <div className="col-md-6">
            <label htmlFor='dineroRecibido'>Dinero Recibido</label>
            <input
              type="number"
              className="form-control form-control-dark"
              name="dineroRecibido"
              id='dineroRecibido'
              placeholder="Dinero Recibido"
              value={dineroRecibido ?? 0}
              onChange={e => setDineroRecibido(Number(e.target.value))}
            />
            <small className="form-text text-muted">
              {dineroRecibido ? formatearMiles(dineroRecibido) : 0} COP
            </small>
          </div>
        </div>
        <div className="ejemb-3">
          <label htmlFor='cambio'>Cambio a entregar</label>
          <input type="text" 
          className="form-control form-control-dark" 
          name='cambio'
          id='cambio'
          placeholder="Cambio a entregar"
          value={formatearMiles(cambio < 0 ? 0 : cambio)} readOnly />
        </div>
      </div>
    </form>
  );
}

export default FormularioVenta;