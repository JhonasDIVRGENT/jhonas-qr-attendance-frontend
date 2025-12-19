import { apiFetch } from '../api.js';

/* ==========================
   Elementos DOM
========================== */
const meetingList = document.getElementById('meetingList');
const form = document.getElementById('meetingForm');

const titleInput = document.getElementById('title');
const startTimeInput = document.getElementById('startTime');
const durationInput = document.getElementById('duration');

/* Modal */
const editModal = document.getElementById('editModal');
const editTitle = document.getElementById('editTitle');
const editStartTime = document.getElementById('editStartTime');
const editDuration = document.getElementById('editDuration');
const editActive = document.getElementById('editActive');

let editingMeetingId = null;

/* ==========================
   Cargar reuniones
========================== */
async function loadMeetings() {
  meetingList.innerHTML = 'Cargando...';

  try {
    const meetings = await apiFetch('/meetings');

    if (!meetings.length) {
      meetingList.innerHTML = '<p>No hay reuniones</p>';
      return;
    }

    meetingList.innerHTML = meetings.map(m => `
      <div class="card">
        <strong>${m.title}</strong><br>
        <small>${new Date(m.start_time).toLocaleString()}</small><br>
        <span>${m.is_active ? '🟢 Activa' : '🔴 Cerrada'}</span>

        <div style="margin-top:1rem; display:flex; gap:.5rem; justify-content:center;">
          <button onclick="editMeeting(
            ${m.id},
            '${m.title}',
            '${m.start_time}',
            ${m.duration_minutes},
            ${m.is_active}
          )">✏️ Editar</button>

          <button onclick="regenerateQR(${m.id})">🔄 QR</button>
        </div>
      </div>
    `).join('');

  } catch (err) {
    console.error(err);
    meetingList.innerHTML = 'Error cargando reuniones';
  }
}

/* ==========================
   Crear reunión
========================== */
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const payload = {
    title: titleInput.value,
    start_time: new Date(startTimeInput.value).toISOString(),
    duration_minutes: Number(durationInput.value)
  };

  try {
    await apiFetch('/meetings', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    form.reset();
    loadMeetings();

  } catch (err) {
    alert(err.message);
  }
});

/* ==========================
   Abrir modal editar
========================== */
window.editMeeting = (id, title, startTime, duration, isActive) => {
  editingMeetingId = id;

  editTitle.value = title;
  editStartTime.value = startTime.slice(0, 16);
  editDuration.value = duration;
  editActive.value = String(isActive);

  editModal.classList.remove('hidden');
};

/* ==========================
   Guardar edición
========================== */
window.saveEdit = async () => {
  const payload = {
    title: editTitle.value,
    start_time: new Date(editStartTime.value).toISOString(),
    duration_minutes: Number(editDuration.value),
    is_active: editActive.value === 'true'
  };

  try {
    await apiFetch(`/meetings/${editingMeetingId}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });

    closeModal();
    loadMeetings();

  } catch (err) {
    alert(err.message);
  }
};

/* ==========================
   Cerrar modal
========================== */
window.closeModal = () => {
  editModal.classList.add('hidden');
  editingMeetingId = null;
};

/* ==========================
   Regenerar QR
========================== */
window.regenerateQR = async (id) => {
  try {
    await apiFetch(`/qr/${id}/regenerate`, { method: 'POST' });
    alert('QR regenerado correctamente');
  } catch (err) {
    alert(err.message);
  }
};

/* ==========================
   Init
========================== */
loadMeetings();
