import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css'; // Estilos del calendario
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios'; // Importa Axios
import '../../css/agendarcita.css'; // Importa el archivo CSS

const RegistroUsuarios = () => {
    const navigate = useNavigate();
    // Estado para el nombre y el número de celular
    const [nombre, setNombre] = useState('');
    const [celular, setCelular] = useState('');
    const [direccion, setDireccion] = useState('');
    // Estado para mostrar el mensaje
    const [mensajeExito, setMensajeExito] = useState(""); 
    // Estado para mensajes de error
    const [error, setError] = useState('');
    const [errorCelular, setErrorCelular] = useState('');
    // Estado para deshabilitar el botón mientras se envía la solicitud
    const [enviando, setEnviando] = useState(false);

    // Función para validar el número de celular
    const validarCelular = (numero) => {
      const regex = /^\d{10}$/; // Asegura que sean exactamente 10 dígitos
      return regex.test(numero);
    };

    // Función para manejar el envío del formulario
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setErrorCelular('');

      // Validar que todos los campos estén completos
      if (!nombre || !celular || !direccion) {
          setError('Por favor, completa todos los campos.');
          return;
      }

      // Validar el número de celular
      if (!validarCelular(celular)) {
          setErrorCelular('Por favor, ingresa un número de celular válido (10 dígitos).');
          return;
      }

      setEnviando(true); // Deshabilitar botón mientras se envía

      // Crear el objeto con los datos de la cita
      const datos = {
          nombre: nombre,
          celular: celular,
          direccion: direccion
      };
      console.log(datos)
      try {
          // Enviar los datos al backend
          const response = await axios.post('http://localhost:8000/api/registrarusuarios', datos, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          // Mostramos el mensaje con el código
          setMensajeExito(`✅ Usuario creado con éxito.`);
          
          // Limpiar formulario después de 30 segundos
          setTimeout(() => {
              setMensajeExito("");
              navigate("/"); // Redirige al usuario al inicio
          }, 30000);
      } catch (error) {
          console.error('Error al registrar el usuario:', error);
          setError('Hubo un error al registrar usuario. Por favor, intenta nuevamente.');
      } finally {
          setEnviando(false); // Habilitar el botón nuevamente
      }
  };

  return (
    <div className="agendar-container">
      <div className="agendar-card">
        <h2>Registro de Usuarios</h2>
        {mensajeExito && <div className="alerta-exito">{mensajeExito}</div>} 
        {error && <p className="error-message">{error}</p>}
        {errorCelular && <p className="error-message">{errorCelular}</p>}
        <form onSubmit={handleSubmit}>
          {/* Nombre */}
          <div className="form-group">
              <label>Nombre:</label>
              <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ingresa tu nombre"
                  required
                  className="input-field"
              />
          </div>
          {/* Celular */}
          <div className="form-group">
            <label>Número de celular:</label>
            <input
                type="tel"
                value={celular}
                onChange={(e) => {
                    const input = e.target.value;
                    if (/^\d{0,10}$/.test(input)) {
                        setCelular(input);
                        setErrorCelular('');
                    } else {
                        setErrorCelular('Solo se permiten números y un máximo de 10 dígitos.');
                    }
                }}
                placeholder="Ingresa tu número de celular"
                maxLength={10}
                required
                className="input-field"
            />
            {errorCelular && <p className="error-message">{errorCelular}</p>}
        </div>
          {/* Dirección */}
          <div className="form-group">
              <label>Dirección:</label>
              <input
                  type="text"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder="Ingresa la Dirección"
                  required
                  className="input-field"
              />
          </div>
          {/* Botones */}
          <div className="button-group">
              <button type="submit" className="agendar_buttons confirm" disabled={enviando}>
                  {enviando ? "Agendando..." : "Confirmar Cita"}
              </button>
              <Link to="/dashboard">
                  <button className="agendar_buttons back">Volver al Inicio</button>
              </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistroUsuarios;
