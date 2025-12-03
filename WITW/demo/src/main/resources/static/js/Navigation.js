/**
 * Clase responsable de la navegación dentro de la aplicación (SPA).
 * Gestiona la visibilidad de las diferentes secciones (Inicio, Mapa, Perfil, etc.)
 * y controla el comportamiento del menú desplegable de usuario.
 */
export class Navigation {

    /**
     * Crea una instancia de la clase Navigation.
     * Inicializa las referencias a las secciones del DOM y al menú de perfil,
     * y dispara la configuración inicial de los eventos.
     */
    constructor() {
        this.sections = document.querySelectorAll('.section');
        this.profileMenu = document.getElementById('profileMenu');
        this.init();
    }

    /**
     * Configura los escuchadores de eventos (listeners) necesarios para la navegación.
     * - Asigna eventos de clic a los botones de navegación.
     * - Configura la apertura/cierre del menú de perfil.
     * - Escucha eventos personalizados 'navigate-to' para permitir la navegación
     * programática desde otros módulos.
     */
    init() {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const section = btn.getAttribute('data-section');
                this.switchSection(section);
            });
        });

        const profileBtn = document.getElementById('profileBtn');
        if (profileBtn) {
            profileBtn.addEventListener('click', () => {
                this.profileMenu.classList.toggle('hidden');
            });
        }

        document.addEventListener('navigate-to', (e) => {
            this.switchSection(e.detail);
        });
    }

    /**
     * Cambia la sección visible en la interfaz.
     * Oculta todas las secciones activas y muestra únicamente la que coincide con el ID proporcionado.
     * Además, asegura que el menú de perfil se cierre automáticamente al navegar.
     *
     * @param {string} sectionId - El ID del elemento HTML (sección) que se desea mostrar.
     */
    switchSection(sectionId) {
        this.sections.forEach(sec => sec.classList.add('hidden'));

        const target = document.getElementById(sectionId);
        if (target) {
            target.classList.remove('hidden');
        }

        if (this.profileMenu) this.profileMenu.classList.add('hidden');
    }
}