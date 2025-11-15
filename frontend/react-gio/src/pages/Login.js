// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../App.css';

const Login = () => {
    const [login, setLogin] = useState('');
    const [clave, setClave] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login, clave })
            });

            if (response.ok) {
                const data = await response.json();
                sessionStorage.setItem('token', data.jwtToken);
                localStorage.setItem('rol', data.rol.toUpperCase()); 
                navigate('/menu');
            } else {
                setError('Autenticación inválida. Por favor, verifica tus credenciales.');
            }
        } catch (error) {
            setError('Error de conexión con el servidor');
            //console.error(error);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-gradient">
            <div className="card bg-dark text-white shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
                <h3 className="text-center mb-4">Iniciar Sesión</h3>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor='login' className="form-label">Usuario</label>
                        <input
                            id="login"
                            name="login"
                            type="text"
                            className="form-control input-dark"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor='clave' className="form-label">Contraseña</label>
                        <input
                            id="clave"
                            name="clave"
                            type="password"
                            className="form-control input-dark"
                            value={clave}
                            onChange={(e) => setClave(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="alert alert-danger text-center">{error}</div>}

                    <button type="submit" className="btn btn-primary w-100">Ingresar</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
