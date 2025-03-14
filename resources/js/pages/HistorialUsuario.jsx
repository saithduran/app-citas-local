import React, { useState, useEffect } from "react";
import Navbar from '../components/navbar';
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from '../../css/listadousuarios.module.css';
import CitaModal from '../components/ModalCitaHisstorial'; // Importa el modal

const HistorialUsuario = () => {
    const { idUsuario } = useParams();
    const [usuarioCitas, setUsuarioCitas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);
    const [selectedCita, setSelectedCita] = useState(null); // Estado para la cita seleccionada
    const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal

    // Obtener la lista de usuarios
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

        const fetchCitasUsuario = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/miembroCitas/${idUsuario}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                console.log(response.data);
                setUsuarioCitas(response.data);
            } catch (error) {
                setError("Error al obtener usuarios.");
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCitasUsuario();

    }, [idUsuario]);

    const convertirHora24a12 = (hora24) => {
        if (!hora24) return "";
        const [hora, minutos] = hora24.split(':'); // Ignoramos segundos si existen
        let hora12 = parseInt(hora, 10);
        const periodo = hora12 >= 12 ? 'PM' : 'AM';
        if (hora12 > 12) hora12 -= 12;
        if (hora12 === 0) hora12 = 12;
        return `${String(hora12).padStart(2, '0')}:${minutos} ${periodo}`;
    };

    // Función para manejar el clic en el código de la cita
    const handleCitaClick = (cita) => {
        if (cita.estado === 'Finalizada' || cita.estado === 'Cancelada') {
            setSelectedCita(cita); // Establece la cita seleccionada
            setShowModal(true); // Muestra el modal
        }
    };

    return (
        <div>
            <Navbar user={user} />
            <div className={styles.tutoresContainer}>
                <div className={styles.tutoresCard}>
                    <h2>Historial de Citas</h2>

                    {loading ? (
                        <p>Cargando historial del usuario...</p>
                    ) : (
                        <table className={styles.userTable}>
                            <thead>
                                <tr>
                                    <th>Codigo Cita</th>
                                    <th>Nombre</th>
                                    <th>Celular</th>
                                    <th>Ministro</th>
                                    <th>Fecha</th>
                                    <th>Hora</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarioCitas.map((usuarioCita) => (
                                    <tr key={usuarioCita?.id}>
                                        <td>
                                            {/* Hacer clic en el código solo si el estado es "finalizada" o "cancelada" */}
                                            {(usuarioCita.estado === 'Finalizada' || usuarioCita.estado === 'Cancelada') ? (
                                                <span
                                                    className={styles.clickableCode}
                                                    onClick={() => handleCitaClick(usuarioCita)}
                                                >
                                                    {usuarioCita?.codigo}
                                                </span>
                                            ) : (
                                                <span style={{cursor: "not-allowed" }} title="La cita no está cancelada o finalizada, por esto no se puede mostrar las observaciones finales.">{usuarioCita?.codigo}</span>
                                            )}
                                        </td>
                                        <td>{usuarioCita?.usuario.nombre}</td>
                                        <td>{usuarioCita?.usuario.celular}</td>
                                        <td>{usuarioCita?.tutores.nombre}</td>
                                        <td>{usuarioCita?.fecha}</td>
                                        <td>
                                            {usuarioCita?.hora === "00:00:00"
                                                ? "Cita cancelada"
                                                : usuarioCita?.hora
                                                    ? convertirHora24a12(usuarioCita.hora)
                                                    : ''}
                                        </td>
                                        <td>
                                            {usuarioCita.estado === 'Pendiente' && '⏳ Pendiente'}
                                            {usuarioCita.estado === 'Cancelada' && '❌ Cancelada'}
                                            {usuarioCita.estado === 'Finalizada' && '✅ Finalizada'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Mostrar el modal si showModal es true */}
            {showModal && (
                <CitaModal
                    cita={selectedCita}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

export default HistorialUsuario;