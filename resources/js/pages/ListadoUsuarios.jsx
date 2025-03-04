import React, { useState, useEffect } from "react";
import Navbar from '../components/navbar';
import { Link } from "react-router-dom";
import axios from "axios";
import styles from '../../css/listadousuarios.module.css';

const ListadoUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioDatos, setUsuarioDatos] = useState(null);
    const [nombre, setNombre] = useState('');
    const [celular, setCelular] = useState('');
    const [direccion, setDireccion] = useState('');
    const [mensajeExito, setMensajeExito] = useState("");
    const [editando, setEditando] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [errorCelular, setErrorCelular] = useState('');
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
        const fetchUsuarios = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/usuarios', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                setUsuarios(response.data);
            } catch (error) {
                setError("Error al obtener usuarios.");
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsuarios();

    }, []);
    
    const validarCelular = (telefono) => {
        const regex = /^\d{10}$/;
        return regex.test(telefono);
    };

    const fetchUsuario = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/usuario/${id}`,{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setUsuarioDatos(response.data);
            setNombre(response.data.nombre); // Llenamos los datos de la edición con la respuesta de la API
            setCelular(response.data.celular);
            setDireccion(response.data.direccion);
        } catch (error) {
            console.error('Error al obtener los detalles del usuario', error);
        }
    };
    
    const handleEdit = async (id) => {  // Cambié el parámetro para que reciba 'id' directamente
        console.log(id);  // Verifica que el 'id' esté siendo recibido correctamente
        if (!nombre || !celular || !direccion) {
            setError('Por favor, completa todos los campos.');
            return;
        }

        if (!validarCelular(celular)) {
            setErrorCelular('Por favor, ingresa un número de celular válido (10 dígitos).');
            return;
        }
        try {
            await axios.put(`http://localhost:8000/api/usuario/${id}`, 
                { // Aquí van los datos a actualizar
                    nombre,
                    celular,
                    direccion
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
                direccion,
            });
    
            setMensajeExito('✅ Usuario actualizado con éxito.');
            setEditando(false);
        } catch (error) {
            console.error('Error al actualizar la cita', error);
        }
    };

    // Función para eliminar usuario
    const eliminarUsuario = async (id) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
            return;
        }

        try {
            await axios.delete(`http://localhost:8000/api/usuario/${id}`, { 
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setUsuarios(usuarios.filter((usuario) => usuario.id !== id)); // Actualiza la lista sin el usuario eliminado
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            setError("No se pudo eliminar el usuario.");
        }
    };

    return (
        <div>
            <Navbar user={user} />
            <div className={styles.tutoresContainer}>
                <div className={styles.tutoresCard}>
                    <h2>Listado de Usuarios</h2>
                    {mensajeExito && <div className={styles.alertaExito}>{mensajeExito}</div>}
                    {errorCelular && <p className={styles.errorMessage}>{errorCelular}</p>}
                    {error && <p className="error-message">{error}</p>}

                    {editando ? (
                        <div>
                            <label>Nombre:</label>
                            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                            <label>Número de celular:</label>
                            <input type="tel" value={celular} onChange={(e) => setCelular(e.target.value)} maxLength={10} />
                            <label>Dirección:</label>
                            <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
                            <button onClick={() => handleEdit(usuarioDatos.id)} className={`${styles.BtnEdit} ${styles.editar}`}>Guardar</button>  {/* Aquí ya no usamos el estado idUsuarioEdit */}
                            <button onClick={() => setEditando(false)} className={`${styles.BtnDelete} ${styles.cancelar}`}>Volver</button>
                        </div>
                    ) : ( 
                        loading ? (
                            <p>Cargando usuarios...</p>
                        ) : (
                            <table className={styles.userTable}>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Celular</th>
                                        <th>Dirección</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usuarios.map((usuario) => (
                                        <tr key={usuario.id}>
                                            <td ><Link to={`/historial/${usuario.id}`}>{usuario.nombre}</Link></td>
                                            <td>{usuario.celular}</td>
                                            <td>{usuario.direccion}</td>
                                            <td>
                                                <button onClick={() => {fetchUsuario(usuario.id); setEditando(true);}} className={styles.BtnEdit}>Editar</button>  {/* Ahora directamente pasamos el ID del usuario aquí */}
                                                <button onClick={() => eliminarUsuario(usuario.id)} className={styles.BtnDelete}>Eliminar</button>
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

export default ListadoUsuarios;
