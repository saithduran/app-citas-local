import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/navbar';
import DatePicker from 'react-datepicker';
import { es } from "date-fns/locale";
import 'react-datepicker/dist/react-datepicker.css';
import styles from '../../css/detallecita.module.css';
import Select from 'react-select'; // Para autocompletado de nombres
import axios from 'axios';

function DetalleCita() {
    const { codigo } = useParams();
    const navigate = useNavigate();
    const [cita, setCita] = useState(null);
    const [editando, setEditando] = useState(false);
    const [desarrollando, setDesarrollando] = useState(false); // Nuevo estado
    const [observaciones, setObservaciones] = useState(''); // Nuevo estado
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedMiembro, setselectedMiembro] = useState(null);
    const [miembros, setMiembros] = useState([]);
    const [idUsuario, setIdUsuario] = useState('');
    const [celular, setCelular] = useState('');
    const [selectedMinistro, setselectedMinistro] = useState(null);
    const [idMinistro, setIdMinistro] = useState('');
    const [ministros, setMinistros] = useState([]);
    const [horariosDisponibles, setHorariosDisponibles] = useState([]);
    const [mensajeExito, setMensajeExito] = useState("");
    const [error, setError] = useState('');
    const [errorCelular, setErrorCelular] = useState('');
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

        const obtenerMiembros = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/miembros', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setMiembros(response.data);
            } catch (error) {
                setError("Error al obtener usuarios.");
                console.error("Error:", error);
            }
        };
        obtenerMiembros();

        const obtenerMinistros = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/ministros', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setMinistros(response.data);
            } catch (error) {
                setError("Error al obtener ministros.");
                console.error("Error:", error);
            }
        };
        obtenerMinistros();
    }, [navigate]);

    // Obtener detalles de la cita
    useEffect(() => {
        const fetchCita = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/cita/${codigo}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setCita(response.data);
                setSelectedDate(response.data.fecha ? new Date(response.data.fecha + "T00:00:00") : new Date());
                setSelectedTime(convertirHora24a12(response.data.hora));

                if (response.data.tutores) {
                    setselectedMinistro({
                        label: response.data.tutores.nombre,
                        value: response.data.tutores.id
                    });
                }

                if (response.data.usuario) {
                    setselectedMiembro({
                        label: response.data.usuario.nombre,
                        celular: response.data.usuario.celular,
                        value: response.data.usuario.id
                    });
                }
            } catch (error) {
                console.error('Error al obtener los detalles de la cita', error);
            }
        };
        fetchCita();
    }, [codigo]);

    // Obtener horarios disponibles
    useEffect(() => {
        if (!selectedDate) return;
        const fechaISO = selectedDate.toISOString().split('T')[0];

        const obtenerHorariosDisponibles = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/horariosDisponibles/${fechaISO}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (Array.isArray(response.data)) {
                    setHorariosDisponibles(response.data.map(convertirHora24a12));
                }
            } catch (error) {
                console.error('Error al obtener horarios disponibles', error);
            }
        };
        obtenerHorariosDisponibles();
    }, [selectedDate]);

    const convertirHora24a12 = (hora24) => {
        if (!hora24) return "";
        const [hora, minutos] = hora24.split(':');
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

    const handleseleccionMiembro = (selectedOption) => {
        setselectedMiembro(selectedOption);
        setCelular(selectedOption.celular);
        setIdUsuario(selectedOption.value);
    };

    const handleseleccionMinistro = (selectedOption) => {
        setselectedMinistro(selectedOption);
        setIdMinistro(selectedOption.value);
    };

    const handleEdit = async () => {
        const datos = {
            usuario_id: selectedMiembro.value,
            tutor_id: selectedMinistro.value,
            fecha: selectedDate.toISOString().split('T')[0],
            hora: convertirHora12a24(selectedTime),
        };

        try {
            const response = await axios.put(
                `http://localhost:8000/api/cita/${codigo}`,datos,{
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            setCita({
                ...cita,
                usuario_id: selectedMiembro.value,
                tutor_id: selectedMinistro.value,
                fecha: selectedDate.toISOString().split('T')[0],
                hora: convertirHora12a24(selectedTime),
            });

            setMensajeExito('✅ Cita actualizada con éxito.');
            setEditando(false);
        } catch (error) {
            console.error('Error al actualizar la cita', error);
            if (error.response) {
                console.error("Respuesta de error del servidor:", error.response.data);
            }
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
            navigate('/dashboard');
        } catch (error) {
            console.error('Error al cancelar la cita', error);
        }
    };

    const handleDesarrollar = async () => {
        if (!observaciones) {
            alert('Por favor, ingresa las observaciones.');
            return;
        }

        try {
            const response = await axios.put(
                `http://localhost:8000/api/citaDesarrollo/${codigo}`,
                {
                    estado: 'Finalizada',
                    observaciones: observaciones,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            setCita({
                ...cita,
                estado: 'Finalizada',
                observaciones: observaciones,
            });

            setMensajeExito('✅ Cita desarrollada.');
            setDesarrollando(false);
        } catch (error) {
            console.error('Error al actualizar la cita', error);
            if (error.response) {
                console.error('Respuesta de error del servidor:', error.response.data);
            }
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
                            <Select
                                options={miembros.map(miembro => ({ 
                                    label: miembro.nombre, 
                                    value: miembro.id 
                                }))}
                                onChange={handleseleccionMiembro}
                                placeholder="Ingresa o selecciona un nombre"
                                className="input-field"
                                value={selectedMiembro}
                            />
                            {/* <label className='mt-3'>Celular:</label>
                            <input type="tel" value={celular} onChange={(e) => setCelular(e.target.value)} className="input-field" maxLength={10} disabled/> */}
                            <label className='mt-3'>Encargado:</label>
                            <Select
                                options={ministros.map(ministro => ({
                                    label: ministro.nombre,
                                    value: ministro.id
                                }))}
                                onChange={handleseleccionMinistro}
                                placeholder="Ingresa o selecciona un nombre"
                                className="input-field"
                                value={selectedMinistro}
                            />
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
                            <p><strong>Celular:</strong> {cita?.usuario.celular}</p>
                            <p><strong>Ministro:</strong> {cita?.tutores.nombre}</p>
                            <p><strong>Fecha:</strong> {cita?.fecha}</p>
                            <p><strong>Hora:</strong> {cita?.hora ? convertirHora24a12(cita.hora) : ''}</p>
                            <p><strong>Estado:</strong> {cita?.estado}</p>

                            {/* Botón de Editar */}
                            {cita?.estado !== 'Cancelada' && cita?.estado !== 'Finalizada' && (
                                <button onClick={() => setEditando(true)} className={`${styles.detalleButtons} ${styles.editar}`}>
                                    Editar
                                </button>
                            )}

                            {/* Botón de Cancelar Cita */}
                            {cita?.estado !== 'Cancelada' && cita?.estado !== 'Finalizada' && (
                                <button onClick={handleDelete} className={`${styles.detalleButtons} ${styles.cancelar}`}>
                                    Cancelar Cita
                                </button>
                            )}

                            {/* Botón de Iniciar Desarrollo */}
                            {cita?.estado === 'Pendiente' && (
                                <button
                                    onClick={() => setDesarrollando(true)}
                                    className={`${styles.detalleButtons} ${styles.desarrollar}`}
                                >
                                    Iniciar Desarrollo
                                </button>
                            )}

                            {/* Botón de Volver al Inicio */}
                            <Link to="/dashboard">
                                <button className={`${styles.detalleButtons} ${styles.back}`}>Volver al Inicio</button>
                            </Link>
                        </div>
                    )}

                    {desarrollando && (
                        <div>
                            <label className='mt-3'>Observaciones:</label>
                            <textarea
                                value={observaciones}
                                onChange={(e) => setObservaciones(e.target.value)}
                                className="input-field"
                                placeholder="Escribe las observaciones aquí"
                            />
                            <button onClick={handleDesarrollar} className={`${styles.detalleButtons} ${styles.guardar}`}>
                                Guardar Observaciones
                            </button>
                            <button onClick={() => setDesarrollando(false)} className={`${styles.detalleButtons} ${styles.cancelar}`}>
                                Cancelar
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DetalleCita;