import { useEffect, useState } from "react";

export default function Home() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fakeData = [
      {
        id: 1,
        titulo: "Caminata en el cerro",
        descripcion: "Ruta de 5km con vista panorámica.",
        fecha: "2025-11-20",
        ubicacion: "Santiago",
        imagen:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800",
      },
      {
        id: 2,
        titulo: "Clase de cocina japonesa",
        descripcion: "Aprende sushi desde cero.",
        fecha: "2025-11-25",
        ubicacion: "Providencia",
        imagen:
          "https://images.unsplash.com/photo-1543353071-873f17a7a088?w=800",
      },
    ];

    setActivities(fakeData);
  }, []);

  return (
    
    <main className="pt-24 max-w-6xl mx-auto px-4">
      {/* Título */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Dashboard de Actividades
      </h1>

      {/* Contenedor GRID como el original */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((act) => (
          <div
            key={act.id}
            className="bg-white rounded-lg shadow-md overflow-hidden border"
          >
            {/* Imagen */}
            {act.imagen && (
              <img
                src={act.imagen}
                className="w-full h-40 object-cover"
                alt={act.titulo}
              />
            )}

            {/* Contenido */}
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {act.titulo}
              </h2>
              <p className="text-gray-600 text-sm mt-1">{act.descripcion}</p>

              <div className="mt-3 text-sm text-gray-500 space-y-1">
                <div>📅 {act.fecha}</div>
                <div>📍 {act.ubicacion}</div>

              </div>

              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                Ver detalles
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
