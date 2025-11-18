import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow fixed w-full top-0 left-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">

        {/* Logo */}
        <div className="text-xl font-bold text-gray-700 dark:text-gray-200">
          <Link to="/">WITW</Link>
        </div>

        {/* Navegación principal */}
        <div className="hidden md:flex space-x-6">
          <Link
            to="/"
            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            Inicio
          </Link>

          <Link
            to="/add"
            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            Añadir actividad
          </Link>

          <Link
            to="/mapa"
            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            Mapa
          </Link>

          <Link
            to="/login"
            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            Iniciar sesión
          </Link>

          <Link
            to="/register"
            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            Registrarse
          </Link>
        </div>

        {/* Menú de perfil */}
        <div className="relative">
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center"
          >
            <svg className="w-6 h-6 text-gray-700 dark:text-gray-200" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </button>

          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded shadow-md">
              <Link
                to="/perfil"
                className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Perfil
              </Link>

              <Link
                to="/login"
                className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Salir
              </Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}
