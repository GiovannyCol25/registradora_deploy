// src/components/Layout.js

import { Link } from 'react-router-dom';
import { getRol, logout, getUsuario } from '../utils/auth';


function Layout({ children }) {
  const rol = getRol();
  const usuario = getUsuario(); // Obtener el nombre del usuario desde el token

  const handleLogout = () => {
    logout();
    window.location.href = '/login'; // Redirigir a la página de login después de cerrar sesión
  }

  return (
    <div
      style={{
        minWidth: '100vw',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #0d6efd, #000)',
        color: 'white',
        margin: 0,
        padding: 0,
      }}
    >
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">MENU</Link>
          
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav ms-auto">

              {/* 👤 Bienvenida arriba del menú en responsive */}
              <li className="nav-item d-lg-none text-white px-3 pt-2">
                👋 Bienvenido, <strong>{usuario}</strong>
              </li>

              {rol === 'ADMINISTRADOR' && (
                <>
                  <li className="nav-item"><Link className="nav-link" to="/productos">Productos</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/empleados">Empleados</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/ventas">Ventas</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/consultas">Consultas</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/clientes">Clientes</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/proveedores">Proveedores</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/compras">Compras</Link></li>
                </>
              )}

              {rol === 'ALMACENISTA' && (
                <>
                  <li className="nav-item"><Link className="nav-link" to="/productos">Productos</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/consultas">Consultas</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/proveedores">Proveedores</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/compras">Compras</Link></li>
                </>
              )}

              {rol === 'VENDEDOR' && (
                <>
                  <li className="nav-item"><Link className="nav-link" to="/ventas">Ventas</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/consultas">Consultas</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/clientes">Clientes</Link></li>
                </>
              )}

              <li className="nav-item">
                <button className="btn btn-danger ms-3" onClick={handleLogout}>Cerrar sesión</button>
              </li>

            </ul>
          </div>
          {/* Bienvenida en pantallas grandes */}
          <div className="d-none d-lg-block text-white small ms-3">
            👋 Bienvenido, <strong>{usuario}</strong>
          </div>
        </div>
      </nav>

      <main className="flex-fill py-4">
        <div className="container">
          {children}
        </div>
      </main>
    </div>
  );
}

export default Layout;