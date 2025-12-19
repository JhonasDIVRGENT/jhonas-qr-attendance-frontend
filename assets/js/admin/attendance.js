import { apiFetch } from '../api.js';

const meetingSelect = document.getElementById('meetingSelect');
const attendanceList = document.getElementById('attendanceList');
const reportBox = document.getElementById('reportBox');

// Protección básica
if (!localStorage.getItem('token')) {
  window.location.href = '../auth/login.html';
}

// Cargar reuniones
async function loadMeetings() {
  const meetings = await apiFetch('/meetings');

  meetingSelect.innerHTML = `
    <option value="">-- Selecciona una reunión --</option>
  `;

  meetings.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m.id;
    opt.textContent = `${m.title} (${m.is_active ? 'Activa' : 'Cerrada'})`;
    meetingSelect.appendChild(opt);
  });
}

// Cargar asistencias
async function loadAttendance(meetingId) {
  attendanceList.innerHTML = '';
  reportBox.style.display = 'none';

  const data = await apiFetch(`/attendance/meeting/${meetingId}`);

  if (!data.attendance || data.attendance.length === 0) {
    attendanceList.innerHTML = '<p>No hay asistencias registradas</p>';
    return;
  }

  attendanceList.innerHTML = `
    <section class="card">
      <table style="width:100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Estado</th>
            <th>Hora</th>
          </tr>
        </thead>
        <tbody>
          ${data.attendance.map(a => `
            <tr>
              <td>${a.full_name}</td>
              <td>${a.email}</td>
              <td>${renderStatus(a.status)}</td>
              <td>${new Date(a.scan_time).toLocaleString('es-PE', { hour12:false })}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </section>
  `;

  loadReport(meetingId);
}

// Cargar reporte
async function loadReport(meetingId) {
  const report = await apiFetch(`/attendance/report/${meetingId}`);

  reportBox.style.display = 'block';
  reportBox.innerHTML = `
    <h3>📈 Resumen</h3>
    <p>Total: <strong>${report.total_users}</strong></p>
    <p>🟢 Temprano: <strong>${report.early}</strong></p>
    <p>🟡 Tarde: <strong>${report.late}</strong></p>
    <p>🔴 Falta: <strong>${report.absent}</strong></p>
  `;
}

// Helpers
function renderStatus(status) {
  if (status === 'early') return '🟢 Temprano';
  if (status === 'late') return '🟡 Tarde';
  return '🔴 Falta';
}

// Eventos
meetingSelect.addEventListener('change', () => {
  const meetingId = meetingSelect.value;
  if (meetingId) loadAttendance(meetingId);
});

// Init
loadMeetings();
