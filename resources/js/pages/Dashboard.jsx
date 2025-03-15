import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import Calendario from '../components/calendario'
import axios from 'axios';

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    //endpoint
    const API_URL = "https://app-citas-production.onrender.com";
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/user`, {
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
    }, [navigate]);

    return (
        <div>
            <Navbar user={user} />
            <Calendario />
        </div>
    );
}

export default Dashboard;
