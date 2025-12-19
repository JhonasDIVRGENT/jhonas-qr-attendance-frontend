console.log('ADMIN DASHBOARD CARGADO');

// ==========================
// 🔐 Proteger dashboard
// ==========================
if (!localStorage.getItem('token')) {
  window.location.href = '../auth/login.html';
}

// ==========================
// Referencias existentes
// ==========================
const btnMeetings = document.getElementById('btnMeetings');
const btnAttendance = document.getElementById('btnAttendance');
const logoutBtn = document.getElementById('logoutBtn');

// ==========================
// Navegación (si existen)
// ==========================
if (btnMeetings) {
  btnMeetings.addEventListener('click', () => {
    window.location.href = 'meeting.html';
  });
}

if (btnAttendance) {
  btnAttendance.addEventListener('click', () => {
    window.location.href = 'attendance.html';
  });
}

// ==========================
// 🚪 Logout (agregado)
// ==========================
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.replace('../auth/login.html');
  });
}
