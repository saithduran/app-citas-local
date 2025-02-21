import { useState } from "react";
import api from "../api/axiosConfig"; // Asegúrate de usar la configuración de Axios

const RegistroUsuarios = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    celular: "",
    direccion: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/registrousuarios", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Usuario registrado correctamente");
      setFormData({ nombre: "", celular: "", direccion: "" }); // Limpia el formulario
    } catch (error) {
      console.error("Error al registrar usuario", error);
      alert("Hubo un problema al registrar el usuario");
    }
  };

  return (
    <div>
      <h2>Registro de Usuarios</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Celular:
          <input
            type="text"
            name="celular"
            value={formData.celular}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Dirección:
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default RegistroUsuarios;
