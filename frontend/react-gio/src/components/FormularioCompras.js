import React from "react";
import { formatearMiles } from "../utils/formato";

function FormularioCompras({
  producto,
  setProducto,
  agregarProducto,
  criterioBusqueda,
  setCriterioBusqueda,
  consultarProducto,
  setMensaje,
  mensaje,
  totalCompra,
  setTotalCompra,
  proveedor,
  setProveedor,
  criterioProveedor,
  setCriterioProveedor,
  consultarProveedor,
  numeroFactura,
  setNumeroFactura
}) {


  // Procesa el cambio en los inputs del producto
/*  const handleChange = (e) => {
    const { name, value } = e.target;
    // Para campos numéricos, convierte el valor a número
    const processedValue = ['cantidad', 'precioCompra'].includes(name) ? Number(value) : value;
    setProducto({ ...producto, [name]: processedValue });
  };*/

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    // Convierte a número si el campo es numérico
    if (['cantidad', 'precioCompra', 'totalProducto'].includes(name)) {
      processedValue = value === '' ? '' : Number(value);
    }

    // Copiamos el producto actual
    let updatedProducto = { ...producto, [name]: processedValue };

    // Reglas de actualización automática:
    if (name === "totalProducto") {
      // Si cambia el totalProducto -> recalcula precioCompra
      if (updatedProducto.cantidad > 0) {
        updatedProducto.precioCompra = processedValue / updatedProducto.cantidad;
      }
    }

    if (name === "cantidad") {
      // Si cambia la cantidad -> recalcula precioCompra usando el totalProducto
      if (updatedProducto.totalProducto > 0 && processedValue > 0) {
        updatedProducto.precioCompra = updatedProducto.totalProducto / processedValue;
      }
    }

    setProducto(updatedProducto);
  };

  return (
    <form>
      {/*Buesqueda de Proveedor*/}
      <div className="mb-3">
        <label htmlFor='consultaProveedor' className="form-label">Consulta de Proveedores</label>
        <input
          type="text"
          className="form-control form-control-dark"
          id="consultaProveedor"
          name="consultaProveedor"
          value={criterioProveedor}
          onChange={e => setCriterioProveedor(e.target.value)}
          placeholder="ID, Nombre o Código del Proveedor"
        />
      </div>
      <div className="d-flex align-items-end mb-3">
        <button
          type="button"
          name='consultarProveedor'
          className="btn btn-secondary w-50"
          onClick={consultarProveedor}
        >
          Buscar Proveedor
        </button>
      </div>

      {/*busqueda de Producto*/}
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

      <div className="d-flex align-items-end mb-3">
        <button 
          type="button"
          name='consultar' 
          className="btn btn-secondary w-50"
          onClick={consultarProducto}
        >
          Buscar
        </button>
        <button 
          type="button" 
          className="btn btn-info w-50 ms-2" 
          onClick={agregarProducto}
        >
          Agregar
        </button>
      </div>

      <div className="col-md-6">
        <label htmlFor="numeroFactura" className="form-label">Número de Factura</label>
        <input 
          type="text"
          className="form-control form-control-dark"
          id="numeroFactura"
          name="numeroFactura"
          value={numeroFactura}
          onChange={(e) => setNumeroFactura(e.target.value)}
          />
      </div>

        <div className="bg-card-dark mb-3 shadow-sm">
            <h5 className="text-center">Detalles del Producto</h5>
            <div className="row mb-3">
                <div className="col-md-4">
                    <label htmlFor="nombreProducto" className="form-label">Nombre</label>
                    <input 
                        type="text" 
                        className="form-control form-control-dark" 
                        id="nombreProducto" 
                        name="nombreProducto"
                        value={producto.nombreProducto}
                        onChange={handleChange}
                        disabled
                    />
                </div>
                <div className="col-md-4">
                    <label htmlFor="id" className="form-label">ID Producto</label>
                    <input 
                        type="text"
                        className="form-control form-control-dark"
                        id="id"
                        name="id"
                        value={producto.id || ''}
                        onChange={handleChange}
                        disabled
                    />
                </div>
                <div className="col-md-4">
                    <label htmlFor="codigoBarras" className="form-label">Código</label>
                    <input 
                        type="text" 
                        className="form-control form-control-dark" 
                        id="codigoBarras" 
                        name="codigoBarras"
                        value={producto.codigoBarras || ''}
                        onChange={handleChange}
                        disabled
                    />
                </div>
                <div className="col-md-4">
                  <label htmlFor="totalProducto" className="form-label">Total del Producto</label>
                  <input
                    type="number"
                    className="form-control form-control-dark"
                    id="totalProducto"
                    name="totalProducto"
                    value={producto.totalProducto || ''}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                    <label htmlFor="precioCompra" className="form-label">Precio</label>
                    <input 
                        type="number" 
                        className="form-control form-control-dark" 
                        id="precioCompra" 
                        name="precioCompra"
                        value={producto.precioCompra ?? ''}
                        onChange={handleChange}
                    />
                </div>
                <div className="col-md-4">
                    <label htmlFor="cantidad" className="form-label">Cantidad</label>
                    <input 
                        type="number" 
                        className="form-control form-control-dark" 
                        id="cantidad" 
                        name="cantidad"
                        value={producto.cantidad || ''}
                        onChange={handleChange}
                    />
                    </div>
                    <div className="col-md-6 mt-3">
                      <label htmlFor="totalCompra" className="form-label">Total de la Compra</label>
                      <input 
                        type="text" 
                        id="totalCompra" 
                        name="totalCompra"
                        className="form-control form-control-dark" 
                        value={`$ ${formatearMiles(totalCompra)}`} 
                        readOnly 
                      />
                    </div>

                </div>
            </div>
            </form>
  );
}
export default FormularioCompras;
