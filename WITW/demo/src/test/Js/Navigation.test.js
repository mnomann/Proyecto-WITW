/**
 * @jest-environment jsdom
 */

import { Navigation } from '../../main/resources/static/js/Navigation.js';

/**
 * Suite de pruebas unitarias para la clase Navigation.
 * Verifica la lógica de enrutamiento SPA (Single Page Application) en el cliente,
 * asegurando que las secciones se muestren/oculten correctamente y que el menú
 * de perfil responda a las interacciones.
 */
describe('Clase Navigation', () => {
  
  let navigation;

  /**
   * Configuración inicial antes de cada prueba.
   * Construye un DOM simulado (nav, botones, secciones) que replica la estructura
   * del index.html real, permitiendo que la clase Navigation encuentre sus referencias.
   */
  beforeEach(() => {
    document.body.innerHTML = `
      <nav>
        <button class="nav-btn" data-section="inicio">Inicio</button>
        <button class="nav-btn" data-section="mapa">Mapa</button>
        <button id="profileBtn">Perfil</button>
      </nav>
      
      <div id="profileMenu" class="hidden"></div>

      <section id="inicio" class="section">Sección Inicio</section>
      <section id="mapa" class="section hidden">Sección Mapa</section>
      <section id="add" class="section hidden">Sección Añadir</section>
    `;

    navigation = new Navigation();
  });

  /**
   * Verifica que el mecanismo de cambio de pestañas funcione.
   * Al hacer clic en un botón de navegación, la sección correspondiente debe
   * perder la clase 'hidden', y la sección anterior debe ganarla.
   */
  test('Debe mostrar la sección correcta al hacer clic', () => {
    const btnMapa = document.querySelector('button[data-section="mapa"]');
    const seccionMapa = document.getElementById('mapa');
    const seccionInicio = document.getElementById('inicio');

    expect(seccionInicio.classList.contains('hidden')).toBe(false);
    expect(seccionMapa.classList.contains('hidden')).toBe(true);

    btnMapa.click();

    expect(seccionMapa.classList.contains('hidden')).toBe(false);
    expect(seccionInicio.classList.contains('hidden')).toBe(true);
  });

  /**
   * Verifica la interactividad del menú desplegable de usuario.
   * Comprueba que clics consecutivos alternen la visibilidad del menú
   * (toggle de la clase 'hidden').
   */
  test('Debe alternar la visibilidad del menú de perfil', () => {
    const btnPerfil = document.getElementById('profileBtn');
    const menu = document.getElementById('profileMenu');

    btnPerfil.click();
    expect(menu.classList.contains('hidden')).toBe(false);

    btnPerfil.click();
    expect(menu.classList.contains('hidden')).toBe(true);
  });
});