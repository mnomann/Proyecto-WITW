export class Navigation {
    constructor() {
        this.sections = document.querySelectorAll('.section');
        this.profileMenu = document.getElementById('profileMenu');
        this.init();
    }

    init() {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const section = btn.getAttribute('data-section');
                this.switchSection(section);
            });
        });

        // Toggle del menú perfil
        const profileBtn = document.getElementById('profileBtn');
        if (profileBtn) {
            profileBtn.addEventListener('click', () => {
                this.profileMenu.classList.toggle('hidden');
            });
        }

        // Escuchar evento personalizado para navegación automática (desde Activities)
        document.addEventListener('navigate-to', (e) => {
            this.switchSection(e.detail);
        });
    }

    switchSection(sectionId) {
        this.sections.forEach(sec => sec.classList.add('hidden'));
        
        const target = document.getElementById(sectionId);
        if (target) {
            target.classList.remove('hidden');
        }

        if (this.profileMenu) this.profileMenu.classList.add('hidden');
    }
}