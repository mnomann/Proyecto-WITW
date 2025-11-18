import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      {/* Empuje hacia abajo para compensar el navbar fijo */}
      <div className="pt-20 px-4">
        <Outlet />
      </div>
    </div>
  );
}
