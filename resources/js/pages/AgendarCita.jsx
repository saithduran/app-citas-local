import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { es } from "date-fns/locale"; 
import 'react-datepicker/dist/react-datepicker.css'; // Estilos del calendario
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios'; // Importa Axios
import '../../css/agendarcita.css'; // Importa el archivo CSS

function AgendarCita() {
    const navigate = useNavigate();
    // Estado para la fecha seleccionada
    const [selectedDate, setSelectedDate] = useState(new Date());
    // Estado para el horario seleccionado
    const [selectedTime, setSelectedTime] = useState('');
    // Estado para el nombre y el número de celular
    const [nombre, setNombre] = useState('');
    const [celular, setCelular] = useState('');
    // Estado para los horarios disponibles
    const [horariosDisponibles, setHorariosDisponibles] = useState([]);
    // Estado para mostrar el mensaje
    const [mensajeExito, setMensajeExito] = useState(""); 
    // Estado para mensajes de error
    const [error, setError] = useState('');
    const [errorCelular, setErrorCelular] = useState('');
    // Estado para deshabilitar el botón mientras se envía la solicitud
    const [enviando, setEnviando] = useState(false);

    // Función para convertir horarios de 24 a 12 horas
    const convertirHora24a12 = (hora24) => {
        const [hora, minutos] = hora24.split(':');
        let hora12 = parseInt(hora, 10);
        const periodo = hora12 >= 12 ? 'PM' : 'AM';
        if (hora12 > 12) {
            hora12 -= 12;
        }
        if (hora12 === 0) {
            hora12 = 12;
        }
        return `${String(hora12).padStart(2, '0')}:${minutos} ${periodo}`;
    };

    // Función para convertir horarios de 12 a 24 horas
    const convertirHora12a24 = (hora12) => {
        const [hora, minutos, periodo] = hora12.match(/(\d+):(\d+) (\w+)/).slice(1);
        let hora24 = parseInt(hora, 10);
        if (periodo === 'PM' && hora24 !== 12) {
            hora24 += 12;
        }
        if (periodo === 'AM' && hora24 === 12) {
            hora24 = 0;
        }
        return `${String(hora24).padStart(2, '0')}:${minutos}`;
    };

    // Obtener los horarios disponibles cuando cambia la fecha
    const obtenerHorariosDisponibles = async (fecha) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/horarios-disponibles/${fecha}`);
            console.log('Respuesta del backend:', response.data); // Verifica la respuesta
    
            if (Array.isArray(response.data)) {
                if (response.data.length > 0) {
                    const horarios12h = response.data.map(convertirHora24a12);
                    setHorariosDisponibles(horarios12h);
                } else {
                    setHorariosDisponibles([]); // No hay horarios disponibles
                }
            } else {
                console.error('La respuesta del backend no es un array:', response.data);
            }
        } catch (error) {
            console.error('Error al obtener horarios disponibles:', error);
            setHorariosDisponibles([]); // Asegurar que se limpien los horarios si hay un error
        }
    };
    
    useEffect(() => {
        const fechaFormateada = selectedDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD
        obtenerHorariosDisponibles(fechaFormateada);
    }, [selectedDate]);

    // Función para validar el número de celular
    const validarCelular = (numero) => {
        const regex = /^\d{10}$/; // Asegura que sean exactamente 10 dígitos
        return regex.test(numero);
    };

    // Función para manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setErrorCelular('');

        // Validar que todos los campos estén completos
        if (!nombre || !celular || !selectedTime) {
            setError('Por favor, completa todos los campos.');
            return;
        }

        // Validar el número de celular
        if (!validarCelular(celular)) {
            setErrorCelular('Por favor, ingresa un número de celular válido (10 dígitos).');
            return;
        }

        setEnviando(true); // Deshabilitar botón mientras se envía

        // Crear el objeto con los datos de la cita
        const cita = {
            fecha: selectedDate.toISOString().split('T')[0], // Formato YYYY-MM-DD
            hora: convertirHora12a24(selectedTime), // Convertir a formato de 24 horas
            nombre: nombre,
            celular: celular,
        };

        try {
            // Enviar los datos al backend
            const response = await axios.post('http://localhost:8000/api/agendarcitas', cita);
            
            // Obtenemos el código de la cita
            const codigoCita = response.data.codigo; 
            // Mostramos el mensaje con el código
            setMensajeExito(`✅ Cita creada con éxito. Tu código es: ${codigoCita}. Guardalo para consultar tu cita si quieres cancelarla o modificarla después.`);
            
            // Limpiar formulario después de 30 segundos
            setTimeout(() => {
                setMensajeExito("");
                navigate("/"); // Redirige al usuario al inicio
            }, 30000);

            // Actualizar la lista de horarios disponibles
            const fechaFormateada = selectedDate.toISOString().split('T')[0];
            await obtenerHorariosDisponibles(fechaFormateada);
        } catch (error) {
            console.error('Error al agendar la cita:', error);
            setError('Hubo un error al agendar la cita. Por favor, intenta nuevamente.');
        } finally {
            setEnviando(false); // Habilitar el botón nuevamente
        }
    };


    return (
        <div className="agendar-container">
            <div className="agendar-card">
                <img src="/logo3.png" alt="Logo Ministerio Altar Del Santisimo" className="home-logo" />
                <h1 className="agendar-title">Agendar Cita</h1>
                {mensajeExito && <div className="alerta-exito">{mensajeExito}</div>} 
                {error && <p className="error-message">{error}</p>}
                {errorCelular && <p className="error-message">{errorCelular}</p>}
                <form onSubmit={handleSubmit} className="agendar-form">
                    {/* Fecha */}
                    <div className="form-group">
                        <label>Selecciona una fecha:</label>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            dateFormat="dd/MM/yyyy"
                            minDate={new Date()}
                            locale={es}
                            className="input-field"
                        />
                    </div>

                    {/* Campo para seleccionar el horario */}
                    <div className="form-group">
                        <label>Selecciona un horario:</label>
                        <select
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            required
                        >
                            <option value="">Selecciona un horario</option>
                            {horariosDisponibles.map((horario, index) => (
                                <option key={index} value={horario}>
                                    {horario}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Nombre */}
                    <div className="form-group">
                        <label>Nombre:</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ingresa tu nombre"
                            required
                            className="input-field"
                        />
                    </div>

                    {/* Celular */}
                    <div className="form-group">
                        <label>Número de celular:</label>
                        <input
                            type="tel"
                            value={celular}
                            onChange={(e) => {
                                const input = e.target.value;
                                if (/^\d{0,10}$/.test(input)) {
                                    setCelular(input);
                                    setErrorCelular('');
                                } else {
                                    setErrorCelular('Solo se permiten números y un máximo de 10 dígitos.');
                                }
                            }}
                            placeholder="Ingresa tu número de celular"
                            maxLength={10}
                            required
                            className="input-field"
                        />
                        {errorCelular && <p className="error-message">{errorCelular}</p>}
                    </div>

                    {/* Botones */}
                    <div className="button-group">
                        <button type="submit" className="agendar_buttons confirm" disabled={enviando}>
                            {enviando ? "Agendando..." : "Confirmar Cita"}
                        </button>
                        <Link to="/">
                            <button className="agendar_buttons back">Volver al Inicio</button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AgendarCita;