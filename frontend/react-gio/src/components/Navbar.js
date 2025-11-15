// src/Navbar.js

import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/">Mi Empresa</Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon" />
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/productos">Productos</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/empleados">Empleados</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/clientes">Clientes</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/proveedores">Proveedores</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/ventas">Ventas</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/compras">Compras</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;