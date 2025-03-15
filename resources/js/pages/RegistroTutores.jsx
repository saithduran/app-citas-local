import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import 'react-datepicker/dist/react-datepicker.css'; // Estilos del calendario
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Importa Axios
import styles from '../../css/registrousuarios.module.css';

const RegistroUsuarios = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [nombre, setNombre] = useState('');
    const [celular, setCelular] = useState('');
    const [mensajeExito, setMensajeExito] = useState("");
    const [error, setError] = useState('');
    const [errorCelular, setErrorCelular] = useState('');
    const [enviando, setEnviando] = useState(false);

    const validarCelular = (celular) => {
        const regex = /^\d{10}$/;
        return regex.test(celular);
    };

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
                console.error('Error al obtener el ministro', error);
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            }
        };

        fetchUser();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setErrorCelular('');

        if (!nombre || !celular) {
            setError('Por favor, completa todos los campos.');
            return;
        }

        if (!validarCelular(celular)) {
            setErrorCelular('Por favor, ingresa un número de celular válido (10 dígitos).');
            return;
        }

        setEnviando(true);

        const datos = {
            nombre,
            celular,
        };
        console.log(datos);
        try {
            const response = await axios.post('http://localhost:8000/api/registrarMinistro', datos, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setMensajeExito(`✅ Ministro creado con éxito.`);
        } catch (error) {
            console.error('Error al registrar el ministro:', error);
            setError('Hubo un error al registrar ministro. Por favor, intenta nuevamente.');
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div>   
        <Navbar user={user} />
        <div className={styles.agendarContainer}>
            <div className={styles.agendarCard}>
                <h2 className={styles.tituloAgendar}>Registro de Ministro</h2>
                {mensajeExito && <div className={styles.alertaExito}>{mensajeExito}</div>}
                {error && <p className={styles.errorMessage}>{error}</p>}
                {errorCelular && <p className={styles.errorMessage}>{errorCelular}</p>}
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Nombre:</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ingresa tu nombre"
                            required
                            className={styles.inputField}
                        />
                    </div>
                    <div className={styles.formGroup}>
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
                            className={styles.inputField}
                        />
                    </div>
                    <div className={styles.buttonGroup}>
                        <button type="submit" className={`${styles.agendarButtons} ${styles.confirm}`} disabled={enviando}>
                            {enviando ? "Agendando..." : "Confirmar Cita"}
                        </button>
                        <Link to="/listadoMinistros">
                            <button className={`${styles.agendarButtons} ${styles.back}`}>Volver al Listado</button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>

        </div>
    );
};

export default RegistroUsuarios;