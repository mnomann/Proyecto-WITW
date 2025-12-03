/**
 * @jest-environment jsdom
 */

import { Profile } from '../../main/resources/static/js/Profile.js';

// Mock de localStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => store[key] = value.toString(),
    clear: () => store = {}
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Clase Profile', () => {
  
  // Antes de cada prueba, preparamos el HTML falso (DOM) que la clase necesita
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="form-profile"></form>
      <input id="avatar-upload" type="file" />
      <img id="profile-avatar-img" />
      <h1 id="profile-display-name"></h1>
      <input id="input-nombre" />
      <input id="input-email" />
      <textarea id="input-bio"></textarea>
      <button id="btn-logout"></button>
    `;
    
    // Limpiamos el localStorage antes de cada test
    window.localStorage.clear();
    window.alert = jest.fn();
  });

  test('Debe cargar un usuario por defecto si localStorage está vacío', () => {
    const profile = new Profile();
    
    expect(profile.currentUser.nombre).toBe('Usuario Nuevo');
    expect(profile.currentUser.id).toBe(1);
  });

  test('Debe cargar el usuario guardado si existe en localStorage', () => {
    const fakeUser = JSON.stringify({ nombre: 'Juan Test', email: 'test@test.com' });
    window.localStorage.setItem('currentUser', fakeUser);

    const profile = new Profile();
    
    expect(profile.currentUser.nombre).toBe('Juan Test');
    // Verifica que el DOM también se actualizó
    expect(document.getElementById('profile-display-name').textContent).toBe('Juan Test');
  });

  test('Debe actualizar el localStorage cuando se guarda el perfil', () => {
    const profile = new Profile();
    
    // Simulamos datos de formulario
    const formData = new FormData();
    formData.append('nombre', 'Nuevo Nombre');
    formData.append('email', 'nuevo@email.com');
    formData.append('bio', 'Mi biografía');
    formData.append('password', '');
    formData.append('confirm_password', '');

    // Ejecutamos la función de guardar
    profile.saveProfile(formData);

    // Verificamos que se guardó en el "navegador"
    const storedData = JSON.parse(window.localStorage.getItem('currentUser'));
    expect(storedData.nombre).toBe('Nuevo Nombre');
    expect(storedData.email).toBe('nuevo@email.com');
  });
});