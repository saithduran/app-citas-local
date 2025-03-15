import React, { useState, useEffect } from "react";
import Navbar from '../components/Navbar';
import { Link } from "react-router-dom";
import axios from "axios";
import styles from '../../css/listadousuarios.module.css';

const ListadoUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [usuarioDatos, setUsuarioDatos] = useState(null);
    const [cedula, setCedula] = useState('');
    const [nombre, setNombre] = useState('');
    const [celular, setCelular] = useState('');
    const [fechaNacimiento, setfechaNacimiento] = useState('');
    const [direccion, setDireccion] = useState('');
    const [peticion, setPeticion] = useState('');
    const [fechaIngreso, setfechaIngreso] = useState('');
    const [estadoMiembro, setestadoMiembro] = useState(''); // Estado por defecto
    const [mensajeExito, setMensajeExito] = useState("");
    const [editando, setEditando] = useState(false);
    const [loading, setLoading] = useState(true);
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
        const fetchUsuarios = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/miembros', {
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
            const response = await axios.get(`http://localhost:8000/api/miembro/${id}`,{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log(response.data);
            setUsuarioDatos(response.data);
            setCedula(response.data.cedula);
            setNombre(response.data.nombre); // Llenamos los datos de la edición con la respuesta de la API
            setCelular(response.data.celular);
            setfechaNacimiento(response.data.fecha_nacimiento);
            setDireccion(response.data.direccion);
            setPeticion(response.data.peticion);
            setfechaIngreso(response.data.fecha_ingreso);
            setestadoMiembro(response.data.estado_miembro);
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
            await axios.put(`http://localhost:8000/api/miembro/${id}`, 
                { // Aquí van los datos a actualizar
                    cedula,
                    nombre,
                    celular,
                    fecha_nacimiento:fechaNacimiento, // Asegúrate de que esté en el formato correcto
                    direccion,
                    peticion,
                    fecha_ingreso:fechaIngreso, // Asegúrate de que esté en el formato correcto
                    estado_miembro:estadoMiembro,
                }, 
                { // Aquí se pasa la configuración con el header Authorization
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            
    
            setUsuarioDatos({
                ...usuarioDatos,
                cedula,
                nombre,
                celular,
                fechaNacimiento,
                direccion,
                peticion,
                fechaIngreso,
                estadoMiembro
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
            await axios.delete(`http://localhost:8000/api/miembro/${id}`, { 
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

    const filtrarMiembros = usuarios.filter((usuario) => 
        usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
        String(usuario.cedula).includes(busqueda) // Convertir cédula a string
    );

    const obtenerCumpleañosProximos = () => {
        const hoy = new Date();
        return usuarios.filter((usuario) => {
            if (!usuario.fecha_nacimiento) return false; // Si no tiene fecha, lo ignoramos
    
            const fechaNacimiento = new Date(usuario.fecha_nacimiento);
            const cumpleEsteAño = new Date(hoy.getFullYear(), fechaNacimiento.getMonth(), fechaNacimiento.getDate());
    
            const diferenciaDias = Math.floor((cumpleEsteAño - hoy) / (1000 * 60 * 60 * 24));
    
            return diferenciaDias >= 0 && diferenciaDias <= 7; // Cumpleaños en los próximos 7 días
        });
    };
    
    const usuariosCumpleaños = obtenerCumpleañosProximos();
    
    
    return (
        <div>
            <Navbar user={user} />
            <div className={styles.tutoresContainer}>
                <div className={styles.tutoresCard}>
                    {usuariosCumpleaños.length > 0 && (
                        <div className={styles.cumpleaniosContainer}>
                            <h3>🎉 Próximos Cumpleaños</h3>
                            <ul>
                                {usuariosCumpleaños.map((usuario) => (
                                    <li key={usuario.id}>
                                        {usuario.nombre} - {new Date(usuario.fecha_nacimiento).toLocaleDateString('es-ES', { day: '2-digit', month: 'long' })}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <h2>Listado de Miembros</h2>
                    {mensajeExito && <div className={styles.alertaExito}>{mensajeExito}</div>}
                    {error && <p className="error-message">{error}</p>}
                    
                    {editando ? (
                        <div>
                            <label>Cedula:</label>
                            <input type="text" value={cedula} onChange={(e) => setCedula(e.target.value)} />
                            <label>Nombre:</label>
                            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                            <label>Número de celular:</label>
                            <input type="tel" value={celular} onChange={(e) => setCelular(e.target.value)} maxLength={10} />
                            <label>Fecha de Nacimiento:</label>
                            <input type="date" value={fechaNacimiento} onChange={(e) => setfechaNacimiento(e.target.value)} />
                            <label>Dirección:</label>
                            <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
                            <label>Petición:</label>
                            <input type="text" value={peticion} onChange={(e) => setPeticion(e.target.value)} />
                            <label>Fecha de Ingreso:</label>
                            <input type="date" value={fechaIngreso} onChange={(e) => setfechaIngreso(e.target.value)} />
                            <label>Estado del Miembro:</label>
                            <select value={estadoMiembro} onChange={(e) => setestadoMiembro(e.target.value)}>
                                <option value="Activo">Activo</option>
                                <option value="Inactivo">Inactivo</option>
                            </select>
                            <button onClick={() => handleEdit(usuarioDatos.id)} className={`${styles.BtnEdit} ${styles.editar}`}>Guardar</button>  {/* Aquí ya no usamos el estado idUsuarioEdit */}
                            <button onClick={() => setEditando(false)} className={`${styles.BtnDelete} ${styles.cancelar}`}>Volver</button>
                        </div>
                    ) : (     
                        loading ? (
                            <p>Cargando usuarios...</p>
                        ) : (
                            <div className={styles.searchContainer}>
                                <input
                                    className={styles.searchUsers}
                                    type="text"
                                    placeholder="Buscar por cédula o nombre"
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                />
                    
                                {/* Tabla de usuarios */}
                                <table className={styles.userTable}>
                                    <thead>
                                        <tr>
                                            <th>Cedula</th>
                                            <th>Nombre</th>
                                            <th>Celular</th>
                                            <th>Fecha Nacimiento</th>
                                            <th>Dirección</th>
                                            <th>Petición</th>
                                            <th>Fecha Ingreso</th>
                                            <th>Estado Miembro</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtrarMiembros.map((usuario) => (
                                            <tr key={usuario.id}>
                                                <td>{usuario.cedula}</td>
                                                <td>
                                                    <Link to={`/historial/${usuario.id}`}>{usuario.nombre}</Link>
                                                </td>
                                                <td>{usuario.celular}</td>
                                                <td>{usuario.fecha_nacimiento}</td>
                                                <td>{usuario.direccion}</td>
                                                <td>{usuario.peticion}</td>
                                                <td>{usuario.fecha_ingreso}</td>
                                                <td>
                                                    {usuario.estado_miembro === 'Activo' ? '✅ Activo' : '❌ Inactivo'}
                                                </td>
                                                <td>
                                                    <button
                                                        onClick={() => {
                                                            fetchUsuario(usuario.id);
                                                            setEditando(true);
                                                        }}
                                                        className={styles.BtnEdit}
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => eliminarUsuario(usuario.id)}
                                                        className={styles.BtnDelete}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListadoUsuarios;
