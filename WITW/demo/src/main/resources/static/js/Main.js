import { Navigation } from './Navigation.js';
import { Activities } from './Activities.js';
import { MapManager } from './MapManager.js';
import { Profile } from './Profile.js'; // <--- 1. IMPORTAR

document.addEventListener('DOMContentLoaded', () => {
    const navigation = new Navigation();
    const activities = new Activities();
    const mapManager = new MapManager();
    const profile = new Profile(); // <--- 2. INICIALIZAR

    const originalSwitch = navigation.switchSection.bind(navigation);

    navigation.switchSection = (sectionId) => {
        originalSwitch(sectionId);
        
        if (sectionId === 'mapa') {
            mapManager.initMap();
        }
    };

    // Iniciar en la home
    navigation.switchSection('inicio');
});