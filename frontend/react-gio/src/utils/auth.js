
// src/utils/auth.js

// Verifica si el usuario está autenticado comprobando si existe un token en el sessionStorage
export const isAuthenticated = () => {
  const token = sessionStorage.getItem('token'); // Obtiene el token del sessionStorage
  return !!token; // Retorna true si el token existe, false en caso contrario
};

// Obtiene el rol del usuario a partir del token almacenado en el sessionStorage
export const getRol = () => {
  const token = sessionStorage.getItem('token'); // Obtiene el token del sessionStorage
  if (!token) return null; // Si no hay token, retorna null

  try {
    // Decodifica el token (asumiendo que es un JWT) y extrae el payload
    const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica la parte del payload del token
    return payload.rol || null; // Retorna el rol del usuario o null si no existe
  } catch (error) {
    // Maneja errores en caso de que el token sea inválido o no se pueda decodificar
    console.error("Token inválido:", error);
    return null;
  }
};

// Cierra la sesión del usuario eliminando el token del sessionStorage
export const logout = () => {
  sessionStorage.removeItem('token'); // Elimina el token del sessionStorage
};

export const getUsuario = () => {
  const token = sessionStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub || null; // ✅ "sub" contiene el nombre/login del usuario
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return null;
  }
};
