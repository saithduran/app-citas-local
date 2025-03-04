import React, { useState, useEffect } from "react";
import Navbar from '../components/navbar';
import { Link } from "react-router-dom";
import axios from "axios";
import styles from '../../css/listadousuarios.module.css';


const ListadoTutores = () => {
    const [usuarios, setUsuarios] = useState([]);
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
                const response = await axios.get('http://localhost:8000/api/tutores', {
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
                    <h2>Listado de Encargados</h2>
                    {error && <p className="error-message">{error}</p>}
                    {loading ? (
                        <p>Cargando encargados...</p>
                    ) : (
                        <table className={styles.userTable}>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Telefono</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map((usuario) => (
                                    <tr key={usuario.id}>
                                        <td>{usuario.nombre_completo}</td>
                                        <td>{usuario.telefono}</td>
                                        <td>
                                            {/* <Link to={`/editarusuario/${usuario.id}`} className={styles.BtnEdit}>Editar</Link> */}
                                            <button onClick={() => eliminarUsuario(usuario.id)} className={styles.BtnDelete}>Eliminar</button>
                                        </td>
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

export default ListadoTutores;
