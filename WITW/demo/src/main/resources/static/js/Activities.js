export class Activities {
    constructor() {
        this.container = document.getElementById('contenedor-actividades');
        this.formAdd = document.getElementById('form-add');
        // Datos Dummy iniciales
        this.DUMMY_ACTIVITIES = [
            { id: 1, nombre: 'Senderismo en el Parque Nacional', lugar: 'Parque Nacional La Campana', fecha: '2025-11-15', hora: '09:00', descripcion: 'Excursión al cerro La Campana.', imagenUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop', capacidadMaxima: 20, asistentes: [], comentarios: [] },
            { id: 2, nombre: 'Día de Playa y Surf', lugar: 'Pichilemu', fecha: '2026-01-20', hora: '11:00', descripcion: 'Clases de surf.', imagenUrl: 'https://images.unsplash.com/photo-1502680390469-be75c88b63f8?q=80&w=2070&auto=format&fit=crop', capacidadMaxima: 15, asistentes: [], comentarios: [] }
        ];
        this.init();
    }

    init() {
        this.displayActivities();
        
        // Listener para añadir actividad
        if (this.formAdd) {
            this.formAdd.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddActivity(new FormData(e.target));
            });
        }

        // Listener global para clics en tarjetas (delegación de eventos)
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

    getActivities() {
        let activities = localStorage.getItem('activities');
        if (!activities) {
            localStorage.setItem('activities', JSON.stringify(this.DUMMY_ACTIVITIES));
            return this.DUMMY_ACTIVITIES;
        }
        return JSON.parse(activities);
    }

    saveActivities(activities) {
        localStorage.setItem('activities', JSON.stringify(activities));
    }

    getCurrentUser() {
        let user = localStorage.getItem('currentUser');
        if (!user) {
            user = { id: 1, nombre: 'Usuario Demo' };
            localStorage.setItem('currentUser', JSON.stringify(user));
        }
        return JSON.parse(user);
    }

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
        // Disparar evento para que Navigation sepa que debe volver al inicio
        document.dispatchEvent(new CustomEvent('navigate-to', { detail: 'inicio' }));
    }

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