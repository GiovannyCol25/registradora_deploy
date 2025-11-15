// src/pages/Menu.js
import React from 'react';
import { getUsuario } from '../utils/auth';
import '../App.css';

const Menu = () => {
  const usuario = getUsuario();
  
  return (
    <div className="text-center text-white mt-5">
      <h2 className="mb-4">🎉 Bienvenido al sistema Registradora</h2>
      <p className="lead">Hola <strong>{usuario}</strong>, utiliza la barra de navegación superior para acceder a las secciones disponibles según tu rol.</p>
    </div>
  );
};

export default Menu;
