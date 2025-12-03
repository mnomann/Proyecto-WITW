/**
 * @jest-environment jsdom
 */

import { MapManager } from '../../main/resources/static/js/MapManager.js';

// --- MOCK GLOBAL DE LEAFLET (L) ---
// Creamos objetos falsos que espían si son llamados
const mockMapInstance = {
  setView: jest.fn().mockReturnThis(),
  invalidateSize: jest.fn(),
  on: jest.fn()
};

const mockMarkerInstance = {
  addTo: jest.fn().mockReturnThis(),
  bindPopup: jest.fn().mockReturnThis(),
  openPopup: jest.fn().mockReturnThis()
};

const mockTileLayerInstance = {
  addTo: jest.fn().mockReturnThis()
};

// Inyectamos 'L' en el objeto global 'window'
global.L = {
  map: jest.fn(() => mockMapInstance),
  tileLayer: jest.fn(() => mockTileLayerInstance),
  marker: jest.fn(() => mockMarkerInstance)
};

// --- SUITE DE PRUEBAS ---
describe('Clase MapManager', () => {
  
  let mapManager;

  beforeEach(() => {
    document.body.innerHTML = '<div id="map-container"></div>';
    jest.clearAllMocks(); // Limpiar contadores de llamadas anteriores
    mapManager = new MapManager();
  });

  test('Debe inicializar el mapa correctamente', () => {
    mapManager.initMap();

    // Verificamos que llamó a L.map con el ID correcto
    expect(L.map).toHaveBeenCalledWith('map-container');
    
    // Verificamos que centró la vista (setView)
    expect(mockMapInstance.setView).toHaveBeenCalled();
    
    // Verificamos que añadió las capas (tileLayer)
    expect(L.tileLayer).toHaveBeenCalled();
    
    // Verificamos que marcó la bandera de inicializado
    expect(mapManager.mapInitialized).toBe(true);
  });

  test('No debe reinicializar el mapa si ya existe', () => {
    // 1. Activar los temporizadores falsos
    jest.useFakeTimers();

    // Primera llamada (crea el mapa)
    mapManager.initMap();
    
    // Segunda llamada (intenta reinicializar)
    mapManager.initMap();

    // 2. Avanzar el tiempo para que se ejecute el setTimeout
    jest.runAllTimers();

    // Verificaciones
    expect(L.map).toHaveBeenCalledTimes(1);
    expect(mockMapInstance.invalidateSize).toHaveBeenCalled();

    // 3. Limpiar los temporizadores al final
    jest.useRealTimers();
  });
  
  test('No debe fallar si el contenedor no existe', () => {
    document.body.innerHTML = ''; // Borramos el div del mapa
    
    // Esto no debería lanzar error
    mapManager.initMap();
    
    expect(L.map).not.toHaveBeenCalled();
  });
});