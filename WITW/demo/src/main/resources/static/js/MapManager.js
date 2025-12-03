/**
 * Clase que gestiona la instancia del mapa interactivo utilizando la librería Leaflet.
 * Controla la inicialización, la configuración de capas (tiles) y los marcadores iniciales.
 */
export class MapManager {

    /**
     * Crea una instancia de MapManager.
     * Inicializa el estado del mapa como nulo y la bandera de inicialización como falsa.
     */
    constructor() {
        this.map = null;
        this.mapInitialized = false;
    }

    /**
     * Inicializa o actualiza el mapa en el contenedor del DOM 'map-container'.
     *
     * Si el mapa ya fue inicializado previamente, se ajusta su tamaño para corregir
     * problemas de renderizado (común cuando el contenedor estaba oculto con display: none).
     * Si es la primera vez, crea la instancia de Leaflet, configura la vista centrada en Chile
     * y añade los marcadores por defecto.
     *
     * @returns {void}
     */
    initMap() {
        const mapContainer = document.getElementById('map-container');
        if (!mapContainer) return;

        if (this.mapInitialized) {
            setTimeout(() => this.map.invalidateSize(), 100);
            return;
        }

        const chileCenter = [-33.45694, -70.64827];
        this.map = L.map('map-container').setView(chileCenter, 5);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(this.map);

        L.marker(chileCenter).addTo(this.map)
            .bindPopup('<b>Santiago de Chile</b><br>Evento central.')
            .openPopup();

        this.mapInitialized = true;

        setTimeout(() => this.map.invalidateSize(), 100);
    }
}