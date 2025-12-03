/**
 * @file Main.js
 * @description Punto de entrada principal de la aplicación.
 * Se encarga de instanciar los módulos clave (Navegación, Actividades, Mapa, Perfil)
 * y de establecer la lógica de coordinación entre ellos al cargar el DOM.
 */

import { Navigation } from './Navigation.js';
import { Activities } from './Activities.js';
import { MapManager } from './MapManager.js';
import { Profile } from './Profile.js';

/**
 * Escucha el evento 'DOMContentLoaded' para asegurar que el HTML esté completamente cargado
 * antes de iniciar la lógica de la aplicación.
 */
document.addEventListener('DOMContentLoaded', () => {
    
    // Inicialización de los módulos principales
    const navigation = new Navigation();
    const activities = new Activities();
    const mapManager = new MapManager();
    const profile = new Profile();

    /**
     * Interceptamos el método 'switchSection' de la instancia de navegación.
     * Esto nos permite inyectar lógica adicional (como recargar el mapa)
     * cada vez que el usuario cambia de sección, sin modificar la clase Navigation original.
     */
    const originalSwitch = navigation.switchSection.bind(navigation);

    navigation.switchSection = (sectionId) => {
        // Ejecutar la lógica original de cambio de pestaña
        originalSwitch(sectionId);
        
        // Si la sección destino es 'mapa', forzamos la inicialización/renderizado del mapa
        // para evitar problemas de visualización (gris) al estar oculto previamente.
        if (sectionId === 'mapa') {
            mapManager.initMap();
        }
    };

    // Establecer la sección 'inicio' como la vista por defecto al abrir la app
    navigation.switchSection('inicio');
});