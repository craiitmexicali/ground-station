import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header/Header';
import Dashboard from './components/Dashboard/Dashboard';
import EventLog from './components/Logs/EventLog';
import { iniciarSimulacion, detenerSimulacion } from './services/SimulationEngine';
import webSocketService from './services/WebSocketService';
import { limitArraySize, generateId } from './utils/helpers';
import './App.css';

const MAX_HISTORY_POINTS = 60; // 60 puntos = 1 minuto de datos
const MAX_LOGS = 200;

function App() {
  // Estado de conexión
  const [isSimulating, setIsSimulating] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [wsUrl, setWsUrl] = useState('ws://192.168.1.100:81');

  // Estado de telemetría
  const [telemetryData, setTelemetryData] = useState({
    voltaje: 0,
    temperatura: 0,
    velocidad: 0,
    rpmLeft: 0,
    rpmRight: 0,
    corriente: 0,
    distancia: 0
  });

  // Historial para gráficos
  const [historyData, setHistoryData] = useState({
    voltaje: [],
    temperatura: [],
    velocidad: [],
    startTime: null,
    packetCount: 0
  });

  // Logs de eventos
  const [logs, setLogs] = useState([
    {
      id: generateId(),
      level: 'INFO',
      message: 'Sistema Ground Station inicializado',
      timestamp: new Date().toLocaleTimeString(),
      source: 'System'
    }
  ]);

  // Función para agregar logs
  const addLog = useCallback((level, message, source = 'System') => {
    setLogs(prevLogs => limitArraySize([
      ...prevLogs,
      {
        id: generateId(),
        level,
        message,
        timestamp: new Date().toLocaleTimeString(),
        source
      }
    ], MAX_LOGS));
  }, []);

  // Función para procesar datos de telemetría
  const processTelemetryData = useCallback((data) => {
    setTelemetryData(data);

    // Actualizar historial
    setHistoryData(prev => {
      const newTimestamp = data.timestamp || new Date().toLocaleTimeString();
      
      return {
        voltaje: limitArraySize([
          ...prev.voltaje,
          { label: newTimestamp, value: parseFloat(data.voltaje) }
        ], MAX_HISTORY_POINTS),
        temperatura: limitArraySize([
          ...prev.temperatura,
          { label: newTimestamp, value: parseFloat(data.temperatura) }
        ], MAX_HISTORY_POINTS),
        velocidad: limitArraySize([
          ...prev.velocidad,
          { label: newTimestamp, value: parseFloat(data.velocidad) }
        ], MAX_HISTORY_POINTS),
        startTime: prev.startTime || Date.now(),
        packetCount: prev.packetCount + 1
      };
    });

    // Procesar evento de log si viene con los datos
    if (data.logEvent) {
      addLog(data.logEvent.level, data.logEvent.message, data.logEvent.source);
    }
  }, [addLog]);

  // Iniciar/Detener simulación
  const handleToggleSimulation = useCallback(() => {
    if (isSimulating) {
      detenerSimulacion();
      setIsSimulating(false);
      setConnectionStatus('disconnected');
      addLog('INFO', 'Simulación detenida', 'SimulationEngine');
    } else {
      // Desconectar WebSocket si está conectado
      if (webSocketService.isConnected()) {
        webSocketService.disconnect();
      }
      
      // Reiniciar historial
      setHistoryData({
        voltaje: [],
        temperatura: [],
        velocidad: [],
        startTime: Date.now(),
        packetCount: 0
      });

      iniciarSimulacion(processTelemetryData);
      setIsSimulating(true);
      setConnectionStatus('simulating');
      addLog('SUCCESS', 'Simulación iniciada - Generando datos sintéticos', 'SimulationEngine');
    }
  }, [isSimulating, processTelemetryData, addLog]);

  // Conectar WebSocket
  const handleConnect = useCallback(async () => {
    if (isSimulating) {
      addLog('WARNING', 'Detén la simulación antes de conectar al hardware', 'System');
      return;
    }

    setConnectionStatus('connecting');
    addLog('INFO', `Conectando a ${wsUrl}...`, 'WebSocket');

    try {
      await webSocketService.connect(wsUrl);
    } catch (error) {
      addLog('ERROR', `Error de conexión: ${error.message}`, 'WebSocket');
      setConnectionStatus('disconnected');
    }
  }, [wsUrl, isSimulating, addLog]);

  // Desconectar WebSocket
  const handleDisconnect = useCallback(() => {
    webSocketService.disconnect();
    setConnectionStatus('disconnected');
    addLog('INFO', 'Desconectado del servidor', 'WebSocket');
  }, [addLog]);

  // Limpiar logs
  const handleClearLogs = useCallback(() => {
    setLogs([{
      id: generateId(),
      level: 'INFO',
      message: 'Logs limpiados',
      timestamp: new Date().toLocaleTimeString(),
      source: 'System'
    }]);
  }, []);

  // Configurar listeners de WebSocket
  useEffect(() => {
    webSocketService.on('connected', () => {
      setConnectionStatus('connected');
      addLog('SUCCESS', 'Conexión WebSocket establecida', 'WebSocket');
      
      // Reiniciar historial al conectar
      setHistoryData({
        voltaje: [],
        temperatura: [],
        velocidad: [],
        startTime: Date.now(),
        packetCount: 0
      });
    });

    webSocketService.on('disconnected', ({ code, reason }) => {
      setConnectionStatus('disconnected');
      addLog('WARNING', `Conexión cerrada (${code}): ${reason || 'Sin razón'}`, 'WebSocket');
    });

    webSocketService.on('reconnecting', ({ attempt, maxAttempts }) => {
      setConnectionStatus('connecting');
      addLog('INFO', `Reconectando... intento ${attempt}/${maxAttempts}`, 'WebSocket');
    });

    webSocketService.on('data', (data) => {
      processTelemetryData(data);
    });

    webSocketService.on('error', (error) => {
      addLog('ERROR', `Error WebSocket: ${error.message || 'Error desconocido'}`, 'WebSocket');
    });

    // Cleanup
    return () => {
      detenerSimulacion();
      webSocketService.disconnect();
    };
  }, [addLog, processTelemetryData]);

  return (
    <div className="app">
      <Header
        isSimulating={isSimulating}
        onToggleSimulation={handleToggleSimulation}
        connectionStatus={connectionStatus}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        wsUrl={wsUrl}
        onWsUrlChange={setWsUrl}
      />
      
      <main className="main-content">
        <Dashboard
          telemetryData={telemetryData}
          historyData={historyData}
          isSimulating={isSimulating}
          connectionStatus={connectionStatus}
        />
        
        <div className="logs-section">
          <EventLog
            logs={logs}
            onClear={handleClearLogs}
            maxLogs={MAX_LOGS}
          />
        </div>
      </main>

      <footer className="footer">
        <span>🛰️ Ground Station v1.0.0</span>
        <span>|</span>
        <span>CRAI Team © {new Date().getFullYear()}</span>
        <span>|</span>
        <span className="tech-stack">React + Chart.js + WebSockets</span>
      </footer>
    </div>
  );
}

export default App;
