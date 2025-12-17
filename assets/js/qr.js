import { apiFetch } from './api.js';


const select = document.getElementById('meetingSelect');
const qrContainer = document.getElementById('qrContainer');

let qrInstance = null;

async function loadMeetings() {
  const meetings = await apiFetch('/public/meetings');

  meetings.forEach(m => {
    const option = document.createElement('option');
    option.value = m.id;
    option.textContent = m.title;
    select.appendChild(option);
  });
}

select.addEventListener('change', async () => {
  const meetingId = select.value;
  const data = await apiFetch(`/public/meetings/${meetingId}/qr`);

  // Limpiar QR anterior
  qrContainer.innerHTML = '';

  // Generar QR nuevo
  qrInstance = new QRCode(qrContainer, {
    text: data.token,
    width: 420,
    height: 420,
    colorDark: '#00ffe1',
    colorLight: '#05010d',
    correctLevel: QRCode.CorrectLevel.H
  });
});

loadMeetings();
