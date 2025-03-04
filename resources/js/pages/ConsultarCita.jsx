import React, { useState, useEffect } from 'react';
//import DatePicker from 'react-datepicker';
//import { es } from "date-fns/locale"; 
import 'react-datepicker/dist/react-datepicker.css'; // Estilos del calendario
//import { Link,useNavigate } from 'react-router-dom';
//import axios from 'axios'; // Importa Axios
import '../../css/consultarcita.module.css';

function ConsultarCita() {
    const handleSubmit = async (e) => {
        e.preventDefault();
    };
    return (
        <div className="agendar-container">
            <div className="agendar-card">
                <h1 className="agendar-title">Consultar Cita</h1>
                {/* Mensaje de éxito */}
                {/* {mensajeExito && <div className="alerta-exito">{mensajeExito}</div>}  */}
                {/* Mensaje de error */}
                {/* {error && <p className="error-message">{error}</p>} */}

                <form onSubmit={handleSubmit} className="agendar-form">

                </form>
            </div>
        </div>
    );
}

export default ConsultarCita;