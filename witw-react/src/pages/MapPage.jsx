import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix para íconos de Leaflet (si no se ven los pines)
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url),
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url),
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url),
});

export default function MapPage() {
  return (
    <section className="pt-24 px-4">
      <h1 className="text-2xl font-bold mb-4">Mapa de Actividades</h1>

      <div className="w-full h-[600px] rounded overflow-hidden shadow">
        <MapContainer
          center={[-33.45, -70.66]} // Santiago de Chile
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='© OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Ejemplo de marcador */}
          <Marker position={[-33.45, -70.66]}>
            <Popup>📍 Actividad de ejemplo en Santiago.</Popup>
          </Marker>
        </MapContainer>
      </div>
    </section>
  );
}
