import React, { useState } from 'react';
import TablaListadoCompras from '../TablaListadoCompras';

const ConsultaCompras = () => {
  const [compras, setCompras] = useState([]);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [mensaje, setMensaje] = useState('');
  const [proveedorFiltro, setProveedorFiltro] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [loading, setLoading] = useState(false);
  const API_COMPRAS = 'http://localhost:8080/compras';
  const [tipoConsulta, setTipoConsulta] = useState('todas');
  const [pagina, setPagina] = useState(0);
  const [comprasPorFecha, setComprasPorFecha] = useState({});
  const size = 0; // Tamaño de página para paginación

  // ✅ Consulta 2: Filtrar por fechas
  const filtrarCompras = async (paginaActual = 0) => {
    try {
      let url = `${API_COMPRAS}/filtroCompras?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&page=${paginaActual}&size=${size}`;

      const res = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      if (!res.ok) throw new Error('Error al filtrar compras');
      const data = await res.json();
      setCompras(data.compras);
      setTotalPaginas(data.totalPaginas);
    } catch (error) {
      setMensaje(error.message);
    }
  };

  const buscarCompras = async (paginaActual = 0) => {
    try {
      const res = await fetch(`${API_COMPRAS}/listarCompras?page=${paginaActual}&size=${size}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
    });
    console.log(res);
      if (!res.ok) throw new Error('Error al cargar compras');
      const data = await res.json();
      setCompras(data.contenido || []);
      setPagina(data.paginaActual || 0);
      setTotalPaginas(data.totalPaginas || 1);
    } catch (error) {
      setMensaje(error.message);
    }
  };

  // ✅ Método general que decide qué llamada hacer
  const ejecutarConsulta = () => {
    if (tipoConsulta === 'todas') {
      setPagina(0); // Reiniciar a la primera página
      buscarCompras(0);
    } else {
      filtrarCompras();
    }
  };

  const totalComprasPorFecha = async () => {
    if (!fechaInicio) {
      setMensaje('Debe seleccionar 1 fecha para filtrar');
      return;
    }

    try {

      const fechaFormateada = new Date(fechaInicio).toISOString().split('T')[0];

      let url = `${API_COMPRAS}/compras-diarias/total/${fechaFormateada}`;
      console.log("consultas validadas", fechaFormateada);
      const respuesta = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      console.log(respuesta);
      if (respuesta.status === 404) {
        setCompras([]);
        setMensaje('No se encontraron compras para la fecha seleccionada');
        return;
      }

      console.log(respuesta);
      if (!respuesta.ok) throw new Error('Error al obtener compras por fecha');
      const data = await respuesta.json();
      console.log(data);
      setComprasPorFecha(data);
      setMensaje('');
      console.log('Compras por fecha:', data);
    } catch (error) {
      setComprasPorFecha([]);
      setMensaje(error.message);
    }finally{
      setLoading(false);
    }
  };

  const ejecutarConsultaTabla = () => {
    if (tipoConsulta === 'todas') {
      setPagina(0);
      buscarCompras(0);
    } else {
      filtrarCompras();
    }
  };

  return (
    <div className="container mt-9">
      <h5 className='mb-4'>Consulta de Compras</h5>
      
        <div className="row g-3">
          <div className="col-md-6">
            <label
              htmlFor='tipoConsulta'
              className="form-label">Tipo de Consulta</label>
            <select
              htmlFor="tipoConsulta"
              name='tipoConsulta'
              id='tipoConsulta'
              className="form-select"
              value={tipoConsulta}
              onChange={(e) => setTipoConsulta(e.target.value)}
            >
              <option value="todas">Ver todas</option>
              <option value="fechas">Por fechas</option>
            </select>
          </div>

          {tipoConsulta === 'fechas' && (
            <>
              <div className="col-md-4">
                <label
                  htmlFor='fechaInicio' 
                  className="form-label"
                  >Fecha Inicio</label>
                <input
                  htmlFor="fechaInicio"
                  name='fechaInicio'
                  id='fechaInicio'
                  type="date"
                  className="form-control"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label
                  htmlFor='fechaFin'
                  className="form-label"
                  >Fecha Fin</label>
                <input
                  htmlFor="fechaFin"
                  name='fechaFin'
                  id='fechaFin'
                  type="date"
                  className="form-control"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="col-md-6 mb-4">
            <label
              htmlFor='proveedorFiltro'
              className="form-label"
              >Filtrar por Proveedor</label>
            <input
              htmlFor="proveedorFiltro"
              name='proveedorFiltro'
              id="proveedorFiltro"
              type="text"
              className="form-control"
              placeholder="Nombre proveedor"
              value={proveedorFiltro}
              onChange={(e) => setProveedorFiltro(e.target.value)}
            />
          </div>
        </div>

      <button
        className="btn btn-primary mb-3"
        onClick={ejecutarConsulta}
        disabled={loading}
      >
        {loading ? 'Consultando...' : 'Buscar Compras'}
      </button>

      {mensaje && <div className="alert alert-warning">{mensaje}</div>}

      {compras.length > 0 && !loading && (
        <TablaListadoCompras compras={compras || []} />
      )}

      {totalPaginas > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <button
            className="btn btn-outline-secondary"
            disabled={pagina === 0}
            onClick={() => setPagina(pagina - 1)}
          >
            Anterior
          </button>
          <span>Página {pagina + 1} de {totalPaginas}</span>
          <button
            className="btn btn-outline-secondary"
            disabled={pagina + 1 >= totalPaginas}
            onClick={() => setPagina(pagina + 1)}
          >
            Siguiente
          </button>
        </div>
      )}

      {/*mensaje de total de compras por fecha*/}
      {tipoConsulta === 'fechas' && (
        <button
          className="btn btn-secondary mt-3"
          onClick={totalComprasPorFecha}
          disabled={loading}
        >
          {loading ? 'Consultando...' : 'Total Compras por Fecha'}
        </button>
      )}

      {tipoConsulta !== 'fechas' && (
        <button
          className="btn btn-primary mt-3"
          onClick={ejecutarConsultaTabla}
          disabled={loading}
        >
          {loading ? 'Buscando...' : 'Buscar Compras'}
        </button>
      )}

      {comprasPorFecha && comprasPorFecha.totalCompras !== undefined && (
        <div className="mt-3">
          <h5>Resultado:</h5>
          <div className="card p-3 shadow-sm bg-light" style={{ minWidth: '250px' }}>
            <h6>📅 Fecha: {comprasPorFecha.fechaCompra}</h6>
            <p>💰 Total: ${comprasPorFecha.totalCompras}</p>
          </div>
        </div>
      )}

      {mensaje && <p className="text-danger mt-2">{mensaje}</p>}

    </div>
  );
};

export default ConsultaCompras;