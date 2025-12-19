import { apiFetch } from '../api.js';

if (!localStorage.getItem('token')) {
  window.location.href = '../../auth/login.html';
}

let codeReader;
let scanning = false;

window.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const status = document.getElementById('status');
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const uploadBtn = document.getElementById('uploadBtn');
  const fileInput = document.getElementById('fileInput');
  const logContent = document.getElementById('logContent');

  function log(msg, color = '#0ff') {
    const div = document.createElement('div');
    div.style.color = color;
    div.textContent = `${new Date().toLocaleTimeString()} - ${msg}`;
    logContent.insertBefore(div, logContent.firstChild);
    if (logContent.children.length > 8) logContent.removeChild(logContent.lastChild);
  }

  // Inicializar ZXing
  if (typeof ZXing !== 'undefined') {
    codeReader = new ZXing.BrowserQRCodeReader();
    log('✅ Listo para escanear', '#0f0');
  } else {
    log('❌ Error al cargar librería', '#f00');
    status.textContent = '❌ Error al cargar sistema';
    return;
  }

  async function registrar(token) {
    try {
      // Limpiar token (quitar espacios, saltos de línea, etc.)
      const tokenLimpio = token.trim();
      
      status.textContent = '⏳ Registrando...';
      log(`Token detectado: ${tokenLimpio.substring(0, 30)}...`);
      log(`Longitud: ${tokenLimpio.length} caracteres`);
      
      // Backend espera "qr_token" (con guion bajo)
      const payload = { qr_token: tokenLimpio };
      log(`Enviando payload...`);
      
      const result = await apiFetch('/attendance/scan', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      log('✅ Asistencia registrada!', '#0f0');
      log(`Estado: ${result.status || 'N/A'}`, '#0f0');
      localStorage.setItem('attendanceResult', JSON.stringify(result));
      window.location.href = '../../../user/result.html';
    } catch (err) {
      status.textContent = `❌ ${err.message}`;
      log(`❌ Error del backend: ${err.message}`, '#f00');
      log(`💡 El QR fue detectado correctamente`, '#ff0');
      log(`⚠️ El problema está en el servidor backend`, '#ff0');
      log(`🔧 Solución: Re-desplegar backend sin validación is_active`, '#ff0');
    }
  }

  // Iniciar cámara
  startBtn.onclick = async () => {
    try {
      log('Iniciando cámara...');
      status.textContent = '📷 Iniciando...';
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      video.srcObject = stream;
      video.play();
      
      scanning = true;
      startBtn.style.display = 'none';
      stopBtn.style.display = 'inline-block';
      status.textContent = '📷 Enfoca el QR';
      log('✅ Cámara activa', '#0f0');
      
      escanearVideo();
    } catch (err) {
      status.textContent = '❌ Error al abrir cámara';
      log(`❌ ${err.message}`, '#f00');
    }
  };

  // Detener cámara
  stopBtn.onclick = () => {
    scanning = false;
    if (video.srcObject) {
      video.srcObject.getTracks().forEach(t => t.stop());
      video.srcObject = null;
    }
    startBtn.style.display = 'inline-block';
    stopBtn.style.display = 'none';
    status.textContent = '⏸️ Detenido';
    log('Cámara detenida');
  };

  // Escanear video
  async function escanearVideo() {
    if (!scanning) return;
    
    try {
      const result = await codeReader.decodeFromVideoElement(video);
      if (result) {
        scanning = false;
        stopBtn.click();
        log(`✅ QR: ${result.text.substring(0, 30)}...`, '#0f0');
        await registrar(result.text);
        return;
      }
    } catch (err) {
      // Continuar buscando
    }
    
    requestAnimationFrame(escanearVideo);
  }

  // Subir foto
  uploadBtn.onclick = () => fileInput.click();
  
  fileInput.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      log(`Analizando ${file.name}...`);
      status.textContent = '🖼️ Analizando...';
      
      const result = await codeReader.decodeFromImageUrl(URL.createObjectURL(file));
      
      if (result && result.text) {
        log(`✅ QR: ${result.text.substring(0, 30)}...`, '#0f0');
        await registrar(result.text);
      } else {
        throw new Error('No se detectó QR');
      }
    } catch (err) {
      status.textContent = '❌ No se detectó QR';
      log('❌ No se encontró QR en la imagen', '#f00');
      log('💡 Acércate más al QR y con buena luz', '#ff0');
    }
    
    fileInput.value = '';
  };

  status.textContent = '👆 Elige una opción';
});
