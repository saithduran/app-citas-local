import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Inicio from './pages/Inicio';
import AgendarCita from './pages/AgendarCita';
import ConsultarCita from './pages/ConsultarCita';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DetalleCita from './pages/DetalleCita';
import RegistroUsuarios from './pages/RegistroUsuarios';
import '../css/app.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/agendarcita" element={<PrivateRoute><AgendarCita /></PrivateRoute>} />
                <Route path="/consultarcita" element={<PrivateRoute><ConsultarCita /></PrivateRoute>} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/registrousuarios" element={<PrivateRoute><RegistroUsuarios /></PrivateRoute>} />
                <Route path="/cita/:codigo" element={<PrivateRoute><DetalleCita /></PrivateRoute>} />
            </Routes>
        </Router>
    );
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);
