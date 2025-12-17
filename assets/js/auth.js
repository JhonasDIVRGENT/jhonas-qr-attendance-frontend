import { API_URL } from './config.js';
console.log('AUTH JS CARGADO');


const form = document.getElementById('loginForm');
const errorText = document.getElementById('loginError');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  errorText.textContent = '';

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      errorText.textContent = data.message || 'Error al iniciar sesión';
      return;
    }

    // Guardar token y usuario
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    // Redirección según rol
    if (data.user.role === 'admin') {
      window.location.href = '../admin/dashboard.html';
    } else {
      window.location.href = '../user/scan.html';
    }

  } catch (err) {
    errorText.textContent = 'Error de conexión con el servidor';
  }
});
