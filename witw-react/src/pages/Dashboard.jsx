import { useEffect, useState } from "react";

export default function Dashboard() {
  const [actividades, setActividades] = useState([]);

  // Cargar actividades desde localStorage
  useEffect(() => {
    const data = localStorage.getItem("actividades");
    if (data) {
      setActividades(JSON.parse(data));
    }
  }, []);

  return (
    <main id="inicio" className="pt-20 max-w-5xl mx-auto px-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">DashBoard de Actividades</h1>

      {/* Si no hay actividades */}
      {actividades.length === 0 && (
        <p className="text-gray-500">No hay actividades registradas.</p>
      )}

      <div className="space-y-4">
        {actividades.map((act, index) => (
          <div
            key={index}
            className="bg-white shadow rounded p-4 space-y-2 border border-gray-100 dark:bg-[#0b1220] dark:border-gray-700"
          >
            {/* Nombre */}
            <h2 className="text-xl font-semibold">{act.nombre}</h2>

            {/* Descripción */}
            <p className="text-gray-700 dark:text-gray-300">{act.descripcion}</p>

            {/* Fecha */}
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1z" />
                <path d="M18 9H2v7a2 2 0 002 2h12a2 2 0 002-2V9z" />
              </svg>
              {act.fecha}
            </div>

            {/* Lugar */}
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 2a6 6 0 016 6c0 5-6 10-6 10S4 13 4 8a6 6 0 016-6zM8 8a2 2 0 114 0 2 2 0 01-4 0z" />
              </svg>
              {act.lugar}
            </div>

            {/* Botón */}
            <button className="btn-primario">Ver detalles</button>
          </div>
        ))}
      </div>
    </main>
  );
}
