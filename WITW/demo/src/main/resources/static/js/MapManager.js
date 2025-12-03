export class MapManager {
    constructor() {
        this.map = null;
        this.mapInitialized = false;
    }

    initMap() {
        const mapContainer = document.getElementById('map-container');
        if (!mapContainer) return;

        // Si ya existe, solo ajustamos tamaño
        if (this.mapInitialized) {
            setTimeout(() => this.map.invalidateSize(), 100);
            return;
        }

        // Coordenadas centradas en Chile (como en tu logic.js)
        const chileCenter = [-33.45694, -70.64827];
        this.map = L.map('map-container').setView(chileCenter, 5);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(this.map);

        L.marker(chileCenter).addTo(this.map)
            .bindPopup('<b>Santiago de Chile</b><br>Evento central.')
            .openPopup();

        this.mapInitialized = true;
        
        // Ajuste final por si el contenedor estaba oculto
        setTimeout(() => this.map.invalidateSize(), 100);
    }
}