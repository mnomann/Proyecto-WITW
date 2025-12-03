/**
 * @jest-environment jsdom
 */

import { Navigation } from '../../main/resources/static/js/Navigation.js';

describe('Clase Navigation', () => {
  
  let navigation;

  beforeEach(() => {
    // 1. Simulamos el HTML del menú y las secciones
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

  test('Debe mostrar la sección correcta al hacer clic', () => {
    const btnMapa = document.querySelector('button[data-section="mapa"]');
    const seccionMapa = document.getElementById('mapa');
    const seccionInicio = document.getElementById('inicio');

    // Inicialmente inicio está visible y mapa oculto
    expect(seccionInicio.classList.contains('hidden')).toBe(false);
    expect(seccionMapa.classList.contains('hidden')).toBe(true);

    // Simulamos clic en "Mapa"
    btnMapa.click();

    // Verificamos el cambio
    expect(seccionMapa.classList.contains('hidden')).toBe(false); // Mapa visible
    expect(seccionInicio.classList.contains('hidden')).toBe(true);  // Inicio oculto
  });

  test('Debe alternar la visibilidad del menú de perfil', () => {
    const btnPerfil = document.getElementById('profileBtn');
    const menu = document.getElementById('profileMenu');

    // 1. Abrir
    btnPerfil.click();
    expect(menu.classList.contains('hidden')).toBe(false);

    // 2. Cerrar
    btnPerfil.click();
    expect(menu.classList.contains('hidden')).toBe(true);
  });
});