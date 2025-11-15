import React, { useEffect, useState } from 'react';
import TablaVentas from './TablaVentas';

function ConsultaVentasPaginadas() {
  const [ventas, setVentas] = useState([]);
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [mensaje, setMensaje] = useState('');

  const cargarVentas = async (pagina = 0) => {
    try {
      const res = await fetch(`http://localhost:8080/ventas?page=${pagina}&size=20`);
      if (!res.ok) throw new Error('Error al cargar ventas');
      const data = await res.json();
      setVentas(data.contenido);
      setPagina(data.paginaActual || 0);
      setTotalPaginas(data.totalPaginas || 1);
    } catch (error) {
      setMensaje(error.message);
    }
  };

  useEffect(() => {
    cargarVentas();
  }, []);

  return (
    <>
      {mensaje && <div className="alert alert-warning">{mensaje}</div>}
      <TablaVentas
        ventas={ventas}
        pagina={pagina}
        totalPaginas={totalPaginas}
        onPaginar={cargarVentas}
      />
    </>
  );
}

export default ConsultaVentasPaginadas;
