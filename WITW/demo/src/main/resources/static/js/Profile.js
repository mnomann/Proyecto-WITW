/**
 * Clase que gestiona la lógica del perfil de usuario.
 * Se encarga de cargar y mostrar la información del usuario, manejar la actualización
 * de datos (incluyendo la foto de perfil) y gestionar la persistencia mediante LocalStorage.
 */
export class Profile {

    /**
     * Crea una instancia de la clase Profile.
     * Inicializa las referencias a los elementos del formulario y carga los datos
     * del usuario actual desde el almacenamiento local.
     */
    constructor() {
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

    /**
     * Inicializa los escuchadores de eventos (listeners) para la interfaz del perfil.
     * Configura la detección de cambios en la imagen de avatar, el envío del formulario
     * de actualización y la acción del botón de cerrar sesión.
     */
    init() {
        this.renderProfile();

        if (this.avatarInput) {
            this.avatarInput.addEventListener('change', (e) => this.handleImageUpload(e));
        }

        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveProfile(new FormData(e.target));
            });
        }

        if (this.btnLogout) {
            this.btnLogout.addEventListener('click', () => {
                if (confirm('¿Seguro que quieres cerrar sesión?')) {
                    window.location.href = 'login.html';
                }
            });
        }
    }

    /**
     * Recupera la información del usuario actual desde LocalStorage.
     * Si no existen datos previos, retorna un objeto de usuario con valores por defecto.
     *
     * @returns {Object} El objeto con los datos del usuario (id, nombre, email, bio, avatar).
     */
    loadUser() {
        const stored = localStorage.getItem('currentUser');
        if (stored) return JSON.parse(stored);

        return {
            id: 1,
            nombre: 'Usuario Nuevo',
            email: 'usuario@ejemplo.com',
            bio: '',
            avatar: 'https://placehold.co/200x200?text=User'
        };
    }

    /**
     * Actualiza la interfaz gráfica (DOM) con los datos del usuario cargado.
     * Rellena los campos de texto y actualiza la fuente de la imagen del avatar.
     */
    renderProfile() {
        this.displayName.textContent = this.currentUser.nombre;
        this.inputName.value = this.currentUser.nombre || '';
        this.inputEmail.value = this.currentUser.email || '';
        this.inputBio.value = this.currentUser.bio || '';

        if (this.currentUser.avatar) {
            this.avatarImg.src = this.currentUser.avatar;
        }
    }

    /**
     * Maneja la subida de una nueva imagen de perfil.
     * Lee el archivo seleccionado mediante FileReader, actualiza la vista previa
     * en tiempo real y almacena la imagen como una cadena Base64 en el objeto de usuario.
     *
     * @param {Event} event - El evento change del input de tipo file.
     */
    handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.avatarImg.src = e.target.result;
                this.currentUser.avatar = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    /**
     * Procesa y guarda los cambios realizados en el perfil.
     * Actualiza el objeto de usuario con los datos del formulario, valida las contraseñas
     * (si se proporcionaron) y persiste los cambios en LocalStorage.
     *
     * @param {FormData} formData - Los datos capturados del formulario de perfil.
     */
    saveProfile(formData) {
        this.currentUser.nombre = formData.get('nombre');
        this.currentUser.email = formData.get('email');
        this.currentUser.bio = formData.get('bio');

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
            console.log("Contraseña actualizada (simulado)");
        }

        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

        this.displayName.textContent = this.currentUser.nombre;

        alert('¡Perfil actualizado con éxito!');
    }
}