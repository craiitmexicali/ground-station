// SimulationEngine.js - Generador de Datos Sintéticos
// Este código emula lo que enviaría el ESP32 por WiFi
// ============================================================
// FEATURE: Modo de Simulación de Hardware
// Permite probar la interfaz completa sin necesidad de
// conectar hardware real (Arduino, ESP32, etc.)
// ============================================================

/**
 * Genera ruido gaussiano usando el método Box-Muller
 * @param {number} mean - Media del ruido
 * @param {number} stdDev - Desviación estándar
 * @returns {number} - Valor con ruido gaussiano
 */
const gaussianNoise = (mean = 0, stdDev = 1) => {
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return z0 * stdDev + mean;
};

/**
 * Clase para simular el estado de la batería con descarga realista
 */
class BatterySimulator {
  constructor() {
    this.maxVoltage = 12.6; // Batería LiPo 3S completamente cargada
    this.minVoltage = 9.0;  // Voltaje mínimo seguro
    this.startTime = Date.now();
    this.dischargeCycleMs = 300000; // 5 minutos para un ciclo completo
  }

  getVoltage() {
    const elapsed = (Date.now() - this.startTime) % this.dischargeCycleMs;
    const progress = elapsed / this.dischargeCycleMs;
    const baseVoltage = this.maxVoltage - (this.maxVoltage - this.minVoltage) * progress;
    // Añadir ruido gaussiano pequeño para simular fluctuaciones
    return Math.max(this.minVoltage, baseVoltage + gaussianNoise(0, 0.05));
  }

  // Reiniciar batería (simular carga)
  reset() {
    this.startTime = Date.now();
  }
}

/**
 * Clase para simular temperatura con comportamiento realista
 */
class TemperatureSimulator {
  constructor() {
    this.baseTemp = 35; // Temperatura ambiente del componente
    this.maxTemp = 65;  // Temperatura máxima bajo carga
    this.currentLoad = 0.5; // Carga actual (0-1)
  }

  getTemperature() {
    // Onda senoidal para simular variación de carga
    const timeComponent = Math.sin(Date.now() / 5000) * 0.3;
    const loadComponent = this.currentLoad + timeComponent;
    
    // Temperatura base + efecto de carga + ruido
    const temp = this.baseTemp + (this.maxTemp - this.baseTemp) * loadComponent;
    return temp + gaussianNoise(0, 1.5);
  }

  setLoad(load) {
    this.currentLoad = Math.max(0, Math.min(1, load));
  }
}

/**
 * Clase para simular motores con RPM y velocidad
 */
class MotorSimulator {
  constructor() {
    this.targetRPM = 1500;
    this.currentRPM = 0;
    this.maxRPM = 3000;
    this.acceleration = 0.1; // Factor de aceleración
  }

  update() {
    // Suavizado hacia el RPM objetivo
    this.currentRPM += (this.targetRPM - this.currentRPM) * this.acceleration;
    // Añadir ruido gaussiano
    return Math.max(0, this.currentRPM + gaussianNoise(0, 50));
  }

  setTargetRPM(rpm) {
    this.targetRPM = Math.max(0, Math.min(this.maxRPM, rpm));
  }

  // Simular variación automática de RPM
  autoVary() {
    const variation = Math.sin(Date.now() / 3000) * 500;
    this.targetRPM = 1500 + variation;
  }
}

// Instancias globales de los simuladores
let batterySimulator = new BatterySimulator();
let temperatureSimulator = new TemperatureSimulator();
let leftMotor = new MotorSimulator();
let rightMotor = new MotorSimulator();

// Intervalo de simulación activo
let simulationInterval = null;

/**
 * Inicia la simulación de datos del vehículo autónomo
 * @param {Function} callback - Función que recibe los datos simulados
 * @param {number} intervalMs - Intervalo de actualización en ms (default: 1000)
 * @returns {number} - ID del intervalo para poder detenerlo
 */
