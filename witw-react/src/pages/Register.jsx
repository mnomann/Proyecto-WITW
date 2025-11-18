import { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔒 Aquí conectarás tu backend más adelante
    if (form.name && form.email && form.password.length >= 4) {
      setMsg("Cuenta creada con éxito.");
    } else {
      setMsg("Por favor completa todos los campos.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6">
        <div className="bg-white rounded shadow p-6">
          <h1 className="text-2xl font-bold mb-4">Crear cuenta</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-gray-700">Nombre</label>
              <input
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded p-2"
                placeholder="Tu nombre"
              />
            </div>

            {/* Correo */}
            <div>
              <label className="block text-gray-700">Correo</label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded p-2"
                placeholder="correo@ejemplo.com"
              />
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-gray-700">Contraseña</label>
              <input
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
                className="w-full border rounded p-2"
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="btn-primario w-full">
              Registrarse
            </button>
          </form>

          {/* Mensaje */}
          {msg && (
            <div className="mt-4 text-sm text-center text-gray-700">{msg}</div>
          )}

          <div className="mt-4 text-center">
            <Link to="/login" className="text-blue-600 text-sm">
              ¿Ya tienes cuenta? Iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
