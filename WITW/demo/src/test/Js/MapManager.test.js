/**
 * @jest-environment jsdom
 */

import { MapManager } from '../../main/resources/static/js/MapManager.js';

/**
 * Mock para simular la instancia del mapa retornada por Leaflet.
 * Contiene espías (spies) para métodos clave como setView y invalidateSize.
 */
const mockMapInstance = {
    setView: jest.fn().mockReturnThis(),
    invalidateSize: jest.fn(),
    on: jest.fn()
};

/**
 * Mock para simular una instancia de marcador (Marker).
 */
const mockMarkerInstance = {
    addTo: jest.fn().mockReturnThis(),
    bindPopup: jest.fn().mockReturnThis(),
    openPopup: jest.fn().mockReturnThis()
};

/**
 * Mock para simular una capa de mapa (TileLayer).
 */
const mockTileLayerInstance = {
    addTo: jest.fn().mockReturnThis()
};

/**
 * Configuración global del objeto 'L' (Leaflet) en el entorno de pruebas.
 * JSDOM no soporta el renderizado real de mapas ni librerías externas por CDN,
 * por lo que se inyectan mocks para interceptar las llamadas a la librería.
 */
global.L = {
    map: jest.fn(() => mockMapInstance),
    tileLayer: jest.fn(() => mockTileLayerInstance),
    marker: jest.fn(() => mockMarkerInstance)
};

/**
 * Suite de pruebas unitarias para la clase MapManager.
 * Verifica la correcta inicialización del mapa, la prevención de reinicializaciones
 * duplicadas y el manejo de errores cuando el contenedor del DOM no existe.
 */
describe('Clase MapManager', () => {

    let mapManager;

    /**
     * Configuración inicial antes de cada prueba.
     * Restablece el HTML del cuerpo del documento para incluir el contenedor del mapa,
     * limpia los registros de llamadas de los mocks y crea una nueva instancia de la clase.
     */
    beforeEach(() => {
        document.body.innerHTML = '<div id="map-container"></div>';
        jest.clearAllMocks();
        mapManager = new MapManager();
    });

    /**
     * Verifica que el mapa se inicialice correctamente.
     * Asegura que se llame a la función de creación de Leaflet con el ID correcto,
     * que se establezca la vista, se añadan las capas y se actualice la bandera de estado.
     */
    test('Debe inicializar el mapa correctamente', () => {
        mapManager.initMap();

        expect(L.map).toHaveBeenCalledWith('map-container');
        expect(mockMapInstance.setView).toHaveBeenCalled();
        expect(L.tileLayer).toHaveBeenCalled();
        expect(mapManager.mapInitialized).toBe(true);
    });

    /**
     * Verifica que el mapa no se reinicialice si ya ha sido creado previamente.
     * Utiliza temporizadores falsos (Fake Timers) para simular el paso del tiempo
     * necesario para que se ejecute el método 'invalidateSize' dentro del setTimeout,
     * asegurando que 'L.map' solo sea invocado una vez.
     */
    test('No debe reinicializar el mapa si ya existe', () => {
        jest.useFakeTimers();

        mapManager.initMap();
        mapManager.initMap();

        jest.runAllTimers();

        expect(L.map).toHaveBeenCalledTimes(1);
        expect(mockMapInstance.invalidateSize).toHaveBeenCalled();

        jest.useRealTimers();
    });

    /**
     * Verifica la robustez de la clase ante la ausencia del contenedor HTML.
     * Asegura que no se lancen errores y que no se intente instanciar Leaflet
     * si el elemento '#map-container' no se encuentra en el DOM.
     */
    test('No debe fallar si el contenedor no existe', () => {
        document.body.innerHTML = '';

        mapManager.initMap();

        expect(L.map).not.toHaveBeenCalled();
    });
});