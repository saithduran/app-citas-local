import React, { useState, useEffect } from "react";
import Navbar from '../components/navbar';
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from '../../css/listadousuarios.module.css';

const HistorialUsuario = () => {
    const { idUsuario } = useParams();
    const [usuarioCitas, setUsuarioCitas] = useState([]);
    const [tutores, setTutores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);

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
                const response = await axios.get(`http://localhost:8000/api/usuariocitas/${idUsuario}`, {
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

        const obtenerTutores = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/tutores', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setTutores(response.data);
            } catch (error) {
                setError("Error al obtener usuarios.");
                console.error("Error:", error);
            }
        };
        obtenerTutores();
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
                                    <th>Encargado</th>
                                    <th>Fecha</th>
                                    <th>Hora</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarioCitas.map((usuarioCita) => (
                                    <tr key={usuarioCita?.id}>
                                        <td>{usuarioCita?.codigo}</td>
                                        <td>{usuarioCita?.usuario.nombre}</td>
                                        <td>{usuarioCita?.usuario.celular}</td>
                                        <td>{usuarioCita?.tutores.nombre_completo}</td>
                                        <td>{usuarioCita?.fecha}</td>
                                        <td>{usuarioCita?.hora ? convertirHora24a12(usuarioCita.hora) : ''}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HistorialUsuario;
