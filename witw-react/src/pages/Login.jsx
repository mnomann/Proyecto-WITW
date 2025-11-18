import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ❗ Aquí conectarás tu backend más adelante
    if (form.email === "admin@demo.com" && form.password === "1234") {
      setMsg("Inicio de sesión exitoso");
    } else {
      setMsg("Credenciales incorrectas");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6">
        <div className="bg-white rounded shadow p-6">
          <h1 className="text-2xl font-bold mb-4">Iniciar sesión</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="flex items-center justify-between">
              <button type="submit" className="btn-primario">
                Entrar
              </button>

              {/* Cambiado a un Link de React Router */}
              <Link to="/register" className="text-sm text-blue-600">
                Crear cuenta
              </Link>
            </div>
          </form>

          {/* Mensaje */}
          {msg && (
            <div className="mt-4 text-sm text-center text-gray-700">{msg}</div>
          )}
        </div>
      </div>
    </div>
  );
}
