import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './calendario.css'; //estilos
import axios from 'axios';

function Calendario() {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate(); // ✅ Para redireccionar al detalle

    useEffect(() => {
        const fetchCitas = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/citas', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                console.log(response)
                const citas = response.data.map(cita => {
                    const fecha = cita.start || '';
                    let hora = cita.hora || '';

                    if (hora.length === 5) {
                        hora += ':00';
                    }

                    return {
                        title: cita.title+cita.usuario,
                        start: `${fecha}T${hora}`,
                        extendedProps: {
                            codigo: cita.codigo, // 📌 Pasamos el código de la cita
                        }
                    };
                });

                setEvents(citas);
            } catch (error) {
                console.error('Error al obtener las citas', error);
            }
        };

        fetchCitas();
    }, []);

    // ✅ Manejar clic en evento
    const handleEventClick = (info) => {
        const codigo = info.event.extendedProps.codigo;
        navigate(`/cita/${codigo}`); // Redirige a la página de detalles
    };

    return (
        <div style={{ maxWidth: '1100px', margin: 'auto', padding: '20px' }}>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                locale="es"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                buttonText={{
                    today: 'Hoy',
                    month: 'Mes',
                    week: 'Semana',
                    day: 'Día'
                }}
                slotMinTime="08:00:00"
                slotMaxTime="21:00:00"
                allDaySlot={false}
                slotLabelFormat={{
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                }}
                events={events}
                eventTimeFormat={{
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                }}
                eventClick={handleEventClick} // ✅ Manejador de clic en eventos
            />
        </div>
    );
}

export default Calendario;
