# 🛰️ Ground Station - Estación Terrestre para Vehículos Autónomos

## Documentación Técnica Oficial - CRAI ITM

---

<p align="center">
  <img src="docs/assets/logo-crai.png" alt="CRAI Logo" width="200"/>
</p>

<p align="center">
  <strong>Club de Robótica y Automatización Industrial</strong><br>
  Instituto Tecnológico de Mexicali
</p>

---

## 📋 Información del Proyecto

| Campo | Detalle |
|-------|---------|
| **Nombre del Proyecto** | Ground Station - Estación Terrestre |
| **Versión** | 1.0.0 |
| **Fecha de Creación** | Enero 2026 |
| **Creado por** | **Diego Eduardo Martínez Cruz** |
| **Cargo** | Líder de CRAI |
| **Repositorio** | https://github.com/craiitmexicali/ground-station |
| **Licencia** | MIT |

---

## 📖 Índice de Contenidos

1. [Descripción General](#-descripción-general)
2. [Problemática que Resuelve](#-problemática-que-resuelve)
3. [Características Principales](#-características-principales)
4. [Capturas de Pantalla](#-capturas-de-pantalla)
5. [Arquitectura del Sistema](#-arquitectura-del-sistema)
6. [Tecnologías Utilizadas](#-tecnologías-utilizadas)
7. [Estructura del Proyecto](#-estructura-del-proyecto)
8. [Guía de Instalación Paso a Paso](#-guía-de-instalación-paso-a-paso)
9. [Cómo Usar la Aplicación](#-cómo-usar-la-aplicación)
10. [Explicación de Componentes](#-explicación-de-componentes)
11. [Motor de Simulación](#-motor-de-simulación)
12. [Conexión con Hardware Real](#-conexión-con-hardware-real)
13. [Personalización y Configuración](#-personalización-y-configuración)
14. [Solución de Problemas](#-solución-de-problemas)
15. [Contribuir al Proyecto](#-contribuir-al-proyecto)
16. [Créditos y Agradecimientos](#-créditos-y-agradecimientos)

---

## 🎯 Descripción General

**Ground Station** es una interfaz gráfica de usuario (GUI) basada en web, diseñada específicamente para el monitoreo en tiempo real de vehículos autónomos desarrollados por el Club de Robótica CRAI del Instituto Tecnológico de Mexicali.

El sistema funciona como una "Estación Terrestre" profesional, similar a las utilizadas en la industria aeroespacial y de drones, permitiendo visualizar flujos de datos críticos provenientes de robots y vehículos autónomos mediante comunicación WebSocket.

### ¿Qué es una Estación Terrestre?

Una estación terrestre es un centro de control desde donde se monitorean y supervisan vehículos no tripulados. En el contexto de CRAI, esta herramienta permite:

- Ver el estado del robot en tiempo real desde cualquier computadora
- Identificar problemas sin necesidad de conectar cables
- Probar el software sin el robot físico (modo simulación)
- Registrar eventos para análisis posterior

---

## 🔧 Problemática que Resuelve

### Antes de Ground Station:
- ❌ Necesitábamos cables USB/Serial para ver datos del robot
- ❌ No podíamos monitorear el robot a distancia
- ❌ Era difícil identificar fallos durante pruebas de campo
- ❌ No había forma de probar la interfaz sin el hardware
- ❌ Los datos se perdían al desconectar

### Con Ground Station:
- ✅ Monitoreo inalámbrico vía WiFi
- ✅ Visualización desde cualquier dispositivo con navegador
- ✅ Modo simulación para desarrollo sin hardware
- ✅ Registro de eventos con historial
- ✅ Alertas automáticas de problemas
- ✅ Gráficos en tiempo real

---

## ✨ Características Principales

### 1. 📊 Dashboard de Instrumentación
Visualización dinámica de variables críticas del vehículo:

| Variable | Descripción | Rango |
|----------|-------------|-------|
| **Voltaje de Batería** | Estado de carga de la batería LiPo | 9.0V - 12.6V |
| **Temperatura CPU** | Temperatura del procesador/microcontrolador | 20°C - 80°C |
| **Velocidad** | Velocidad lineal del vehículo | 0 - 3 m/s |
| **Corriente** | Consumo de corriente del sistema | 0 - 20 A |
| **RPM Motores** | Revoluciones por minuto de cada motor | 0 - 3000 RPM |
| **Distancia** | Distancia recorrida acumulada | Metros |

### 2. 🔬 Modo de Simulación de Hardware
Algoritmo integrado que genera datos sintéticos con **ruido gaussiano** para emular el comportamiento de sensores reales. Esto permite:

- Probar la interfaz completa sin conectar ningún hardware
- Validar la lógica de alertas y umbrales
- Demostrar el sistema a visitantes o jueces de competencia
- Desarrollar nuevas características sin depender del robot

### 3. 📝 Sistema de Registro de Eventos (Logs)
Consola de depuración con:

- **Niveles de severidad**: INFO, WARNING, ERROR, CRITICAL
- **Filtrado por tipo** de evento
- **Búsqueda** en tiempo real
- **Auto-scroll** inteligente
- **Timestamps** precisos
- **Fuente del evento** identificada

### 4. 📈 Gráficos en Tiempo Real
- Historial de voltaje con tendencia
- Historial de temperatura
- Actualización cada segundo
- Retención de últimos 60 puntos (1 minuto)

### 5. 🔌 Conexión WebSocket
- Protocolo de comunicación bidireccional
- Reconexión automática
- Compatible con ESP32, Arduino WiFi, Raspberry Pi
- Indicador visual de estado de conexión

---

## 📸 Capturas de Pantalla

### Vista Principal del Dashboard

![Dashboard Principal](docs/assets/screenshot-dashboard.png)

*Figura 1: Dashboard principal mostrando todos los indicadores en tiempo real durante el modo de simulación.*

---

### Consola de Registro de Eventos

![Consola de Logs](docs/assets/screenshot-logs.png)

*Figura 2: Sistema de logs con filtrado por nivel de severidad y búsqueda integrada.*

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                        GROUND STATION                            │
│                     (Aplicación Web React)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Header     │  │  Dashboard   │  │    Event Log         │  │
│  │  - Estado    │  │  - Gauges    │  │  - Filtros           │  │
│  │  - Controles │  │  - Charts    │  │  - Búsqueda          │  │
│  │  - WebSocket │  │  - Stats     │  │  - Auto-scroll       │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                       CAPA DE SERVICIOS                          │
│  ┌─────────────────────────┐  ┌─────────────────────────────┐  │
│  │   SimulationEngine.js   │  │    WebSocketService.js      │  │
│  │   - Datos sintéticos    │  │    - Conexión WS            │  │
│  │   - Ruido gaussiano     │  │    - Reconexión auto        │  │
│  │   - Eventos aleatorios  │  │    - Manejo de eventos      │  │
│  └─────────────────────────┘  └─────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ WebSocket / WiFi
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    HARDWARE (OPCIONAL)                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │    ESP32     │  │   Arduino    │  │    Raspberry Pi      │  │
│  │    WiFi      │  │   WiFi       │  │                      │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    SENSORES                               │  │
│  │  Batería | IMU | Encoders | Temperatura | GPS | etc.     │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Flujo de Datos

1. **Modo Simulación**: `SimulationEngine.js` genera datos cada segundo
2. **Modo Hardware**: El microcontrolador envía JSON por WebSocket
3. **Procesamiento**: `App.jsx` recibe y distribuye los datos
4. **Visualización**: Los componentes React renderizan los gráficos
5. **Logging**: Los eventos se almacenan y muestran en la consola

---

## 🛠️ Tecnologías Utilizadas

### Frontend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 18.2.0 | Framework de interfaz de usuario |
| **Chart.js** | 4.4.1 | Librería de gráficos |
| **react-chartjs-2** | 5.2.0 | Wrapper de Chart.js para React |
| **Recharts** | 2.10.3 | Gráficos adicionales |

### Comunicación
| Tecnología | Propósito |
|------------|-----------|
| **WebSocket API** | Comunicación bidireccional en tiempo real |
| **JSON** | Formato de intercambio de datos |

### Herramientas de Desarrollo
| Herramienta | Propósito |
|-------------|-----------|
| **Create React App** | Scaffolding del proyecto |
| **npm** | Gestión de paquetes |
| **Git** | Control de versiones |

---

## 📁 Estructura del Proyecto

```
ground-station/
│
├── 📄 package.json          # Configuración del proyecto y dependencias
├── 📄 package-lock.json     # Versiones exactas de dependencias
├── 📄 README.md             # Documentación básica
├── 📄 LICENSE               # Licencia MIT
├── 📄 .gitignore            # Archivos ignorados por Git
│
├── 📁 public/               # Archivos públicos estáticos
│   ├── index.html           # Página HTML principal
│   ├── manifest.json        # Configuración PWA
│   └── robots.txt           # Configuración para buscadores
│
├── 📁 src/                  # Código fuente principal
│   │
│   ├── 📄 index.js          # Punto de entrada de React
│   ├── 📄 App.jsx           # Componente principal de la aplicación
│   ├── 📄 App.css           # Estilos globales
│   │
│   ├── 📁 components/       # Componentes de React
│   │   │
│   │   ├── 📁 Dashboard/    # Componentes del panel principal
│   │   │   ├── Dashboard.jsx    # Panel contenedor
│   │   │   ├── Dashboard.css    # Estilos del panel
│   │   │   ├── GaugeChart.jsx   # Medidores circulares
│   │   │   ├── GaugeChart.css   # Estilos de medidores
│   │   │   ├── LineChart.jsx    # Gráficos de línea
│   │   │   └── index.js         # Exportaciones
│   │   │
│   │   ├── 📁 Header/       # Barra superior
│   │   │   ├── Header.jsx       # Controles y estado
│   │   │   ├── Header.css       # Estilos
│   │   │   └── index.js         # Exportaciones
│   │   │
│   │   └── 📁 Logs/         # Sistema de logs
│   │       ├── EventLog.jsx     # Consola de eventos
│   │       ├── EventLog.css     # Estilos
│   │       └── index.js         # Exportaciones
│   │
│   ├── 📁 services/         # Servicios y lógica de negocio
│   │   ├── SimulationEngine.js  # ⭐ Motor de simulación
│   │   └── WebSocketService.js  # Servicio de WebSocket
│   │
│   └── 📁 utils/            # Utilidades
│       └── helpers.js           # Funciones auxiliares
│
└── 📁 docs/                 # Documentación
    └── 📁 assets/           # Imágenes y recursos
        └── README.md            # Info sobre assets
```

---

## 🚀 Guía de Instalación Paso a Paso

### Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

#### 1. Node.js (versión 16 o superior)

**Verificar si está instalado:**
```powershell
node --version
```

**Si no está instalado:**
1. Ve a https://nodejs.org/
2. Descarga la versión LTS (recomendada)
3. Ejecuta el instalador
4. Sigue las instrucciones (siguiente, siguiente, instalar)
5. Reinicia la terminal

#### 2. Git

**Verificar si está instalado:**
```powershell
git --version
```

**Si no está instalado:**
1. Ve a https://git-scm.com/
2. Descarga el instalador para Windows
3. Ejecuta el instalador con opciones predeterminadas

#### 3. Editor de Código (Recomendado)
- **Visual Studio Code**: https://code.visualstudio.com/

---

### Instalación del Proyecto

#### Paso 1: Abrir Terminal

Abre **PowerShell** o **Command Prompt**:
- Presiona `Windows + R`
- Escribe `powershell`
- Presiona Enter

#### Paso 2: Navegar a la Carpeta Deseada

```powershell
cd C:\Users\TuUsuario\Desktop
```

O cualquier carpeta donde quieras guardar el proyecto.

#### Paso 3: Clonar el Repositorio

```powershell
git clone https://github.com/craiitmexicali/ground-station.git
```

**Salida esperada:**
```
Cloning into 'ground-station'...
remote: Enumerating objects: 39, done.
remote: Counting objects: 100% (39/39), done.
remote: Compressing objects: 100% (36/36), done.
Receiving objects: 100% (39/39), 178.60 KiB | 2.10 MiB/s, done.
```

#### Paso 4: Entrar a la Carpeta del Proyecto

```powershell
cd ground-station
```

#### Paso 5: Instalar Dependencias

```powershell
npm install
```

**Este comando:**
- Lee el archivo `package.json`
- Descarga todas las librerías necesarias
- Las guarda en la carpeta `node_modules`

**Tiempo estimado:** 2-5 minutos (dependiendo de tu conexión)

**Salida esperada:**
```
added 1338 packages, and audited 1339 packages in 2m
266 packages are looking for funding
```

> ⚠️ **Nota:** Los "warnings" de deprecación son normales y no afectan el funcionamiento.

#### Paso 6: Iniciar la Aplicación

```powershell
npm start
```

**Salida esperada:**
```
Compiled successfully!

You can now view ground-station-gui in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000

webpack compiled successfully
```

#### Paso 7: Abrir en el Navegador

La aplicación se abrirá automáticamente. Si no:
1. Abre tu navegador (Chrome, Firefox, Edge)
2. Ve a: **http://localhost:3000**

---

### Resumen de Comandos

```powershell
# Clonar repositorio
git clone https://github.com/craiitmexicali/ground-station.git

# Entrar a la carpeta
cd ground-station

# Instalar dependencias
npm install

# Iniciar aplicación
npm start
```

---

## 🎮 Cómo Usar la Aplicación

### Vista General de la Interfaz

```
┌─────────────────────────────────────────────────────────────────┐
│  🛰️ Ground Station          [Estado: Desconectado]  [🔬 Simular]│
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│  │ BATERÍA │ │  TEMP   │ │  VEL    │ │CORRIENTE│   GAUGES     │
│  │  12.4V  │ │  45°C   │ │ 1.2m/s  │ │  8.5A   │               │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘               │
│                                                                  │
│  ┌─────────────────────┐ ┌─────────────────────┐               │
│  │  VOLTAJE (HISTORIAL)│ │ TEMPERATURA (HIST.) │   GRÁFICOS   │
│  │  📈                 │ │  📈                 │               │
│  └─────────────────────┘ └─────────────────────┘               │
│                                                                  │
│  ┌─────────┐ ┌─────────┐ ┌─────────────────────┐               │
│  │ MOTOR L │ │ MOTOR R │ │    ESTADÍSTICAS     │   MOTORES    │
│  │ 1500RPM │ │ 1480RPM │ │ Dist: 45m  T: 00:45 │               │
│  └─────────┘ └─────────┘ └─────────────────────┘               │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  📝 REGISTRO DE EVENTOS                          [Filtros] [🗑️] │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 14:30:25 [INFO] Sistema operando normalmente               ││
│  │ 14:30:26 [WARNING] Voltaje bajo: 10.2V                     ││
│  │ 14:30:27 [INFO] Telemetría sincronizada                    ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### Modo Simulación (Sin Hardware)

1. **Haz clic en el botón "🔬 Iniciar Simulación"** en la esquina superior derecha
2. Los gauges comenzarán a mostrar datos simulados
3. Los gráficos se actualizarán cada segundo
4. Aparecerán eventos aleatorios en el log
5. Para detener, haz clic en "⏹️ Detener Simulación"

### Modo Hardware (Con ESP32/Arduino)

1. Asegúrate de que tu microcontrolador esté enviando datos por WebSocket
2. Ingresa la IP del dispositivo en el campo de texto (ej: `ws://192.168.1.100:81`)
3. Haz clic en "Conectar"
4. El indicador cambiará a verde "Conectado"
5. Los datos reales aparecerán en el dashboard

### Filtrar Eventos en el Log

- **📋 ALL**: Muestra todos los eventos
- **ℹ️ INFO**: Solo eventos informativos
- **⚠️ WARNING**: Solo advertencias
- **❌ ERROR**: Solo errores
- **🔴 CRITICAL**: Solo eventos críticos

### Buscar en el Log

1. Escribe en el campo de búsqueda
2. Los eventos se filtrarán en tiempo real
3. Busca por mensaje o por fuente del evento

---

## 🧩 Explicación de Componentes

### 1. App.jsx - Componente Principal

Este es el "cerebro" de la aplicación. Maneja:

- **Estado global** de telemetría
- **Historial** de datos para gráficos
- **Conexión** WebSocket
- **Modo simulación**
- **Sistema de logs**

```javascript
// Estados principales
const [telemetryData, setTelemetryData] = useState({...});  // Datos actuales
const [historyData, setHistoryData] = useState({...});      // Historial
const [logs, setLogs] = useState([...]);                    // Eventos
const [isSimulating, setIsSimulating] = useState(false);    // Modo simulación
```

### 2. Dashboard.jsx - Panel de Instrumentos

Muestra todos los indicadores visuales:

- **4 GaugeCharts**: Batería, Temperatura, Velocidad, Corriente
- **2 LineCharts**: Historial de voltaje y temperatura
- **2 MotorCards**: RPM de cada motor
- **1 StatsCard**: Estadísticas generales

### 3. GaugeChart.jsx - Medidores Circulares

Componente SVG que dibuja un medidor semicircular:

- **Arco de fondo**: Muestra el rango completo
- **Arco de valor**: Coloreado según el valor actual
- **Indicador**: Círculo que marca el punto exacto
- **Colores dinámicos**: Verde → Amarillo → Rojo según umbrales

```javascript
// Umbrales de color para batería
colorThresholds={{ warning: 10.5, danger: 11.5, inverted: true }}
// inverted: true significa que valores ALTOS son buenos (batería)
// inverted: false significa que valores BAJOS son buenos (temperatura)
```

### 4. LineChart.jsx - Gráficos de Línea

Utiliza Chart.js para mostrar tendencias:

- **Eje X**: Tiempo (timestamps)
- **Eje Y**: Valor de la variable
- **Área sombreada**: Bajo la línea
- **Tooltips**: Información al pasar el mouse

### 5. EventLog.jsx - Consola de Eventos

Sistema de logging completo:

- **Filtros por nivel**: ALL, INFO, WARNING, ERROR, CRITICAL
- **Búsqueda**: Filtra por texto
- **Auto-scroll**: Sigue automáticamente nuevos eventos
- **Contadores**: Muestra cantidad por nivel
- **Limpieza**: Botón para borrar historial

### 6. Header.jsx - Barra Superior

Controles principales:

- **Logo y título** del proyecto
- **Indicador de estado** de conexión
- **Input de URL** WebSocket
- **Botones** de conectar/desconectar
- **Botón de simulación**

---

## 🔬 Motor de Simulación

### Archivo: `src/services/SimulationEngine.js`

Este es el "truco de ingeniero" que permite probar todo sin hardware.

### Cómo Funciona

```javascript
// Genera ruido gaussiano (distribución normal)
const gaussianNoise = (mean = 0, stdDev = 1) => {
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return z0 * stdDev + mean;
};
```

### Simuladores Disponibles

#### 1. BatterySimulator
```javascript
// Simula descarga de batería LiPo 3S
// - Voltaje máximo: 12.6V (100%)
// - Voltaje mínimo: 9.0V (0%)
// - Ciclo de descarga: 5 minutos
// - Incluye ruido gaussiano de ±0.05V
```

#### 2. TemperatureSimulator
```javascript
// Simula temperatura del CPU
// - Temperatura base: 35°C
// - Temperatura máxima: 65°C
// - Variación senoidal para simular carga
// - Ruido gaussiano de ±1.5°C
```

#### 3. MotorSimulator
```javascript
// Simula RPM de motores
// - RPM máximo: 3000
// - Aceleración suavizada
// - Variación automática
// - Ruido gaussiano de ±50 RPM
```

### Funciones Exportadas

```javascript
// Iniciar simulación con callback
iniciarSimulacion((datos) => {
  console.log(datos);
  // { voltaje, temperatura, velocidad, rpmLeft, rpmRight, ... }
});

// Detener simulación
detenerSimulacion();

// Verificar estado
isSimulacionActiva(); // true/false

// Controles manuales
recargarBateria();     // Reinicia voltaje a 12.6V
ajustarCarga(0.8);     // Ajusta carga del sistema (0-1)
ajustarRPM(2000);      // Cambia RPM objetivo
```

### Eventos Aleatorios

El motor genera eventos de log automáticamente:

```javascript
// 40% de probabilidad: Sistema operando normalmente
// 30% de probabilidad: Telemetría sincronizada
// 20% de probabilidad: GPS fix adquirido
// Si voltaje < 10.5V: 80% probabilidad de WARNING
// Si temp > 55°C: 70% probabilidad de WARNING
// 2% probabilidad: ERROR de comunicación
// 1% probabilidad: CRITICAL (pérdida de motor)
```

---

## 🔌 Conexión con Hardware Real

### Formato de Datos Esperado

El microcontrolador debe enviar JSON por WebSocket:

```json
{
  "voltaje": 12.45,
  "temperatura": 45.2,
  "velocidad": 1.5,
  "rpmLeft": 1200,
  "rpmRight": 1180,
  "corriente": 8.5,
  "distancia": 125.3
}
```

### Código de Ejemplo para ESP32

```cpp
#include <WiFi.h>
#include <WebSocketsServer.h>
#include <ArduinoJson.h>

const char* ssid = "NOMBRE_WIFI";
const char* password = "CONTRASEÑA";

WebSocketsServer webSocket = WebSocketsServer(81);

void setup() {
  Serial.begin(115200);
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
  Serial.println(WiFi.localIP());
  
  webSocket.begin();
  webSocket.onEvent(webSocketEvent);
}

void loop() {
  webSocket.loop();
  
  // Enviar datos cada segundo
  static unsigned long lastSend = 0;
  if (millis() - lastSend > 1000) {
    lastSend = millis();
    sendTelemetry();
  }
}

void sendTelemetry() {
  StaticJsonDocument<256> doc;
  
  doc["voltaje"] = analogRead(34) * (3.3 / 4095) * 4; // Divisor de voltaje
  doc["temperatura"] = readTemperature();
  doc["velocidad"] = calculateSpeed();
  doc["rpmLeft"] = getLeftMotorRPM();
  doc["rpmRight"] = getRightMotorRPM();
  doc["corriente"] = readCurrent();
  
  String json;
  serializeJson(doc, json);
  webSocket.broadcastTXT(json);
}
```

### Código de Ejemplo para Arduino con ESP8266

```cpp
#include <ESP8266WiFi.h>
#include <WebSocketsServer.h>

// Similar al ESP32, ajustar pines según el board
```

### Configuración de Red

1. El ESP32/Arduino crea un servidor WebSocket en el puerto 81
2. Ground Station se conecta como cliente
3. Los datos fluyen del microcontrolador al navegador

```
[ESP32:81] ──WebSocket──> [Navegador:3000]
   │                           │
   │      JSON cada 1s         │
   └───────────────────────────┘
```

---

## ⚙️ Personalización y Configuración

### Cambiar Umbrales de Alerta

En `Dashboard.jsx`, modifica los `colorThresholds`:

```javascript
// Batería: warning a 10.5V, danger a 11.5V
colorThresholds={{ warning: 10.5, danger: 11.5, inverted: true }}

// Temperatura: warning a 55°C, danger a 70°C  
colorThresholds={{ warning: 55, danger: 70, inverted: false }}
```

### Cambiar Intervalo de Actualización

En `App.jsx`, la simulación usa 1000ms (1 segundo):

```javascript
iniciarSimulacion(processTelemetryData, 1000); // Cambiar a 500 para 2 Hz
```

### Cambiar Cantidad de Puntos en Gráficos

```javascript
const MAX_HISTORY_POINTS = 60; // Cambiar para más/menos historial
```

### Modificar Colores del Tema

En `App.css`, las variables CSS:

```css
:root {
  --bg-primary: #0f172a;      /* Fondo principal */
  --accent-blue: #3b82f6;     /* Color de acento */
  --accent-green: #22c55e;    /* Color de éxito */
  --accent-red: #ef4444;      /* Color de error */
}
```

---

## 🔧 Solución de Problemas

### Error: "npm no se reconoce como comando"

**Causa:** Node.js no está instalado o no está en el PATH.

**Solución:**
1. Instala Node.js desde https://nodejs.org/
2. Reinicia la terminal
3. Verifica con `node --version`

### Error: "ENOENT: no such file or directory, open 'package.json'"

**Causa:** No estás en la carpeta correcta del proyecto.

**Solución:**
```powershell
cd ground-station
npm install
```

### La página muestra pantalla en blanco

**Causa:** Error en la compilación de React.

**Solución:**
1. Abre las DevTools del navegador (F12)
2. Ve a la pestaña "Console"
3. Revisa el error específico
4. Generalmente es un error de sintaxis en el código

### Los gráficos no se actualizan

**Causa:** El modo simulación no está activo o hay error en WebSocket.

**Solución:**
1. Haz clic en "Iniciar Simulación"
2. Verifica que el estado muestre "Simulación Activa"
3. Si usas hardware, verifica la IP y puerto

### Error de conexión WebSocket

**Causa:** El microcontrolador no está enviando datos o hay problema de red.

**Solución:**
1. Verifica que ESP32/Arduino esté encendido
2. Confirma que están en la misma red WiFi
3. Prueba hacer ping a la IP del dispositivo
4. Verifica que el puerto 81 esté correcto

### El proyecto tarda mucho en iniciar

**Causa:** La primera compilación de React es lenta.

**Solución:**
- Es normal, espera 30-60 segundos
- Las siguientes veces será más rápido (caché)

---

## 🤝 Contribuir al Proyecto

### Cómo Reportar Bugs

1. Ve a https://github.com/craiitmexicali/ground-station/issues
2. Haz clic en "New Issue"
3. Describe el problema con detalle:
   - Qué esperabas que pasara
   - Qué pasó en realidad
   - Pasos para reproducir
   - Capturas de pantalla si es posible

### Cómo Proponer Mejoras

1. Abre un Issue describiendo tu idea
2. Espera feedback del equipo
3. Si se aprueba, haz fork del repo
4. Crea una rama: `git checkout -b feature/mi-mejora`
5. Haz tus cambios
6. Commit: `git commit -m "Add: descripción"`
7. Push: `git push origin feature/mi-mejora`
8. Abre un Pull Request

### Ideas para Futuras Versiones

- [ ] Mapa GPS en tiempo real
- [ ] Grabación y reproducción de sesiones
- [ ] Alertas por correo/Telegram
- [ ] Modo oscuro/claro switcheable
- [ ] Soporte para múltiples robots
- [ ] Panel de configuración del robot
- [ ] Exportar datos a CSV/Excel

---

## 👨‍💻 Créditos y Agradecimientos

### Creador del Proyecto

<p align="center">
  <strong>Diego Eduardo Martínez Cruz</strong><br>
  Líder del Club de Robótica CRAI<br>
  Instituto Tecnológico de Mexicali<br>
  <br>
  <em>"La tecnología es mejor cuando une a las personas"</em>
</p>

### Agradecimientos

- **Club CRAI** - Por el apoyo y las ideas
- **Instituto Tecnológico de Mexicali** - Por las instalaciones y recursos
- **Comunidad Open Source** - Por las librerías utilizadas
- **Todos los miembros del club** - Por probar y dar feedback

### Librerías Utilizadas

- [React](https://reactjs.org/) - Facebook
- [Chart.js](https://www.chartjs.org/) - Chart.js Contributors
- [Recharts](https://recharts.org/) - Recharts Group

---

## 📞 Contacto

- **GitHub**: https://github.com/craiitmexicali
- **Repositorio**: https://github.com/craiitmexicali/ground-station
- **Club CRAI**: Instituto Tecnológico de Mexicali

---

<p align="center">
  <br>
  <strong>🛰️ Ground Station v1.0.0</strong><br>
  Desarrollado con ❤️ por CRAI ITM<br>
  <br>
  <em>Enero 2026</em>
</p>

---

© 2026 CRAI - Club de Robótica y Automatización Industrial | Instituto Tecnológico de Mexicali

Licencia MIT - Libre para usar, modificar y distribuir.
