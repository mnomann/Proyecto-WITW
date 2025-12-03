/**
 * Clase que gestiona la lógica de las actividades (eventos).
 * Se encarga del renderizado en el DOM, la persistencia de datos en LocalStorage,
 * y la gestión de la interacción del usuario (asistencia, comentarios y creación).
 */
export class Activities {

    /**
     * Crea una instancia de la clase Activities.
     * Inicializa las referencias a los elementos del DOM y define los datos de prueba
     * que se utilizarán si no existe almacenamiento previo.
     */
    constructor() {
        this.container = document.getElementById('contenedor-actividades');
        this.formAdd = document.getElementById('form-add');
        this.DUMMY_ACTIVITIES = [
            { id: 1, nombre: 'Senderismo en el Parque Nacional', lugar: 'Parque Nacional La Campana', fecha: '2025-11-15', hora: '09:00', descripcion: 'Excursión al cerro La Campana.', imagenUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop', capacidadMaxima: 20, asistentes: [], comentarios: [] },
            { id: 2, nombre: 'Día de Playa y Surf', lugar: 'Pichilemu', fecha: '2026-01-20', hora: '11:00', descripcion: 'Clases de surf.', imagenUrl: 'https://images.unsplash.com/photo-1502680390469-be75c88b63f8?q=80&w=2070&auto=format&fit=crop', capacidadMaxima: 15, asistentes: [], comentarios: [] }
        ];
        this.init();
    }

    /**
     * Inicializa los controladores de eventos (listeners) y renderiza la vista inicial.
     * Configura la escucha para el envío del formulario de creación y para los clics
     * delegados en las tarjetas de actividad (asistencia y comentarios).
     */
    init() {
        this.displayActivities();

        if (this.formAdd) {
            this.formAdd.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddActivity(new FormData(e.target));
            });
        }

        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-asistencia')) {
                const id = parseInt(e.target.getAttribute('data-activity-id'));
                this.toggleAttendance(id);
            }
            if (e.target.classList.contains('btn-comment')) {
                const id = parseInt(e.target.getAttribute('data-activity-id'));
                const input = e.target.previousElementSibling;
                this.addComment(id, input.value);
                input.value = '';
            }
        });
    }

    /**
     * Recupera la lista de actividades desde el almacenamiento local (LocalStorage).
     * Si no existen datos almacenados, inicializa y devuelve los datos de prueba.
     *
     * @returns {Array<Object>} Un arreglo con los objetos de las actividades.
     */
    getActivities() {
        let activities = localStorage.getItem('activities');
        if (!activities) {
            localStorage.setItem('activities', JSON.stringify(this.DUMMY_ACTIVITIES));
            return this.DUMMY_ACTIVITIES;
        }
        return JSON.parse(activities);
    }

    /**
     * Guarda la lista actualizada de actividades en el almacenamiento local.
     *
     * @param {Array<Object>} activities - El arreglo de actividades a persistir.
     */
    saveActivities(activities) {
        localStorage.setItem('activities', JSON.stringify(activities));
    }

    /**
     * Obtiene el usuario actual de la sesión simulada.
     * Si no existe un usuario en sesión, crea y guarda un usuario por defecto.
     *
     * @returns {Object} El objeto del usuario actual con su ID y nombre.
     */
    getCurrentUser() {
        let user = localStorage.getItem('currentUser');
        if (!user) {
            user = { id: 1, nombre: 'Usuario Demo' };
            localStorage.setItem('currentUser', JSON.stringify(user));
        }
        return JSON.parse(user);
    }

    /**
     * Alterna el estado de asistencia del usuario actual a una actividad específica.
     * Si el usuario ya asiste, lo elimina de la lista. Si no, lo agrega, validando
     * primero que no se haya excedido la capacidad máxima.
     *
     * @param {number} activityId - El identificador único de la actividad.
     */
    toggleAttendance(activityId) {
        const activities = this.getActivities();
        const activity = activities.find(act => act.id === activityId);
        const currentUser = this.getCurrentUser();

        if (!activity) return;

        const isAttending = activity.asistentes.some(a => a.id === currentUser.id);

        if (isAttending) {
            activity.asistentes = activity.asistentes.filter(a => a.id !== currentUser.id);
        } else {
            if (activity.asistentes.length >= activity.capacidadMaxima) {
                alert('¡Capacidad máxima alcanzada!');
                return;
            }
            activity.asistentes.push({ id: currentUser.id, nombre: currentUser.nombre });
        }
        this.saveActivities(activities);
        this.displayActivities();
    }

    /**
     * Agrega un nuevo comentario a una actividad específica.
     * El comentario incluye el autor, el texto y la fecha de creación.
     *
     * @param {number} activityId - El identificador único de la actividad.
     * @param {string} text - El contenido textual del comentario.
     */
    addComment(activityId, text) {
        if (!text.trim()) return;
        const activities = this.getActivities();
        const activity = activities.find(act => act.id === activityId);
        const currentUser = this.getCurrentUser();

        activity.comentarios.push({
            id: Date.now(),
            usuarioId: currentUser.id,
            usuarioNombre: currentUser.nombre,
            texto: text.trim(),
            fecha: new Date().toISOString()
        });

        this.saveActivities(activities);
        this.displayActivities();
    }

    /**
     * Procesa los datos del formulario para crear y almacenar una nueva actividad.
     * Genera un nuevo objeto de actividad, lo guarda y redirige la navegación a la vista de inicio.
     *
     * @param {FormData} formData - Los datos capturados del formulario HTML.
     */
    handleAddActivity(formData) {
        const newActivity = {
            id: Date.now(),
            nombre: formData.get('nombre'),
            lugar: formData.get('lugar'),
            fecha: formData.get('fecha'),
            hora: formData.get('hora'),
            descripcion: formData.get('descripcion'),
            imagenUrl: formData.get('imagenUrl'),
            capacidadMaxima: parseInt(formData.get('capacidadMaxima')) || 10,
            asistentes: [],
            comentarios: []
        };
        const acts = this.getActivities();
        acts.push(newActivity);
        this.saveActivities(acts);
        alert('Actividad agregada!');
        this.formAdd.reset();
        this.displayActivities();
        document.dispatchEvent(new CustomEvent('navigate-to', { detail: 'inicio' }));
    }

    /**
     * Renderiza visualmente todas las actividades en el contenedor HTML.
     * Genera dinámicamente las tarjetas de eventos, calculando barras de progreso,
     * estados de botones y listados de comentarios.
     */
    displayActivities() {
        const activities = this.getActivities();
        const currentUser = this.getCurrentUser();
        this.container.innerHTML = '';

        activities.forEach(act => {
            const isAttending = act.asistentes.some(a => a.id === currentUser.id);
            const isFull = act.asistentes.length >= act.capacidadMaxima;
            const commentsHtml = act.comentarios.map(c => `
                <div class="border-t pt-2 mt-2 text-sm">
                    <strong>${c.usuarioNombre}</strong>: ${c.texto}
                </div>`).join('');

            const card = document.createElement('div');
            card.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition';
            card.innerHTML = `
                <img src="${act.imagenUrl}" class="w-full h-48 object-cover" onerror="this.src='https://placehold.co/600x400?text=No+Image'">
                <div class="p-4">
                    <h3 class="text-xl font-bold">${act.nombre}</h3>
                    <p class="text-gray-600"><i class="bi bi-geo-alt"></i> ${act.lugar}</p>
                    <p class="text-sm my-2">${act.descripcion}</p>
                    
                    <div class="my-2">
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="bg-blue-600 h-2 rounded-full" style="width: ${(act.asistentes.length / act.capacidadMaxima) * 100}%"></div>
                        </div>
                        <span class="text-xs text-gray-500">${act.asistentes.length}/${act.capacidadMaxima} Asistentes</span>
                    </div>

                    <button class="btn-asistencia w-full py-2 rounded text-white ${isAttending ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}" data-activity-id="${act.id}">
                        ${isAttending ? 'Cancelar' : isFull ? 'Lleno' : 'Asistir'}
                    </button>

                    <div class="mt-4">
                        <h4 class="font-bold text-sm">Comentarios</h4>
                        <div class="max-h-32 overflow-y-auto mb-2">${commentsHtml}</div>
                        <div class="flex gap-2">
                            <input type="text" class="border p-1 flex-1 text-sm rounded" placeholder="Comentar...">
                            <button class="btn-comment bg-blue-500 text-white px-3 rounded text-sm" data-activity-id="${act.id}">Enviar</button>
                        </div>
                    </div>
                </div>
            `;
            this.container.appendChild(card);
        });
    }
}