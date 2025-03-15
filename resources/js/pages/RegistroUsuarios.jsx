import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import 'react-datepicker/dist/react-datepicker.css'; // Estilos del calendario
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Importa Axios
import styles from '../../css/registrousuarios.module.css';

const RegistroUsuarios = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [cedula, setCedula] = useState('');
    const [nombre, setNombre] = useState('');
    const [celular, setCelular] = useState('');
    const [fechaNacimiento, setfechaNacimiento] = useState('');
    const [direccion, setDireccion] = useState('');
    const [peticion, setPeticion] = useState('');
    const [fechaIngreso, setfechaIngreso] = useState('');
    const [mensajeExito, setMensajeExito] = useState("");
    const [error, setError] = useState('');
    const [errorCelular, setErrorCelular] = useState('');
    const [enviando, setEnviando] = useState(false);

    const validarCelular = (numero) => {
        const regex = /^\d{10}$/;
        return regex.test(numero);
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

        if (!cedula || !nombre || !celular || !direccion || !fechaNacimiento || !peticion || !fechaIngreso) {
            setError('Por favor, completa todos los campos.');
            return;
        }

        if (!validarCelular(celular)) {
            setErrorCelular('Por favor, ingresa un número de celular válido (10 dígitos).');
            return;
        }

        setEnviando(true);

        const datos = {
            cedula: cedula,
            nombre: nombre,
            celular: celular,
            fecha_nacimiento: fechaNacimiento,
            direccion: direccion,
            peticion: peticion,
            fecha_ingreso: fechaIngreso
        };

        try {
            const response = await axios.post('http://localhost:8000/api/registrarMiembro', datos, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setMensajeExito(`✅ Usuario creado con éxito.`);
        } catch (error) {
            console.error('Error al registrar el usuario:', error);
            setError('Hubo un error al registrar usuario. Por favor, intenta nuevamente.');
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div>   
        <Navbar user={user} />
        <div className={styles.agendarContainer}>
            <div className={styles.agendarCard}>
                <h2 className={styles.tituloAgendar}>Registro de Usuarios</h2>
                {mensajeExito && <div className={styles.alertaExito}>{mensajeExito}</div>}
                {error && <p className={styles.errorMessage}>{error}</p>}
                {errorCelular && <p className={styles.errorMessage}>{errorCelular}</p>}
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Cedula:</label>
                        <input
                            type="number"
                            value={cedula}
                            maxLength={10}
                            onChange={(e) => setCedula(e.target.value)}
                            placeholder="Ingresa la cedula"
                            required
                            className={styles.inputField}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Nombre:</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ingresa el nombre"
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
                    <div className={styles.formGroup}>
                        <label>Fecha de nacimmiento:</label>
                        <input
                            type="date"
                            value={fechaNacimiento}
                            onChange={(e) => setfechaNacimiento(e.target.value)}
                            placeholder="Ingresa la fecha de nacimiento"
                            required
                            className={styles.inputField}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Dirección:</label>
                        <input
                            type="text"
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
                            placeholder="Ingresa la Dirección"
                            required
                            className={styles.inputField}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Petición:</label>
                        <input
                            type="text"
                            value={peticion}
                            onChange={(e) => setPeticion(e.target.value)}
                            placeholder="Ingresa la Petición"
                            required
                            className={styles.inputField}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Fecha de ingreso:</label>
                        <input
                            type="date"
                            value={fechaIngreso}
                            onChange={(e) => setfechaIngreso(e.target.value)}
                            placeholder="Ingresa la fecha de nacimiento"
                            required
                            className={styles.inputField}
                        />
                    </div>
                    <div className={styles.buttonGroup}>
                        <button type="submit" className={`${styles.agendarButtons} ${styles.confirm}`} disabled={enviando}>
                            {enviando ? "Agendando..." : "Confirmar Cita"}
                        </button>
                        <Link to="/listadoMiembros">
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