export class Profile {
    constructor() {
        // Referencias al DOM
        this.form = document.getElementById('form-profile');
        this.avatarInput = document.getElementById('avatar-upload');
        this.avatarImg = document.getElementById('profile-avatar-img');
        this.displayName = document.getElementById('profile-display-name');
        this.inputName = document.getElementById('input-nombre');
        this.inputEmail = document.getElementById('input-email');
        this.inputBio = document.getElementById('input-bio');
        this.btnLogout = document.getElementById('btn-logout');

        this.currentUser = this.loadUser();
        this.init();
    }

    init() {
        this.renderProfile();

        // Escuchar cambios en la imagen (preview)
        if (this.avatarInput) {
            this.avatarInput.addEventListener('change', (e) => this.handleImageUpload(e));
        }

        // Escuchar el envío del formulario
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveProfile(new FormData(e.target));
            });
        }

        // Botón de Logout
        if (this.btnLogout) {
            this.btnLogout.addEventListener('click', () => {
                if(confirm('¿Seguro que quieres cerrar sesión?')) {
                    window.location.href = 'login.html';
                }
            });
        }
    }

    loadUser() {
        const stored = localStorage.getItem('currentUser');
        if (stored) return JSON.parse(stored);
        
        // Usuario por defecto si no existe
        return { 
            id: 1, 
            nombre: 'Usuario Nuevo', 
            email: 'usuario@ejemplo.com',
            bio: '',
            avatar: 'https://placehold.co/200x200?text=User'
        };
    }

    renderProfile() {
        // Rellenar campos con los datos actuales
        this.displayName.textContent = this.currentUser.nombre;
        this.inputName.value = this.currentUser.nombre || '';
        this.inputEmail.value = this.currentUser.email || '';
        this.inputBio.value = this.currentUser.bio || '';
        
        if (this.currentUser.avatar) {
            this.avatarImg.src = this.currentUser.avatar;
        }
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                // Actualizar la vista previa inmediatamente
                this.avatarImg.src = e.target.result;
                // Guardar temporalmente en el objeto usuario (como string Base64)
                this.currentUser.avatar = e.target.result; 
            };
            reader.readAsDataURL(file);
        }
    }

    saveProfile(formData) {
        // Actualizar objeto usuario
        this.currentUser.nombre = formData.get('nombre');
        this.currentUser.email = formData.get('email');
        this.currentUser.bio = formData.get('bio');
        
        // Validación básica de contraseña
        const pass = formData.get('password');
        const confirmPass = formData.get('confirm_password');
        
        if (pass || confirmPass) {
            if (pass !== confirmPass) {
                alert('Las contraseñas no coinciden.');
                return;
            }
            if (pass.length < 4) {
                alert('La contraseña es muy corta.');
                return;
            }
            // Aquí enviarías la password al backend
            console.log("Contraseña actualizada (simulado)");
        }

        // Guardar en localStorage
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        
        // Actualizar UI
        this.displayName.textContent = this.currentUser.nombre;
        
        alert('¡Perfil actualizado con éxito!');
    }
}