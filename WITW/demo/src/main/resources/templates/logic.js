document.addEventListener('DOMContentLoaded', () => {

    // --- Mapa con Leaflet ---
    let map;
    let mapInitialized = false;

    function initializeMap() {
        const mapContainer = document.getElementById('map-container');
        if (mapContainer) {
            mapContainer.innerHTML = '';
        } else {
            console.error('ERROR CRÍTICO: No se pudo encontrar el elemento #map-container.');
            return;
        }

        if (mapInitialized) {
            setTimeout(() => map.invalidateSize(), 100);
            return;
        }

        // Coordenadas centradas en Chile
        const chileCenter = [-33.45694, -70.64827]; 
        map = L.map('map-container').setView(chileCenter, 5); 

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.marker(chileCenter).addTo(map)
            .bindPopup('<b>Santiago de Chile</b><br>Un evento de ejemplo.')
            .openPopup();
            
        mapInitialized = true;
        
        setTimeout(() => map.invalidateSize(), 100);
    }


    // --- Datos y localStorage ---
    const DUMMY_ACTIVITIES = [
        { id: 1, nombre: 'Senderismo en el Parque Nacional', lugar: 'Parque Nacional La Campana', fecha: '2025-11-15', hora: '09:00', descripcion: 'Excursión al cerro La Campana, dificultad media.', imagenUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop', capacidadMaxima: 20, asistentes: [], comentarios: [] },
        { id: 2, nombre: 'Día de Playa y Surf', lugar: 'Pichilemu', fecha: '2026-01-20', hora: '11:00', descripcion: 'Clases de surf y relajo en la playa principal.', imagenUrl: 'https://images.unsplash.com/photo-1502680390469-be75c88b63f8?q=80&w=2070&auto=format&fit=crop', capacidadMaxima: 15, asistentes: [], comentarios: [] },
        { id: 3, nombre: 'Tour Astronómico', lugar: 'Valle del Elqui', fecha: '2026-02-10', hora: '21:00', descripcion: 'Observación de estrellas con telescopios profesionales.', imagenUrl: 'https://images.unsplash.com/photo-1534235826754-0a3511d1323a?q=80&w=1974&auto=format&fit=crop', capacidadMaxima: 10, asistentes: [], comentarios: [] }
    ];

    function getActivities() {
        let activities = localStorage.getItem('activities');
        if (!activities) {
            localStorage.setItem('activities', JSON.stringify(DUMMY_ACTIVITIES));
            return DUMMY_ACTIVITIES;
        }
        return JSON.parse(activities);
    }

    function saveActivities(activities) {
        localStorage.setItem('activities', JSON.stringify(activities));
    }

    // --- Navegación de Página Única (SPA) ---
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');

    function showSection(sectionId) {
        sections.forEach(section => {
            section.style.display = (section.id === sectionId) ? 'block' : 'none';
        });

        if (sectionId === 'mapa') {
            initializeMap();
        }

        // Oculta el menú de perfil al cambiar de sección
        const profileMenu = document.getElementById('profileMenu');
        if (profileMenu) {
            profileMenu.classList.add('hidden');
        }
    }

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sectionId = button.getAttribute('data-section');
            if (sectionId) {
                showSection(sectionId);
            }
        });
    });

    // --- Lógica de la Sección de Inicio ---
    const contenedorActividades = document.getElementById('contenedor-actividades');

    // --- Gestión de Usuarios ---
    function getCurrentUser() {
        let user = localStorage.getItem('currentUser');
        if (!user) {
            // Usuario simulado por defecto
            user = { id: 1, nombre: 'Usuario Demo' };
            localStorage.setItem('currentUser', JSON.stringify(user));
        }
        return JSON.parse(user);
    }

    // --- Funciones de Interacciones Sociales ---
    function toggleAttendance(activityId) {
        const activities = getActivities();
        const activity = activities.find(act => act.id === activityId);
        const currentUser = getCurrentUser();

        if (!activity) return;

        const isAttending = activity.asistentes.some(asistente => asistente.id === currentUser.id);

        if (isAttending) {
            // Cancelar asistencia
            activity.asistentes = activity.asistentes.filter(asistente => asistente.id !== currentUser.id);
        } else {
            // Confirmar asistencia
            if (activity.asistentes.length >= activity.capacidadMaxima) {
                alert('¡Lo sentimos! Esta actividad ya alcanzó su capacidad máxima.');
                return;
            }
            activity.asistentes.push({ id: currentUser.id, nombre: currentUser.nombre });
        }

        saveActivities(activities);
        displayActivities();
    }

    function addComment(activityId, commentText) {
        if (!commentText.trim()) return;

        const activities = getActivities();
        const activity = activities.find(act => act.id === activityId);
        const currentUser = getCurrentUser();

        if (!activity) return;

        const newComment = {
            id: Date.now(),
            usuarioId: currentUser.id,
            usuarioNombre: currentUser.nombre,
            texto: commentText.trim(),
            fecha: new Date().toISOString()
        };

        activity.comentarios.push(newComment);
        saveActivities(activities);
        displayActivities();
    }

    function displayActivities() {
        const activities = getActivities();
        const currentUser = getCurrentUser();
        contenedorActividades.innerHTML = '';

        activities.forEach(act => {
            const isAttending = act.asistentes.some(asistente => asistente.id === currentUser.id);
            const isFull = act.asistentes.length >= act.capacidadMaxima;

            const card = document.createElement('div');
            card.className = 'bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300';

            const commentsHtml = act.comentarios.map(comment => `
                <div class="border-t pt-2 mt-2">
                    <div class="flex items-center space-x-2">
                        <span class="font-semibold text-sm">${comment.usuarioNombre}</span>
                        <span class="text-xs text-gray-500">${new Date(comment.fecha).toLocaleDateString()}</span>
                    </div>
                    <p class="text-sm text-gray-700 mt-1">${comment.texto}</p>
                </div>
            `).join('');

            card.innerHTML = `
                <img src="${act.imagenUrl}" alt="${act.nombre}" class="w-full h-48 object-cover" onerror="this.onerror=null;this.src='https.placehold.co/600x400/EEE/31343C?text=Imagen no disponible';">
                <div class="p-4">
                    <h3 class="text-xl font-semibold mb-2">${act.nombre}</h3>
                    <p class="text-gray-600 mb-2"><i class="bi bi-geo-alt-fill"></i> ${act.lugar}</p>
                    <p class="text-gray-700 text-sm mb-4">${act.descripcion}</p>
                    <div class="text-sm text-gray-500 mb-4">
                        <i class="bi bi-calendar-event"></i> ${act.fecha} a las ${act.hora}
                    </div>

                    <!-- Contador de Asistentes -->
                    <div class="mb-4">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-sm font-medium">Asistentes: ${act.asistentes.length}/${act.capacidadMaxima}</span>
                            ${isFull ? '<span class="text-red-500 text-sm font-medium">¡COMPLETO!</span>' : ''}
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="bg-blue-600 h-2 rounded-full" style="width: ${(act.asistentes.length / act.capacidadMaxima) * 100}%"></div>
                        </div>
                    </div>

                    <!-- Botón de Asistencia -->
                    <button class="btn-asistencia w-full mb-4 ${isAttending ? 'bg-red-500 hover:bg-red-600' : isFull ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'} text-white py-2 px-4 rounded transition-colors duration-200" data-activity-id="${act.id}" ${isFull && !isAttending ? 'disabled' : ''}>
                        ${isAttending ? 'Cancelar Asistencia' : isFull ? 'Capacidad Máxima Alcanzada' : 'Confirmar Asistencia'}
                    </button>

                    <!-- Comentarios -->
                    <div class="border-t pt-4">
                        <h4 class="font-semibold mb-2">Comentarios (${act.comentarios.length})</h4>
                        <div class="space-y-2 mb-3 max-h-32 overflow-y-auto">
                            ${commentsHtml || '<p class="text-gray-500 text-sm">No hay comentarios aún.</p>'}
                        </div>
                        <div class="flex space-x-2">
                            <input type="text" class="comment-input flex-1 border rounded px-3 py-1 text-sm" placeholder="Escribe un comentario..." data-activity-id="${act.id}">
                            <button class="btn-comment bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm" data-activity-id="${act.id}">Enviar</button>
                        </div>
                    </div>
                </div>
            `;

            contenedorActividades.appendChild(card);
        });

        // Agregar event listeners para botones de asistencia y comentarios
        document.querySelectorAll('.btn-asistencia').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const activityId = parseInt(e.target.getAttribute('data-activity-id'));
                toggleAttendance(activityId);
            });
        });

        document.querySelectorAll('.btn-comment').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const activityId = parseInt(e.target.getAttribute('data-activity-id'));
                const input = e.target.previousElementSibling;
                addComment(activityId, input.value);
                input.value = '';
            });
        });

        document.querySelectorAll('.comment-input').forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const activityId = parseInt(e.target.getAttribute('data-activity-id'));
                    addComment(activityId, e.target.value);
                    e.target.value = '';
                }
            });
        });
    }

    // --- Lógica para Añadir Actividad ---
    const addForm = document.getElementById('form-add');
    if(addForm) {
        addForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const newActivity = {
                id: Date.now(),
                nombre: addForm.querySelector('[name="nombre"]').value,
                lugar: addForm.querySelector('[name="lugar"]').value,
                fecha: addForm.querySelector('[name="fecha"]').value,
                hora: addForm.querySelector('[name="hora"]').value,
                descripcion: addForm.querySelector('[name="descripcion"]').value,
                imagenUrl: addForm.querySelector('[name="imagenUrl"]').value,
                capacidadMaxima: parseInt(addForm.querySelector('[name="capacidadMaxima"]').value) || 10,
                asistentes: [],
                comentarios: []
            };

            const activities = getActivities();
            activities.push(newActivity);
            saveActivities(activities);

            alert('¡Actividad agregada con éxito!');
            addForm.reset();
            displayActivities();
            showSection('inicio');
        });
    }

    // --- Lógica del Menú de Perfil ---
    const profileBtn = document.getElementById('profileBtn');
    const profileMenu = document.getElementById('profileMenu');
    profileBtn.addEventListener('click', () => {
        profileMenu.classList.toggle('hidden');
    });

    // --- Inicialización ---
    displayActivities(); 
    showSection('inicio');
});
