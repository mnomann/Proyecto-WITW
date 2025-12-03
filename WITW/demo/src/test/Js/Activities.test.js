/**
 * @jest-environment jsdom
 */

import { Activities } from '../../main/resources/static/js/Activities.js';

// --- 1. Mock de localStorage (Igual que en Profile) ---
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

// --- 2. Suite de Pruebas ---
describe('Clase Activities', () => {
  
  let activitiesInstance;

  // Antes de cada prueba, reseteamos el DOM y el LocalStorage
  beforeEach(() => {
    window.localStorage.clear();

    // Simulamos el HTML necesario para que la clase funcione
    document.body.innerHTML = `
      <div id="contenedor-actividades"></div>
      <form id="form-add">
        <input name="nombre" value="Evento Test" />
        <input name="lugar" value="Parque Test" />
        <input name="fecha" value="2025-12-01" />
        <input name="hora" value="18:00" />
        <textarea name="descripcion">Descripción de prueba</textarea>
        <input name="imagenUrl" value="http://ejemplo.com/img.jpg" />
        <input name="capacidadMaxima" value="10" />
      </form>
    `;

    // Simulamos un usuario logueado para probar asistencias
    const user = JSON.stringify({ id: 99, nombre: 'Tester', email: 'test@mail.com' });
    window.localStorage.setItem('currentUser', user);

    activitiesInstance = new Activities();
  });

  test('Debe cargar actividades por defecto si no hay nada guardado', () => {
    // Activities.js tiene 2 actividades dummy por defecto en el constructor
    const acts = activitiesInstance.getActivities();
    expect(acts.length).toBe(2);
    expect(acts[0].nombre).toBe('Senderismo en el Parque Nacional');
  });

  test('Debe agregar una nueva actividad correctamente', () => {
    // Simulamos el envío del formulario creando un FormData falso
    const formElement = document.getElementById('form-add');
    const formData = new FormData(formElement); // Jest-jsdom soporta FormData básico

    // Manulamente llenamos los datos que esperamos (por si jsdom no lee los inputs automáticamente en versiones viejas)
    formData.set('nombre', 'Evento Jest');
    formData.set('capacidadMaxima', '50');

    // Ejecutamos la función de agregar
    // Mockeamos window.alert para que no rompa el test
    window.alert = jest.fn(); 
    
    activitiesInstance.handleAddActivity(formData);

    // Verificamos que ahora hay 3 actividades (2 dummy + 1 nueva)
    const acts = activitiesInstance.getActivities();
    expect(acts.length).toBe(3);
    
    // Verificamos que la última sea la nuestra
    const newAct = acts[acts.length - 1];
    expect(newAct.nombre).toBe('Evento Jest');
    expect(newAct.capacidadMaxima).toBe(50);
  });

  test('Debe permitir al usuario asistir a un evento (Toggle Attendance)', () => {
    // Tomamos la primera actividad
    let acts = activitiesInstance.getActivities();
    const activityId = acts[0].id;

    // Ejecutamos toggleAttendance
    activitiesInstance.toggleAttendance(activityId);

    // Volvemos a leer las actividades del storage
    acts = activitiesInstance.getActivities();
    const updatedActivity = acts.find(a => a.id === activityId);

    // El usuario 99 debería estar en la lista de asistentes
    expect(updatedActivity.asistentes).toHaveLength(1);
    expect(updatedActivity.asistentes[0].id).toBe(99);
  });

  test('Debe retirar la asistencia si el usuario ya estaba inscrito', () => {
    // 1. Inscribirse primero
    let acts = activitiesInstance.getActivities();
    const activityId = acts[0].id;
    activitiesInstance.toggleAttendance(activityId);

    // 2. Ejecutar toggle de nuevo (Desinscribirse)
    activitiesInstance.toggleAttendance(activityId);

    // 3. Verificar que la lista de asistentes esté vacía
    acts = activitiesInstance.getActivities();
    const updatedActivity = acts.find(a => a.id === activityId);
    expect(updatedActivity.asistentes).toHaveLength(0);
  });

  test('Debe agregar un comentario', () => {
    const acts = activitiesInstance.getActivities();
    const activityId = acts[0].id;
    const comentario = "¡Qué buen evento!";

    activitiesInstance.addComment(activityId, comentario);

    const updatedActs = activitiesInstance.getActivities();
    const updatedActivity = updatedActs.find(a => a.id === activityId);

    expect(updatedActivity.comentarios).toHaveLength(1);
    expect(updatedActivity.comentarios[0].texto).toBe(comentario);
    expect(updatedActivity.comentarios[0].usuarioNombre).toBe('Tester');
  });
});