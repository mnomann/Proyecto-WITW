import { useState, useEffect } from "react";

export default function Profile() {
  const [avatar, setAvatar] = useState(localStorage.getItem("avatar") || "imagenes/icono camara.png");
  const [fileName, setFileName] = useState("Ningún archivo seleccionado");

  const [form, setForm] = useState({
    nombre: localStorage.getItem("nombre") || "",
    correo: localStorage.getItem("correo") || "",
    cumple: localStorage.getItem("cumple") || "",
    bio: localStorage.getItem("bio") || "",
  });

  const [mensaje, setMensaje] = useState("");

  // DARK MODE
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("dark") === "true"
  );

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(reader.result);
      localStorage.setItem("avatar", reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const guardarCambios = (e) => {
    e.preventDefault();

    localStorage.setItem("nombre", form.nombre);
    localStorage.setItem("correo", form.correo);
    localStorage.setItem("cumple", form.cumple);
    localStorage.setItem("bio", form.bio);

    setMensaje("Cambios guardados correctamente ✔");
    setTimeout(() => setMensaje(""), 2500);
  };

  return (
    <section className="pt-20 max-w-md mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Editar Perfil</h1>

      <form
        onSubmit={guardarCambios}
        className="bg-white p-4 rounded shadow space-y-4"
      >
        {/* FOTO */}
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-gray-700">Foto de perfil</label>
            <div className="w-24 h-24 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center">
              <img
                src={avatar}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-gray-700">Subir foto</label>

            <input
              id="avatarInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />

            <label
              htmlFor="avatarInput"
              id="avatarButton"
              className="inline-flex items-center px-3 py-2 bg-white border rounded cursor-pointer shadow-sm hover:bg-gray-50"
            >
              <svg
                className="w-5 h-5 mr-2 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M16 3l-4 4-4-4"
                ></path>
              </svg>
              <span>Seleccionar archivo</span>
            </label>

            <span id="avatarFileName" className="ml-3 text-sm text-gray-600">
              {fileName}
            </span>

            <div>
              <small className="text-gray-500">
                Se guardará localmente en el navegador (simulado).
              </small>
            </div>
          </div>
        </div>

        {/* CAMPOS */}
        <div>
          <label className="block text-gray-700">Nombre</label>
          <input
            name="nombre"
            type="text"
            className="w-full border rounded p-2"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Tu nombre"
          />
        </div>

        <div>
          <label className="block text-gray-700">Correo</label>
          <input
            name="correo"
            type="email"
            className="w-full border rounded p-2"
            value={form.correo}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div>
          <label className="block text-gray-700">Cumpleaños</label>
          <input
            name="cumple"
            type="date"
            className="w-full border rounded p-2"
            value={form.cumple}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-gray-700">Biografía</label>
          <textarea
            name="bio"
            className="w-full border rounded p-2"
            rows="3"
            value={form.bio}
            onChange={handleChange}
            placeholder="Unas palabras sobre ti..."
          ></textarea>
        </div>

        {/* BOTONES */}
        <div className="flex items-center justify-between">
          <button type="submit" className="btn-primario">
            Guardar cambios
          </button>

          <div className="flex items-center space-x-2">
            <label className="text-gray-700">Modo oscuro</label>

            <button
              id="darkToggle"
              type="button"
              onClick={() => {
                setDarkMode(!darkMode);
                localStorage.setItem("dark", !darkMode);
              }}
              className="w-12 h-6 bg-gray-300 rounded-full relative"
            >
              <span
                id="darkKnob"
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                  darkMode ? "translate-x-6" : "translate-x-0"
                }`}
              ></span>
            </button>
          </div>
        </div>

        {mensaje && (
          <div id="profileMsg" className="text-green-600 text-sm mt-2">
            {mensaje}
          </div>
        )}
      </form>
    </section>
  );
}
