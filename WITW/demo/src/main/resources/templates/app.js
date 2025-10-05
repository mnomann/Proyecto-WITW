// app.js
let actividades = [
  {
    nombre: "Taller de Fotografía",
    lugar: "Centro Cultural",
    fecha: "2025-10-01",
    hora: "16:00",
    descripcion: "Aprende técnicas básicas y avanzadas de fotografía en exteriores.",
    imagen: "imagenes/icono camara.png"
  }
];

const contenedor = document.getElementById('contenedor-actividades');
function renderActividades() {
  contenedor.innerHTML = '';
  actividades.forEach(act => {
    const bloque = document.createElement('div');
    bloque.className = "bg-white shadow rounded-lg p-4 flex justify-between items-center mb-4";
    bloque.innerHTML = `
      <div class="flex-1 pr-4">
        <h2 class="text-xl font-semibold text-gray-800">${act.nombre}</h2>
        <p class="text-gray-600">${act.lugar} - ${act.fecha} - ${act.hora}</p>
        <p class="mt-2 text-gray-700">${act.descripcion}</p>
      </div>
      <div class="w-24 h-24 flex-shrink-0">
        <img src="${act.imagen || 'https://via.placeholder.com/150'}"
             alt="icono de ${act.nombre}" class="w-full h-full object-cover rounded-md">
      </div>`;
    contenedor.appendChild(bloque);
  });
}
renderActividades();

// Menú perfil
document.getElementById('profileBtn')
  .addEventListener('click', () => {
    document.getElementById('profileMenu').classList.toggle('hidden');
  });

// Navegación interna
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    showSection(btn.dataset.section);
    document.getElementById('profileMenu').classList.add('hidden');
  });
});

// Form añadir actividad
document.getElementById('form-add')
  .addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target;
    actividades.push({
      nombre: f.nombre.value,
      lugar: f.lugar.value,
      fecha: f.fecha.value,
      hora: f.hora.value,
      descripcion: f.descripcion.value,
      imagen: f.imagen.value
    });
    renderActividades();
    f.reset();
    showSection('inicio');
  });

// Manejo simple de formularios de autenticación (sin backend)
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(loginForm);
    const email = data.get('email');
    const password = data.get('password');
    const msg = document.getElementById('loginMsg');
    // Validación simple
    if (!email || !password) {
      msg.textContent = 'Por favor completa todos los campos.';
      msg.className = 'text-red-600';
      return;
    }
    // Simular autenticación exitosa
    msg.textContent = 'Inicio de sesión exitoso (simulado). Redirigiendo...';
    msg.className = 'text-green-600';
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 900);
  });
}

const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(registerForm);
    const name = data.get('name');
    const email = data.get('email');
    const pass = data.get('password');
    const pass2 = data.get('password2');
    const msg = document.getElementById('registerMsg');
    if (!name || !email || !pass || !pass2) {
      msg.textContent = 'Completa todos los campos.';
      msg.className = 'text-red-600';
      return;
    }
    if (pass.length < 6) {
      msg.textContent = 'La contraseña debe tener al menos 6 caracteres.';
      msg.className = 'text-red-600';
      return;
    }
    if (pass !== pass2) {
      msg.textContent = 'Las contraseñas no coinciden.';
      msg.className = 'text-red-600';
      return;
    }
    msg.textContent = 'Registro exitoso (simulado). Puedes iniciar sesión.';
    msg.className = 'text-green-600';
    registerForm.reset();
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1000);
  });
}

// ======= Manejo de perfil y modo oscuro =======
const profileForm = document.getElementById('profileForm');
const avatarInput = document.getElementById('avatarInput');
const avatarPreview = document.getElementById('avatarPreview');
const profileMsg = document.getElementById('profileMsg');
const darkToggle = document.getElementById('darkToggle');
const darkKnob = document.getElementById('darkKnob');

function loadProfile() {
  try {
    const raw = localStorage.getItem('userProfile');
    if (!raw) return;
    const p = JSON.parse(raw);
    if (p.name) document.getElementById('profileName').value = p.name;
    if (p.email) document.getElementById('profileEmail').value = p.email;
    if (p.birthday) document.getElementById('profileBirthday').value = p.birthday;
    if (p.bio) document.getElementById('profileBio').value = p.bio;
    if (p.avatar) avatarPreview.src = p.avatar;
  } catch (e) {
    console.error('Error cargando perfil', e);
  }
}

function saveProfile(obj) {
  try {
    localStorage.setItem('userProfile', JSON.stringify(obj));
  } catch (e) { console.error('no se pudo guardar el perfil', e); }
}

if (avatarInput && avatarPreview) {
  avatarInput.addEventListener('change', e => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      avatarPreview.src = reader.result;
      // opcional: guardar inmediatamente en localStorage
      const raw = localStorage.getItem('userProfile');
      const p = raw ? JSON.parse(raw) : {};
      p.avatar = reader.result;
      saveProfile(p);
      // mostrar nombre de archivo
      const nameEl = document.getElementById('avatarFileName');
      if (nameEl) nameEl.textContent = f.name;
    };
    reader.readAsDataURL(f);
  });
}

// Mostrar nombre de archivo por defecto si existe en estado actual
const nameElInit = document.getElementById('avatarFileName');
if (nameElInit) {
  const raw = localStorage.getItem('userProfile');
  if (raw) {
    try {
      const p = JSON.parse(raw);
      if (p && p.avatar) nameElInit.textContent = 'Archivo cargado';
    } catch (e) {}
  }
}

if (profileForm) {
  profileForm.addEventListener('submit', e => {
    e.preventDefault();
    const p = {
      name: document.getElementById('profileName').value,
      email: document.getElementById('profileEmail').value,
      birthday: document.getElementById('profileBirthday').value,
      bio: document.getElementById('profileBio').value,
      avatar: avatarPreview ? avatarPreview.src : null
    };
    saveProfile(p);
    if (profileMsg) {
      profileMsg.textContent = 'Perfil guardado localmente.';
      profileMsg.className = 'text-green-600';
      setTimeout(() => { profileMsg.textContent = ''; }, 2000);
    }
  });
}

// Dark mode: persistir en localStorage
function applyDarkMode(enabled) {
  if (enabled) {
    document.documentElement.classList.add('dark');
    document.body.classList.add('bg-gray-900', 'text-gray-100');
    if (darkKnob) darkKnob.style.transform = 'translateX(1.5rem)';
    if (darkToggle) darkToggle.style.backgroundColor = '#4b5563';
  } else {
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('bg-gray-900', 'text-gray-100');
    if (darkKnob) darkKnob.style.transform = 'translateX(0)';
    if (darkToggle) darkToggle.style.backgroundColor = '#d1d5db';
  }
}

function loadDarkMode() {
  const raw = localStorage.getItem('darkMode');
  const enabled = raw === '1';
  applyDarkMode(enabled);
}

if (darkToggle) {
  darkToggle.addEventListener('click', () => {
    const currently = localStorage.getItem('darkMode') === '1';
    const next = !currently;
    localStorage.setItem('darkMode', next ? '1' : '0');
    applyDarkMode(next);
  });
}

// Inicializar
loadProfile();
loadDarkMode();

// Propagar cambios de darkMode entre pestañas/ventanas
window.addEventListener('storage', (e) => {
  if (e.key === 'darkMode') {
    const enabled = e.newValue === '1';
    applyDarkMode(enabled);
  }
});
