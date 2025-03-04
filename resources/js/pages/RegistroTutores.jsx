import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import 'react-datepicker/dist/react-datepicker.css'; // Estilos del calendario
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Importa Axios
import styles from '../../css/registrousuarios.module.css';

const RegistroUsuarios = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [nombreCompleto, setNombreCompleto] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');
    const [mensajeExito, setMensajeExito] = useState("");
    const [error, setError] = useState('');
    const [errorCelular, setErrorCelular] = useState('');
    const [enviando, setEnviando] = useState(false);

    const validarCelular = (telefono) => {
        const regex = /^\d{10}$/;
        return regex.test(telefono);
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
                console.error('Error al obtener el usuario', error);
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

        if (!nombreCompleto || !telefono) {
            setError('Por favor, completa todos los campos.');
            return;
        }

        if (!validarCelular(telefono)) {
            setErrorCelular('Por favor, ingresa un número de celular válido (10 dígitos).');
            return;
        }

        setEnviando(true);

        const datos = {
            nombre_completo: nombreCompleto,
            telefono: telefono,
        };
        console.log(datos);
        try {
            const response = await axios.post('http://localhost:8000/api/registrartutor', datos, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setMensajeExito(`✅ Encargado creado con éxito.`);
            setTimeout(() => {
                setMensajeExito("");
                navigate("/");
            }, 30000);
        } catch (error) {
            console.error('Error al registrar el encargado:', error);
            setError('Hubo un error al registrar encargado. Por favor, intenta nuevamente.');
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div>   
        <Navbar user={user} />
        <div className={styles.agendarContainer}>
            <div className={styles.agendarCard}>
                <h2 className={styles.tituloAgendar}>Registro de Encargado</h2>
                {mensajeExito && <div className={styles.alertaExito}>{mensajeExito}</div>}
                {error && <p className={styles.errorMessage}>{error}</p>}
                {errorCelular && <p className={styles.errorMessage}>{errorCelular}</p>}
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Nombre:</label>
                        <input
                            type="text"
                            value={nombreCompleto}
                            onChange={(e) => setNombreCompleto(e.target.value)}
                            placeholder="Ingresa tu nombre"
                            required
                            className={styles.inputField}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Número de celular:</label>
                        <input
                            type="tel"
                            value={telefono}
                            onChange={(e) => {
                                const input = e.target.value;
                                if (/^\d{0,10}$/.test(input)) {
                                    setTelefono(input);
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
                        <Link to="/dashboard">
                            <button className={`${styles.agendarButtons} ${styles.back}`}>Volver al Inicio</button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>

        </div>
    );
};

export default RegistroUsuarios;