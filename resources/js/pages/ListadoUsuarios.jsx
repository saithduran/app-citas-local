import React, { useState, useEffect } from "react";
import Navbar from '../components/navbar';
import { Link } from "react-router-dom";
import axios from "axios";
import '../../css/listadousuarios.css'; // Importa el archivo CSS


const ListadoUsuarios = () => {
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
            <div className="agendar-container">
                <div className="agendar-card">
                    <h2>Listado de Usuarios</h2>
                    {error && <p className="error-message">{error}</p>}
                    {loading ? (
                        <p>Cargando usuarios...</p>
                    ) : (
                        <table className="user-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Celular</th>
                                    <th>Dirección</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map((usuario) => (
                                    <tr key={usuario.id}>
                                        <td>{usuario.id}</td>
                                        <td>{usuario.nombre}</td>
                                        <td>{usuario.celular}</td>
                                        <td>{usuario.direccion}</td>
                                        <td>
                                            <Link to={`/editarusuario/${usuario.id}`} className="btn-edit">Editar</Link>
                                            <button onClick={() => eliminarUsuario(usuario.id)} className="btn-delete">Eliminar</button>
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

export default ListadoUsuarios;
