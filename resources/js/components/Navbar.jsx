import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './navbar.css';

function Navbar({ user }) {
    const navigate = useNavigate();
    const [isDropdownOpenUsuarios, setIsDropdownOpenUsuarios] = useState(false);
    const [isDropdownOpenEncargados, setIsDropdownOpenEncargados] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8000/api/logout', {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            localStorage.removeItem('token');
            navigate('/login');
        } catch (error) {
            console.error('Error al cerrar sesión', error);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Logo */}
                <Link to="/dashboard" className="navbar-logo">
                    <img src="/logo3-mb.png" alt="Logo Ministerio Altar Del Santisimo" className="navbar-logo" />
                </Link>

                {/* Botón de menú móvil */}
                <button className="navbar-toggle" onClick={() => setIsOpen(!isOpen)}>
                    &#9776; {/* Ícono de hamburguesa */}
                </button>

                {/* Menú principal */}
                <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
                    <Link to="/dashboard" className="navbar-item">Calendario</Link>
                    <Link to="/agendarcita" className="navbar-item">Agendar Cita</Link>
                    <div className="navbar-dropdown">
                        <button
                            className="navbar-item dropdown-toggle"
                            onClick={() => setIsDropdownOpenUsuarios(!isDropdownOpenUsuarios)}
                        >
                            Usuarios
                        </button>

                        {/* Menú desplegable */}
                        <div className={`dropdown-menu ${isDropdownOpenUsuarios ? 'active' : ''}`}>
                            <Link to="/registrousuarios" className="dropdown-item">Registro de Usuario</Link>
                            <Link to="/listadousuarios" className="dropdown-item">Listado de Usuarios</Link>
                        </div>
                    </div>
                    {/* Dropdown para el usuario */}
                    <div className="navbar-dropdown">
                        <button
                            className="navbar-item dropdown-toggle"
                            onClick={() => setIsDropdownOpenEncargados(!isDropdownOpenEncargados)}
                        >
                            Encargado
                        </button>

                        {/* Menú desplegable */}
                        <div className={`dropdown-menu ${isDropdownOpenEncargados ? 'active' : ''}`}>
                            <Link to="/registrotutores" className="dropdown-item">Registro de Encargado</Link>
                            <Link to="/listadotutores" className="dropdown-item">Listado de Encargados</Link>
                        </div>
                    </div>
                    <button className="navbar-item logout" onClick={handleLogout}>Cerrar Sesión</button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
