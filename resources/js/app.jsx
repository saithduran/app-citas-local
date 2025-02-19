import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Inicio from './pages/Inicio';
import AgendarCita from './pages/AgendarCita';
import ConsultarCita from './pages/ConsultarCita';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DetalleCita from './pages/DetalleCita';
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
                <Route path="/" element={<Inicio />} />
                <Route path="/agendarcita" element={<AgendarCita />} />
                <Route path="/consultarcita" element={<ConsultarCita />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/cita/:codigo" element={<DetalleCita />} />
            </Routes>
        </Router>
    );
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);
