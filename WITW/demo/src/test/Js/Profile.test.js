/**
 * @jest-environment jsdom
 */

import { Profile } from '../../main/resources/static/js/Profile.js';

/**
 * Mock funcional de LocalStorage para el entorno de pruebas JSDOM.
 * Simula los métodos getItem, setItem y clear utilizando un objeto en memoria,
 * permitiendo validar la persistencia de datos durante las pruebas.
 */
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

/**
 * Suite de pruebas unitarias para la clase Profile.
 * Verifica la lógica de gestión de perfil de usuario, incluyendo la carga inicial,
 * la recuperación de datos guardados y la actualización de la información en LocalStorage.
 */
describe('Clase Profile', () => {
  
  /**
   * Configuración inicial antes de cada prueba.
   * 1. Reconstruye el DOM necesario (formulario e inputs) para que la clase encuentre sus referencias.
   * 2. Limpia el LocalStorage para asegurar un estado inicial limpio.
   * 3. Mockea window.alert para evitar errores de ejecución en el entorno de prueba.
   */
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
    
    window.localStorage.clear();
    window.alert = jest.fn();
  });

  /**
   * Verifica que la clase inicialice un usuario con datos por defecto
   * cuando no se encuentra información previa en el almacenamiento local.
   */
  test('Debe cargar un usuario por defecto si localStorage está vacío', () => {
    const profile = new Profile();
    
    expect(profile.currentUser.nombre).toBe('Usuario Nuevo');
    expect(profile.currentUser.id).toBe(1);
  });

  /**
   * Verifica que la clase recupere y cargue correctamente los datos del usuario
   * si estos ya existen en el LocalStorage. También valida que la interfaz (DOM)
   * se actualice con esta información.
   */
  test('Debe cargar el usuario guardado si existe en localStorage', () => {
    const fakeUser = JSON.stringify({ nombre: 'Juan Test', email: 'test@test.com' });
    window.localStorage.setItem('currentUser', fakeUser);

    const profile = new Profile();
    
    expect(profile.currentUser.nombre).toBe('Juan Test');
    expect(document.getElementById('profile-display-name').textContent).toBe('Juan Test');
  });

  /**
   * Verifica el proceso de guardado del perfil.
   * Simula el envío de datos mediante FormData y asegura que la información
   * se persista correctamente en el LocalStorage.
   */
  test('Debe actualizar el localStorage cuando se guarda el perfil', () => {
    const profile = new Profile();
    
    const formData = new FormData();
    formData.append('nombre', 'Nuevo Nombre');
    formData.append('email', 'nuevo@email.com');
    formData.append('bio', 'Mi biografía');
    formData.append('password', '');
    formData.append('confirm_password', '');

    profile.saveProfile(formData);

    const storedData = JSON.parse(window.localStorage.getItem('currentUser'));
    expect(storedData.nombre).toBe('Nuevo Nombre');
    expect(storedData.email).toBe('nuevo@email.com');
  });
});