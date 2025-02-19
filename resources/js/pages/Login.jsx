import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../css/login.css';

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Autenticación con Laravel Sanctum
            await axios.get('http://localhost:8000/sanctum/csrf-cookie'); // Obtener la cookie CSRF
            const response = await axios.post('http://localhost:8000/api/login', {
                username,
                password
            });

            localStorage.setItem('token', response.data.token); // Guardar el token en localStorage

            // Redirigir al dashboard de citas
            navigate('/dashboard');
        } catch (error) {
            setError('Credenciales incorrectas. Intenta de nuevo.');
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
                        <label>Usario:</label>
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
