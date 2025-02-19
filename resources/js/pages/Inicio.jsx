import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/inicio.css';

function Inicio() {
    return (
        <div className="home-container">
            <div className="home-card">
                <img src="/logo3.png" alt="Logo Ministerio Altar Del Santisimo" className="home-logo" />
                <h1 className="home-title">Bienvenido a nuestra plataforma de citas</h1>
                <p className="home-description">Agenda y consulta tus citas de manera rápida y sencilla.</p>
                <div className="mt-6 space-y-4 w-full">              
                    <Link to="/agendarcita" className="home-button agendar">Agendar Cita</Link>
                    <Link to="/consultarcita" className="home-button consultar">Consultar Cita</Link>
                </div>
            </div>
        </div>
    );
}

export default Inicio;
