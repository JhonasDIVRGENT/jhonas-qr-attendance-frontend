# 📱 Sistema de Asistencia por QR - Frontend

Sistema moderno de registro de asistencia mediante códigos QR, diseñado para facilitar el control de asistencia en reuniones y eventos con una interfaz intuitiva y atractiva.

## 🚀 Características

- **Generación de códigos QR** para reuniones con colores optimizados (blanco/negro) para máxima legibilidad
- **Escaneo desde cámara** en tiempo real con animaciones visuales profesionales
- **Carga de imágenes** para escanear códigos QR desde fotos
- **Interfaz responsive** adaptable a dispositivos móviles y desktop
- **Dashboard administrativo** para gestión de reuniones y asistencias
- **Registro automático** de estado (temprano/tarde/ausente)
- **Logs en tiempo real** del proceso de escaneo
- **Diseño cyberpunk** con efectos visuales atractivos

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Vanilla JavaScript** (ES6 Modules)
- **HTML5** & **CSS3**
- **ZXing Library** (@zxing/library) - Librería robusta de Google para detección de códigos QR
- **QRCode.js** (v1.0.0) - Generación de códigos QR
- **Fetch API** - Comunicación con backend

### Backend (Repositorio separado)
- **Node.js** con Express
- **PostgreSQL** - Base de datos relacional
- **JWT** - Autenticación y autorización

## 📁 Estructura del Proyecto

```
jhonas-qr-attendance-frontend/
├── index.html                    # Página principal
├── auth/
│   └── login.html               # Página de inicio de sesión
├── admin/
│   ├── dashboard.html           # Panel de administración
│   ├── meeting.html             # Gestión de reuniones
│   └── attendance.html          # Visualización de asistencias
├── user/
│   ├── scan.html                # Escáner de QR (interfaz mejorada)
│   └── result.html              # Resultado del escaneo
├── public/
│   └── screen.html              # Pantalla pública de QR
├── assets/
│   ├── css/
│   │   ├── base.css            # Estilos base
│   │   ├── layout.css          # Diseño y layout
│   │   ├── auth.css            # Estilos de autenticación
│   │   └── cyberpunk.css       # Tema cyberpunk
│   └── js/
│       ├── config.js           # Configuración de API
│       ├── api.js              # Cliente HTTP
│       ├── auth.js             # Manejo de autenticación
│       ├── qr.js               # Generación de códigos QR
│       ├── admin/
│       │   ├── dashboard.js    # Lógica del dashboard
│       │   ├── meeting.js      # Gestión de reuniones
│       │   └── attendance.js   # Visualización de asistencias
│       └── user/
│           └── scan.js         # Escaneo de QR (155 líneas optimizadas)
```

## 🎯 Flujo de Funcionamiento

### Para Administradores
1. Login en el sistema
2. Crear reunión con fecha, hora y descripción
3. Generar código QR automáticamente
4. Mostrar QR en pantalla o proyector
5. Visualizar asistencias en tiempo real

### Para Usuarios
1. Acceder a la página de escaneo
2. Permitir acceso a la cámara
3. Enfocar el código QR de la reunión
4. Registro automático con estado (temprano/tarde/ausente)
5. Ver confirmación instantánea

## 🔧 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/jhonas-qr-attendance-frontend.git
cd jhonas-qr-attendance-frontend
```

### 2. Configurar la URL del backend
Editar `assets/js/config.js`:
```javascript
export const API_BASE_URL = 'https://tu-backend-api.com';
```

### 3. Servir archivos estáticos
Puede usar cualquier servidor web:

**Opción 1: Live Server (VS Code)**
- Instalar extensión Live Server
- Click derecho en index.html → "Open with Live Server"

**Opción 2: Python**
```bash
python -m http.server 8000
```

**Opción 3: Node.js**
```bash
npx serve
```

### 4. Acceder a la aplicación
Abrir navegador en `http://localhost:8000` (o el puerto configurado)

## 📱 Características del Escáner

### Diseño Visual Mejorado
- **Línea de escaneo animada** que se desplaza verticalmente
- **Ícono QR pulsante** (📱) en el centro del marco
- **Instrucciones flotantes** con efecto hover
- **Esquinas redondeadas brillantes** con sombras neón
- **Botones con gradientes** y efectos visuales
- **Marco de escaneo animado** con pulso suave

### Optimizaciones Técnicas
- Detección robusta con **ZXing** (más confiable que Html5Qrcode o jsQR)
- Códigos QR en **blanco/negro** para máximo contraste
- Soporte para **cámara trasera** en móviles
- **Logs detallados** del proceso de escaneo
- Manejo de errores con reintentos automáticos

## 🎨 Paleta de Colores (Tema Cyberpunk)

```css
--primary: #00ffe1 (cyan neón)
--background: #000f1e (azul oscuro)
--card: rgba(0, 20, 40, 0.9)
--accent: #0ff
--text: #e0e0e0
```

## 🔐 Seguridad

- Tokens JWT para autenticación
- Validación de tokens QR únicos
- Protección contra escaneos duplicados
- CORS configurado en backend
- Manejo seguro de credenciales

## 📊 Base de Datos (Backend)

### Tablas principales:
- **users** - Usuarios del sistema
- **meetings** - Reuniones creadas
- **qr_tokens** - Tokens únicos por reunión
- **attendance** - Registros de asistencia
- **attendance_retries** - Intentos fallidos

## 🚨 Solución de Problemas

### El escáner no detecta el QR
- ✅ Verificar que el QR tenga fondo **blanco** y puntos **negros**
- ✅ Asegurar buena iluminación
- ✅ Probar con la opción de subir foto
- ✅ Verificar permisos de cámara en el navegador

### Error "Meeting is closed"
- ✅ Verificar que la reunión esté activa (is_active=true)
- ✅ Revisar fecha/hora de la reunión

### Problemas de conexión
- ✅ Verificar URL del backend en config.js
- ✅ Comprobar que el backend esté en ejecución
- ✅ Revisar CORS en el servidor

## 📄 API Endpoints Utilizados

```javascript
POST /auth/login          // Inicio de sesión
GET  /auth/me            // Datos del usuario actual
POST /meetings           // Crear reunión
GET  /meetings           // Listar reuniones
POST /attendance/scan    // Registrar asistencia
GET  /attendance/:id     // Ver asistencias de reunión
```

## 👨‍💻 Desarrollo

### Convenciones de código
- ES6 Modules para organización
- Async/await para operaciones asíncronas
- Manejo de errores con try-catch
- Logs informativos en desarrollo

### Próximas mejoras
- [ ] Modo oscuro/claro
- [ ] Notificaciones push
- [ ] Exportación de reportes (PDF/Excel)
- [ ] Gráficas de asistencia
- [ ] Soporte multiidioma

## 📝 Licencia

Este proyecto es de uso educativo.

## 👤 Autor

**Jhonas**
- Proyecto: Sistema de Asistencia por QR
- Fecha: Diciembre 2024

---

⭐ Si te gusta este proyecto, considera darle una estrella!
