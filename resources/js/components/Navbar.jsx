import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './navbar.css';

function Navbar({ user }) {
    const navigate = useNavigate();
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
                <Link to="/dashboard" className="navbar-logo">AdminCitas</Link>
                <button className="navbar-toggle" onClick={() => setIsOpen(!isOpen)}>
                    &#9776;
                </button>
                <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
                    <Link to="/dashboard" className="navbar-item">Dashboard</Link>
                    {user && <span className="navbar-user">{user.username}</span>}
                    <button className="navbar-item logout" onClick={handleLogout}>Cerrar Sesión</button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