export const iniciarSimulacion = (callback, intervalMs = 1000) => {
  // Detener simulación anterior si existe
  if (simulationInterval) {
    clearInterval(simulationInterval);
  }

  // Reiniciar simuladores
  batterySimulator = new BatterySimulator();
  temperatureSimulator = new TemperatureSimulator();
  leftMotor = new MotorSimulator();
  rightMotor = new MotorSimulator();

  simulationInterval = setInterval(() => {
    // Variar automáticamente los motores para hacer la simulación más interesante
    leftMotor.autoVary();
    rightMotor.autoVary();
    rightMotor.targetRPM = leftMotor.targetRPM + gaussianNoise(0, 30); // Pequeña diferencia

    // 1. Simular Batería (descarga lenta con ruido)
    const voltaje = batterySimulator.getVoltage();
    
    // 2. Simular Temperatura (con variación de carga)
    const temperatura = temperatureSimulator.getTemperature();
    
    // 3. Simular RPM de motores
    const rpmLeft = leftMotor.update();
    const rpmRight = rightMotor.update();
    
    // 4. Calcular velocidad basada en RPM promedio
    const avgRPM = (rpmLeft + rpmRight) / 2;
    const velocidad = (avgRPM / 1500) * 1.5; // Escala: 1500 RPM = 1.5 m/s

    // 5. Simular datos adicionales
    const corriente = (avgRPM / 3000) * 15 + gaussianNoise(0, 0.5); // Corriente en Amperios
    const distancia = (Date.now() - batterySimulator.startTime) / 1000 * velocidad; // Distancia recorrida

    // Generar evento de log aleatorio ocasionalmente
    let logEvent = null;
    if (Math.random() < 0.05) { // 5% de probabilidad cada tick
      logEvent = generarEventoAleatorio(voltaje, temperatura);
    }

    // Enviar datos al Dashboard
    callback({
      // Datos principales
      voltaje: voltaje.toFixed(2),
      temperatura: temperatura.toFixed(1),
      velocidad: velocidad.toFixed(2),
      
      // Datos de motores
      rpmLeft: Math.round(rpmLeft),
      rpmRight: Math.round(rpmRight),
      
      // Datos adicionales
      corriente: corriente.toFixed(2),
      distancia: distancia.toFixed(1),
      
      // Metadatos
      timestamp: new Date().toLocaleTimeString(),
      timestampMs: Date.now(),
      
      // Evento de log (si hay)
      logEvent: logEvent
    });
  }, intervalMs);

  return simulationInterval;
};

/**
 * Detiene la simulación activa
 */
export const detenerSimulacion = () => {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }
};

/**
 * Verifica si la simulación está activa
 * @returns {boolean}
 */
export const isSimulacionActiva = () => {
  return simulationInterval !== null;
};

/**
 * Genera un evento de log aleatorio basado en los datos actuales
 */
const generarEventoAleatorio = (voltaje, temperatura) => {
  const eventos = [
    // Eventos INFO
    { level: 'INFO', message: 'Sistema operando normalmente', probability: 0.4 },
    { level: 'INFO', message: 'Telemetría sincronizada', probability: 0.3 },
    { level: 'INFO', message: 'GPS fix adquirido: 8 satélites', probability: 0.2 },
    
    // Eventos WARNING basados en datos
    { 
      level: 'WARNING', 
      message: `Voltaje de batería bajo: ${voltaje}V`, 
      probability: voltaje < 10.5 ? 0.8 : 0.1 
    },
    { 
      level: 'WARNING', 
      message: `Temperatura elevada: ${temperatura}°C`, 
      probability: temperatura > 55 ? 0.7 : 0.05 
    },
    { level: 'WARNING', message: 'Señal WiFi débil: -75 dBm', probability: 0.1 },
    
    // Eventos ERROR (raros)
    { level: 'ERROR', message: 'Timeout en comunicación I2C', probability: 0.02 },
    { level: 'ERROR', message: 'Sensor IMU no responde', probability: 0.02 },
    
    // Eventos CRITICAL (muy raros)
    { level: 'CRITICAL', message: 'Pérdida de señal con motor derecho', probability: 0.01 },
  ];

  // Seleccionar evento basado en probabilidad
  for (const evento of eventos) {
    if (Math.random() < evento.probability) {
      return {
        level: evento.level,
        message: evento.message,
        timestamp: new Date().toLocaleTimeString(),
        source: 'SimulationEngine'
      };
    }
  }
  
  return null;
};

/**
 * Reinicia la batería simulada (simula una recarga)
 */
export const recargarBateria = () => {
  batterySimulator.reset();
};

/**
 * Ajusta la carga del sistema (afecta temperatura)
 * @param {number} load - Valor entre 0 y 1
 */
export const ajustarCarga = (load) => {
  temperatureSimulator.setLoad(load);
};

/**
 * Ajusta el RPM objetivo de los motores
 * @param {number} rpm - RPM objetivo
 */
export const ajustarRPM = (rpm) => {
  leftMotor.setTargetRPM(rpm);
  rightMotor.setTargetRPM(rpm);
};

// Exportar también los simuladores individuales para uso avanzado
export const simuladores = {
  battery: batterySimulator,
  temperature: temperatureSimulator,
  leftMotor,
  rightMotor
};

export default {
  iniciarSimulacion,
  detenerSimulacion,
  isSimulacionActiva,
  recargarBateria,
  ajustarCarga,
  ajustarRPM,
  simuladores
};
