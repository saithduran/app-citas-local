import React, { useState, useEffect } from "react";
import Navbar from '../components/Navbar';
import { Link } from "react-router-dom";
import axios from "axios";
import styles from '../../css/listadousuarios.module.css';


const ListadoTutores = () => {
    const [ministros, setMinistros] = useState([]);
    const [usuarioDatos, setUsuarioDatos] = useState(null);
    const [nombre, setNombre] = useState('');
    const [celular, setCelular] = useState('');
    const [estadoMinistro, setestadoMinistro] = useState(''); // Estado por defecto
    const [loading, setLoading] = useState(true);
    const [editando, setEditando] = useState(false);
    const [mensajeExito, setMensajeExito] = useState("");
    const [error, setError] = useState("");
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
        const fetchMinistros = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/ministros', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setMinistros(response.data);
            } catch (error) {
                setError("Error al obtener usuarios.");
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMinistros();
    }, []);

    const fetchMinistro = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/ministro/${id}`,{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log(response.data);
            setUsuarioDatos(response.data);
            setNombre(response.data.nombre); // Llenamos los datos de la edición con la respuesta de la API
            setCelular(response.data.celular);
            setestadoMinistro(response.data.estado_ministro);
        } catch (error) {
            console.error('Error al obtener los detalles del usuario', error);
        }
    };

    const handleEdit = async (id) => {  // Cambié el parámetro para que reciba 'id' directamente
        console.log(id);  // Verifica que el 'id' esté siendo recibido correctamente
        if (!nombre || !celular) {
            setError('Por favor, completa todos los campos.');
            return;
        }

        try {
            await axios.put(`http://localhost:8000/api/ministro/${id}`, 
                { // Aquí van los datos a actualizar
                    nombre,
                    celular,
                    estado_ministro:estadoMinistro
                }, 
                { // Aquí se pasa la configuración con el header Authorization
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            
    
            setUsuarioDatos({
                ...usuarioDatos,
                nombre,
                celular,
                estadoMinistro
            });
    
            setMensajeExito('✅ Usuario actualizado con éxito.');
            setEditando(false);
        } catch (error) {
            console.error('Error al actualizar la cita', error);
        }
    };

    // Función para eliminar usuario
    const eliminarUsuario = async (id) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este encargado?")) {
            return;
        }

        try {
            await axios.delete(`http://localhost:8000/api/tutor/${id}`, { 
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setUsuarios(usuarios.filter((usuario) => usuario.id !== id)); // Actualiza la lista sin el usuario eliminado
        } catch (error) {
            setError("No se pudo eliminar el encargado.");
        }
    };
    
    return (
        <div>
            <Navbar user={user} />
            <div className={styles.tutoresContainer}>
                <div className={styles.tutoresCard}>
                    <h2>Listado de Ministros</h2>
                    {mensajeExito && <div className={styles.alertaExito}>{mensajeExito}</div>}
                    {error && <p className="error-message">{error}</p>}
                    {editando ? (
                        <div>
                            <label>Nombre:</label>
                            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                            <label>Número de celular:</label>
                            <input type="tel" value={celular} onChange={(e) => setCelular(e.target.value)} maxLength={10} />
                            <label>Estado del Miembro:</label>
                            <select value={estadoMinistro} onChange={(e) => setestadoMinistro(e.target.value)}>
                                <option value=""></option>
                                <option value="Activo">Activo</option>
                                <option value="Inactivo">Inactivo</option>
                            </select>
                            <button onClick={() => handleEdit(usuarioDatos.id)} className={`${styles.BtnEdit} ${styles.editar}`}>Guardar</button>  {/* Aquí ya no usamos el estado idUsuarioEdit */}
                            <button onClick={() => setEditando(false)} className={`${styles.BtnDelete} ${styles.cancelar}`}>Volver</button>
                        </div>
                    ) : (     
                        loading ? (
                            <p>Cargando ministros...</p>
                        ) : (
                            <table className={styles.userTable}>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Celular</th>
                                        <th>Estado Ministro</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ministros.map((ministro) => (
                                        <tr key={ministro.id}>
                                            <td>{ministro.nombre}</td>
                                            <td>{ministro.celular}</td>
                                            <td>
                                                {ministro.estado_ministro === 'Activo' ? '✅ Activo' : '❌ Inactivo'}
                                            </td>
                                            <td>
                                                <button onClick={() => {fetchMinistro(ministro.id);setEditando(true);}} className={styles.BtnEdit}>
                                                    Editar
                                                </button>
                                                {/* <Link to={`/editarusuario/${usuario.id}`} className={styles.BtnEdit}>Editar</Link> */}
                                                <button onClick={() => eliminarUsuario(ministro.id)} className={styles.BtnDelete}>Eliminar</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListadoTutores;
