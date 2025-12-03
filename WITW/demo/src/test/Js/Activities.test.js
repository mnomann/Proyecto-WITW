/**
 * @jest-environment jsdom
 */

import { Activities } from '../../main/resources/static/js/Activities.js';

/**
 * Mock funcional de LocalStorage para el entorno de pruebas JSDOM.
 * Simula los métodos getItem, setItem y clear utilizando un objeto en memoria,
 * ya que JSDOM no persiste datos entre recargas reales.
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
 * Suite de pruebas unitarias para la clase Activities.
 * Verifica la lógica de negocio principal: gestión de eventos (CRUD),
 * persistencia de datos, control de asistencia y sistema de comentarios.
 */
describe('Clase Activities', () => {
  
  let activitiesInstance;

  /**
   * Configuración previa a cada test (Setup).
   * 1. Limpia el LocalStorage para asegurar un entorno estéril.
   * 2. Reconstruye el DOM necesario (contenedor y formulario) para que la clase encuentre sus referencias.
   * 3. Establece un usuario de sesión simulado ("currentUser") para las pruebas de interacción.
   * 4. Instancia una nueva clase Activities.
   */
  beforeEach(() => {
    window.localStorage.clear();

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

    const user = JSON.stringify({ id: 99, nombre: 'Tester', email: 'test@mail.com' });
    window.localStorage.setItem('currentUser', user);

    activitiesInstance = new Activities();
  });

  /**
   * Verifica que la clase cargue las actividades de demostración (DUMMY_ACTIVITIES)
   * automáticamente cuando no existen datos previos en el almacenamiento.
   */
  test('Debe cargar actividades por defecto si no hay nada guardado', () => {
    const acts = activitiesInstance.getActivities();
    expect(acts.length).toBe(2);
    expect(acts[0].nombre).toBe('Senderismo en el Parque Nacional');
  });

  /**
   * Verifica el flujo completo de agregar una nueva actividad:
   * 1. Captura de datos simulada mediante FormData.
   * 2. Mock de window.alert para evitar errores en JSDOM.
   * 3. Persistencia en la lista de actividades y validación de los datos guardados.
   */
  test('Debe agregar una nueva actividad correctamente', () => {
    const formElement = document.getElementById('form-add');
    const formData = new FormData(formElement); 

    formData.set('nombre', 'Evento Jest');
    formData.set('capacidadMaxima', '50');

    window.alert = jest.fn(); 
    
    activitiesInstance.handleAddActivity(formData);

    const acts = activitiesInstance.getActivities();
    expect(acts.length).toBe(3);
    
    const newAct = acts[acts.length - 1];
    expect(newAct.nombre).toBe('Evento Jest');
    expect(newAct.capacidadMaxima).toBe(50);
  });

  /**
   * Verifica que un usuario pueda marcar su asistencia a un evento.
   * Comprueba que el ID del usuario actual se añada correctamente al array de asistentes del evento.
   */
  test('Debe permitir al usuario asistir a un evento (Toggle Attendance)', () => {
    let acts = activitiesInstance.getActivities();
    const activityId = acts[0].id;

    activitiesInstance.toggleAttendance(activityId);

    acts = activitiesInstance.getActivities();
    const updatedActivity = acts.find(a => a.id === activityId);

    expect(updatedActivity.asistentes).toHaveLength(1);
    expect(updatedActivity.asistentes[0].id).toBe(99);
  });

  /**
   * Verifica que un usuario pueda retirar su asistencia si ya estaba inscrito.
   * Se ejecuta toggleAttendance dos veces y se espera que la lista de asistentes vuelva a estar vacía.
   */
  test('Debe retirar la asistencia si el usuario ya estaba inscrito', () => {
    let acts = activitiesInstance.getActivities();
    const activityId = acts[0].id;
    activitiesInstance.toggleAttendance(activityId);

    activitiesInstance.toggleAttendance(activityId);

    acts = activitiesInstance.getActivities();
    const updatedActivity = acts.find(a => a.id === activityId);
    expect(updatedActivity.asistentes).toHaveLength(0);
  });

  /**
   * Verifica la funcionalidad de agregar comentarios a una actividad.
   * Asegura que el texto y el autor del comentario se persistan correctamente en el objeto del evento.
   */
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