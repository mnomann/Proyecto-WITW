export default function AddActivity() {
  return (
    <section className="max-w-md mx-auto px-4 pt-24">
      <h1 className="text-2xl font-bold mb-4">Añadir Actividad</h1>

      <form className="space-y-4 bg-white p-6 rounded shadow">

        {/* Titulo */}
        <div>
          <label className="block text-gray-700 font-medium">Título</label>
          <input
            type="text"
            className="w-full mt-1 px-3 py-2 border rounded focus:ring focus:outline-none"
            placeholder="Ej: Clase de Yoga al Aire Libre"
          />
        </div>

        {/* Descripcion */}
        <div>
          <label className="block text-gray-700 font-medium">Descripción</label>
          <textarea
            className="w-full mt-1 px-3 py-2 border rounded focus:ring focus:outline-none"
            rows="3"
            placeholder="Describe brevemente la actividad..."
          ></textarea>
        </div>

        {/* Fecha */}
        <div>
          <label className="block text-gray-700 font-medium">Fecha</label>
          <input
            type="date"
            className="w-full mt-1 px-3 py-2 border rounded focus:ring focus:outline-none"
          />
        </div>

        {/* Ubicación */}
        <div>
          <label className="block text-gray-700 font-medium">Ubicación</label>
          <input
            type="text"
            className="w-full mt-1 px-3 py-2 border rounded focus:ring focus:outline-none"
            placeholder="Ej: Parque San Cristóbal, sector norte"
          />
        </div>

        {/* Botón */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Guardar Actividad
        </button>

      </form>
    </section>
  );
}
