import React from "react";
import styles from '../../css/listadousuarios.module.css';

const CitaModal = ({ cita, onClose }) => {
    if (!cita) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h3>Detalles de la Cita</h3>
                <p><strong>Código:</strong> {cita.codigo}</p>
                <p><strong>Nombre:</strong> {cita.usuario.nombre}</p>
                <p><strong>Celular:</strong> {cita.usuario.celular}</p>
                <p><strong>Encargado:</strong> {cita.tutores.nombre_completo}</p>
                <p><strong>Fecha:</strong> {cita.fecha}</p>
                <p><strong>Hora:</strong> {cita.hora}</p>
                <p><strong>Estado:</strong> {cita.estado}</p>
                <p><strong>Observaciones:</strong> {cita.observaciones}</p>
                <button className={styles.BtnDelete} onClick={onClose}>Cerrar</button>
            </div>
        </div>
    );
};

export default CitaModal;