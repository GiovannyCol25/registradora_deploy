// src/hooks/useProductoSearch.js
import { useState } from 'react';

export function useProductoSearch() {
  const [producto, setProducto] = useState(null);
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  const [mensaje, setMensaje] = useState('');

  const buscarProducto = async (criterio) => {
    if (!criterio || !criterio.trim()) {
      setMensaje("⚠️ Ingresa un criterio válido");
      return;
    }

    let url = "";
    const criterioTrim = criterio.trim();
    if (!isNaN(criterioTrim) && criterioTrim.length <= 6) {
      url = `http://localhost:8080/productos/${criterioTrim}`;
    } else if (!isNaN(criterioTrim) && criterioTrim.length > 6) {
      url = `http://localhost:8080/productos/codigoBarras/${criterioTrim}`;
    } else {
      url = `http://localhost:8080/productos/nombre/${criterioTrim}`;
    }

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
      });

      if (!res.ok) throw new Error("Producto no encontrado");

      const data = await res.json();
      if (Array.isArray(data)) {
        setResultadosBusqueda(data);
        setProducto(null);
        setMensaje(`🔍 ${data.length} resultado(s) encontrado(s)`);
      } else {
        setProducto(data);
        setResultadosBusqueda([]);
        setMensaje("✅ Producto encontrado");
      }
    } catch (err) {
      setProducto(null);
      setResultadosBusqueda([]);
      setMensaje("❌ Producto no encontrado");
    }
  };

  return {
    producto,
    resultadosBusqueda,
    mensaje,
    buscarProducto,
    setProducto,
    setResultadosBusqueda,
    setMensaje
  };
}
