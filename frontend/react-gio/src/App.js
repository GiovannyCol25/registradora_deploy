// src/App.js

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import Login from './pages/Login';
import Layout from './components/Layout';
import ProductosPage from './pages/ProductosPage';
import EmpleadosPage from './pages/EmpleadosPage';
import ClientesPage from './pages/ClientesPage';
import ProveedoresPage from './pages/ProveedoresPage';
import VentasPage from './pages/VentasPage';
import ConsultasPage from './pages/ConsultasPage';
import ComprasPage from './pages/ComprasPage';
import ProtectedRoute from './components/ProtectedRoute';
import Menu from './pages/Menu';
import { isAuthenticated } from './utils/auth';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>

        {/* Redirección raíz */}
        <Route path="/" element={<Navigate to={isAuthenticated() ? "/menu" : "/login"} />} />

        {/* Página de login (sin Layout) */}
        <Route path="/login" element={<Login />} />

        {/* Páginas protegidas (todas dentro de Layout) */}
        <Route path="/menu" element={
          <ProtectedRoute rolesPermitidos={['ADMINISTRADOR', 'VENDEDOR', 'ALMACENISTA']}>
            <Layout><Menu /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/productos" element={
          <ProtectedRoute rolesPermitidos={['ADMINISTRADOR', 'VENDEDOR', 'ALMACENISTA']}>
            <Layout><ProductosPage /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/empleados" element={
          <ProtectedRoute rolesPermitidos={['ADMINISTRADOR']}>
            <Layout><EmpleadosPage /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/clientes" element={
          <ProtectedRoute rolesPermitidos={['ADMINISTRADOR', 'VENDEDOR']}>
            <Layout><ClientesPage /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/proveedores" element={
          <ProtectedRoute rolesPermitidos={['ADMINISTRADOR', 'ALMACENISTA']}>
            <Layout><ProveedoresPage /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/ventas" element={
          <ProtectedRoute rolesPermitidos={['ADMINISTRADOR', 'VENDEDOR']}>
            <Layout><VentasPage /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/consultas" element={
          <ProtectedRoute rolesPermitidos={['ADMINISTRADOR', 'VENDEDOR', 'ALMACENISTA']}>
            <Layout><ConsultasPage /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/compras" element={
          <ProtectedRoute rolesPermitidos={['ADMINISTRADOR', 'ALMACENISTA']}>
            <Layout><ComprasPage /></Layout>
          </ProtectedRoute>
        } />


        {/* Página de 404 si no encuentra ruta */}
        <Route path="*" element={<Layout><h2>Página no encontrada</h2></Layout>} />

      </Routes>
    </Router>
  );
}

export default App;
