// src/components/ProtectedRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom'; // Componente para redirigir a otra ruta
import { isAuthenticated, getRol } from '../utils/auth'; // Funciones para verificar autenticación y obtener el rol del usuario

// Componente que protege rutas según la autenticación y roles permitidos
const ProtectedRoute = ({ children, rolesPermitidos }) => {
  // Verifica si el usuario está autenticado
  const autenticado = isAuthenticated();

  // Obtiene el rol del usuario desde el token almacenado
  const rol = getRol();

  // Si el usuario no está autenticado o su rol no está en la lista de roles permitidos
  if (!autenticado || !rolesPermitidos.includes(rol)) {
    return <Navigate to="/Login" />; // Redirige al usuario a la página de login
  }

  // Si el usuario está autenticado y tiene un rol permitido, renderiza los hijos (children)
  return children;
};

export default ProtectedRoute; // Exporta el componente para su uso en otras partes de la aplicación