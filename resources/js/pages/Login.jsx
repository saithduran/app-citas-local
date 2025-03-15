import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../css/login.css';

// Configurar Axios para enviar credenciales en todas las solicitudes
axios.defaults.withCredentials = true;

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    
    const API_URL = "https://app-citas-production.onrender.com";
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Obtener la cookie CSRF antes de enviar credenciales
            
            await axios.get(API_URL`/sanctum/csrf-cookie`);

            // Enviar credenciales con withCredentials: true
            const response = await axios.post(API_URL`/api/login`, {
                username,
                password
            }, { withCredentials: true });

            localStorage.setItem('token', response.data.token); // Guardar el token en localStorage

            // Redirigir al dashboard de citas
            navigate('/dashboard');
        } catch (error) {
            console.error('Error de autenticación:', error.response);
            setError(error.response?.data?.message || 'Credenciales incorrectas. Intenta de nuevo.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <img src="/logo3.png" alt="Logo Ministerio Altar Del Santisimo" className="login-logo" />
                <h2 className="login-title">Iniciar Sesión</h2>
                <p className="login-description">Administra tus citas de manera rápida y sencilla.</p>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Usuario:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Contraseña:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className='login-button' type="submit">Ingresar</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
