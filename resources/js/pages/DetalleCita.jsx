import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/navbar';
import DatePicker from 'react-datepicker';
import { es } from "date-fns/locale";
import 'react-datepicker/dist/react-datepicker.css';
import styles from '../../css/detallecita.module.css';
import axios from 'axios';

function DetalleCita() {
    const { codigo } = useParams();
    const navigate = useNavigate();
    const [cita, setCita] = useState(null);
    const [editando, setEditando] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState('');
    const [nombre, setNombre] = useState('');
    const [celular, setCelular] = useState('');
    const [tutor, setTutor] = useState('');
    const [horariosDisponibles, setHorariosDisponibles] = useState([]);
    const [mensajeExito, setMensajeExito] = useState("");
    const [error, setError] = useState('');
    const [errorCelular, setErrorCelular] = useState('');
    //Capturar usuario para dshboard
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/user', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setUser(response.data);
            } catch (error) {
                console.error('Error al obtener el usuario', error);
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            }
        };

        fetchUser();
    }, [navigate]);

    const convertirHora24a12 = (hora24) => {
        if (!hora24) return "";
        const [hora, minutos] = hora24.split(':'); // Ignoramos segundos si existen
        let hora12 = parseInt(hora, 10);
        const periodo = hora12 >= 12 ? 'PM' : 'AM';
        if (hora12 > 12) hora12 -= 12;
        if (hora12 === 0) hora12 = 12;
        return `${String(hora12).padStart(2, '0')}:${minutos} ${periodo}`;
    };
    
    const convertirHora12a24 = (hora12) => {
        const [hora, minutos, periodo] = hora12.match(/(\d+):(\d+) (\w+)/).slice(1);
        let hora24 = parseInt(hora, 10);
        if (periodo === 'PM' && hora24 !== 12) hora24 += 12;
        if (periodo === 'AM' && hora24 === 12) hora24 = 0;
        return `${String(hora24).padStart(2, '0')}:${minutos}`;
    };

    useEffect(() => {
        const fetchCita = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/cita/${codigo}`,{
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                // console.log(response)
                setCita(response.data);
                setNombre(response.data.usuario.nombre);
                setTutor(response.data.tutores.nombre_completo);
                setCelular(response.data.usuario.celular);
                setSelectedDate(response.data.fecha ? new Date(response.data.fecha + "T00:00:00") : new Date());
                setSelectedTime(convertirHora24a12(response.data.hora));
            } catch (error) {
                console.error('Error al obtener los detalles de la cita', error);
            }
        };
        fetchCita();
    }, [codigo]);

    useEffect(() => {
        if (!selectedDate) return;
        const fechaISO = selectedDate.toISOString().split('T')[0];
    
        const obtenerHorariosDisponibles = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/horarios-disponibles/${fechaISO}`);
                if (Array.isArray(response.data)) {
                    setHorariosDisponibles(response.data.map(convertirHora24a12));
                }
            } catch (error) {
                console.error('Error al obtener horarios disponibles', error);
            }
        };
    
        obtenerHorariosDisponibles();
    }, [selectedDate]);    

    const handleEdit = async () => {
        if (!selectedTime || !selectedDate) {
            setError('Por favor, completa todos los campos.');
            return;
        }
        try {
            await axios.put(`http://localhost:8000/api/cita/${codigo}`, 
                {
                // nombre,
                // celular,
                fecha: selectedDate.toISOString().split('T')[0],
                hora: convertirHora12a24(selectedTime),
                }, 
                { // Aquí se pasa la configuración con el header Authorization
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
    
            setCita({
                ...cita,
                // nombre,
                // celular,
                fecha: selectedDate.toISOString().split('T')[0],
                hora: convertirHora12a24(selectedTime),
            });
    
            setMensajeExito('✅ Cita actualizada con éxito.');
            setEditando(false);
        } catch (error) {
            console.error('Error al actualizar la cita', error);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('¿Estás seguro de que quieres cancelar esta cita?')) return;

        try {
            await axios.delete(`http://localhost:8000/api/cita/${codigo}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            alert('Cita cancelada con éxito');
            navigate('/dashboard'); // Redirige al calendario después de cancelar
        } catch (error) {
            console.error('Error al cancelar la cita', error);
        }
    };

    return (
        <div>
            <Navbar user={user} />
            <div className={styles.detalleContainer}>
                <div className={styles.detalleCard}>
                    <h2 className="detalle-title">Detalles de la Cita</h2>
                    {mensajeExito && <div className="alerta-exito">{mensajeExito}</div>}
                    {error && <p className="error-message">{error}</p>}
                    {errorCelular && <p className="error-message">{errorCelular}</p>}
                    {editando ? (
                        <div>
                            <label className='mt-3'>Nombre:</label>
                            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} disabled/>
                            <label className='mt-3'>Celular:</label>
                            <input type="tel" value={celular} onChange={(e) => setCelular(e.target.value)} className="input-field" maxLength={10} disabled/>
                            <label className='mt-3'>Encargado:</label>
                            <input type="text" value={tutor} onChange={(e) => setTutor(e.target.value)} disabled/>
                            <label className='mt-3'>Fecha:</label>
                            <DatePicker selected={selectedDate} onChange={setSelectedDate} dateFormat="dd/MM/yyyy" minDate={new Date()} locale={es} className="input-field"/>
                            <label className='mt-3'>Hora:</label>
                            <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
                                <option value="">Selecciona un horario</option>
                                {horariosDisponibles.map((horario, index) => (
                                    <option key={index} value={horario}>{horario}</option>
                                ))}
                            </select>
                            <button onClick={handleEdit} className={`${styles.detalleButtons} ${styles.editar}`}>Guardar</button>
                            <button onClick={() => setEditando(false)} className={`${styles.detalleButtons} ${styles.cancelar}`}>Volver</button>
                        </div>
                    ) : (
                        <div>
                            <p><strong>Nombre:</strong> {cita?.usuario.nombre}</p>
                            <p><strong>Fecha:</strong> {cita?.fecha}</p>
                            <p><strong>Encargado:</strong> {cita?.tutores.nombre_completo}</p>
                            <p><strong>Hora:</strong> {cita?.hora ? convertirHora24a12(cita.hora) : ''}</p>
                            <p><strong>Celular:</strong> {cita?.usuario.celular}</p>
                            <button onClick={() => setEditando(true)} className={`${styles.detalleButtons} ${styles.editar}`}>Editar</button>
                            <button onClick={handleDelete} className={`${styles.detalleButtons} ${styles.cancelar}`}>Cancelar Cita</button>
                            <Link to="/dashboard">
                                <button className={`${styles.detalleButtons} ${styles.back}`}>Volver al Inicio</button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DetalleCita;
