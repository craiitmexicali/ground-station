# 🚀 Ground Station - Estación Terrestre para Vehículos Autónomos

<p align="center">
  <img src="docs/assets/dashboard-preview.png" alt="Dashboard Preview" width="800"/>
</p>

## 📋 Descripción

**Ground Station** es una interfaz gráfica de usuario (GUI) basada en web para el monitoreo en tiempo real de vehículos autónomos. El sistema actúa como una "Estación Terrestre" capaz de visualizar flujos de datos críticos mediante WebSockets.

Este proyecto resuelve la necesidad de **"visibilidad"** durante las pruebas de campo, eliminando la dependencia de cables seriales para la depuración.

---

## ✨ Características Principales

### 📊 Dashboard de Instrumentación
- Visualización dinámica de variables críticas:
  - ⚡ **Voltaje de batería** - Monitoreo del estado de carga
  - 🌡️ **Temperatura de CPU** - Control térmico del sistema
  - ⚙️ **RPM de motores** - Velocidad y rendimiento
- Gráficos reactivos con **Chart.js** y **Recharts**
- Actualización en tiempo real cada segundo

### 🔬 Modo de Simulación de Hardware
- **SimulationEngine.js** - Generador de datos sintéticos integrado
- Ruido gaussiano para emular comportamiento de sensores reales
- Prueba la interfaz sin necesidad del robot físico
- Emula comunicación ESP32/Arduino por WiFi

### 📝 Registro de Eventos (Logs)
- Sistema de alertas con niveles de severidad (INFO, WARNING, ERROR, CRITICAL)
- Consola de depuración remota
- Identificación de fallos en firmware desde el navegador
- Historial de eventos con timestamps

### 🔌 Conexión WebSocket
- Soporte para conexión en tiempo real con hardware
- Reconexión automática
- Indicador de estado de conexión
- Compatible con ESP32, Arduino WiFi, y otros microcontroladores

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Uso |
|------------|-----|
| React 18 | Framework de UI |
| Chart.js | Gráficos de línea y medidores |
| Recharts | Visualizaciones adicionales |
| WebSockets | Comunicación en tiempo real |
| CSS3 | Estilos y animaciones |

---

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js >= 16.x
- npm >= 8.x

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/ground-station.git

# Entrar al directorio
cd ground-station

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm start
```

La aplicación estará disponible en `http://localhost:3000`

### Compilar para Producción

```bash
npm run build
```

---

## 📁 Estructura del Proyecto

```
ground-station/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Dashboard.css
│   │   │   ├── GaugeChart.jsx
│   │   │   └── LineChart.jsx
│   │   ├── Logs/
│   │   │   ├── EventLog.jsx
│   │   │   └── EventLog.css
│   │   └── Header/
│   │       ├── Header.jsx
│   │       └── Header.css
│   ├── services/
│   │   ├── SimulationEngine.js    # ⭐ Motor de simulación
│   │   └── WebSocketService.js
│   ├── utils/
│   │   └── helpers.js
│   ├── App.jsx
│   ├── App.css
│   └── index.js
├── docs/
│   └── assets/
├── package.json
├── .gitignore
└── README.md
```

---

## 🔬 Motor de Simulación

El archivo `SimulationEngine.js` permite probar la interfaz completa sin hardware real:

```javascript
import { iniciarSimulacion } from './services/SimulationEngine';

// Iniciar simulación
iniciarSimulacion((datos) => {
  console.log('Datos recibidos:', datos);
  // { voltaje: "12.45", temperatura: "47.3", velocidad: "1.23", timestamp: "14:30:25" }
});
```

### Datos Simulados:
- **Batería**: Descarga gradual de 12.6V a ~2.6V
- **Temperatura**: Oscilación senoidal (40-50°C)
- **Velocidad**: Ruido aleatorio (0-2 m/s)
- **RPM Motors**: Variación con ruido gaussiano

---

## 🔌 Conexión con Hardware Real

Para conectar con un ESP32 u otro microcontrolador:

1. Configura el WebSocket en tu microcontrolador para enviar JSON:
```json
{
  "voltaje": 12.45,
  "temperatura": 45.2,
  "velocidad": 1.5,
  "rpm_left": 1200,
  "rpm_right": 1180
}
```

2. Modifica la URL del WebSocket en `WebSocketService.js`:
```javascript
const WS_URL = 'ws://192.168.1.100:81'; // IP de tu ESP32
```

---

## 📸 Capturas de Pantalla

### Dashboard Principal
![Dashboard](docs/assets/dashboard.png)

### Consola de Logs
![Logs](docs/assets/logs.png)

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

---

## 👥 Autores

- **CRAI Team** - *Desarrollo inicial*

---

## 🙏 Agradecimientos

- Equipo de robótica CRAI
- Comunidad de React y Chart.js
- Todos los contribuidores del proyecto

---

<p align="center">
  Hecho con ❤️ para la comunidad de robótica
</p>
