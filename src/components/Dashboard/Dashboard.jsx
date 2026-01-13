import React from 'react';
import GaugeChart from './GaugeChart';
import LineChart from './LineChart';
import './Dashboard.css';

const Dashboard = ({ 
  telemetryData, 
  historyData,
  isSimulating,
  connectionStatus 
}) => {
  // Extraer datos actuales
  const {
    voltaje = 0,
    temperatura = 0,
    velocidad = 0,
    rpmLeft = 0,
    rpmRight = 0,
    corriente = 0,
    distancia = 0
  } = telemetryData || {};

  return (
    <div className="dashboard">
      {/* Fila de Gauges principales */}
      <div className="dashboard-row gauges-row">
        <div className="gauge-card">
          <GaugeChart
            value={parseFloat(voltaje)}
            minValue={9.0}
            maxValue={12.6}
            title="Batería"
            unit="V"
            type="battery"
            colorThresholds={{ warning: 10.5, danger: 11.5, inverted: true }}
          />
        </div>
        
        <div className="gauge-card">
          <GaugeChart
            value={parseFloat(temperatura)}
            minValue={20}
            maxValue={80}
            title="Temperatura CPU"
            unit="°C"
            type="temperature"
            colorThresholds={{ warning: 55, danger: 70, inverted: false }}
          />
        </div>
        
        <div className="gauge-card">
          <GaugeChart
            value={parseFloat(velocidad)}
            minValue={0}
            maxValue={3}
            title="Velocidad"
            unit="m/s"
            type="default"
          />
        </div>

        <div className="gauge-card">
          <GaugeChart
            value={parseFloat(corriente)}
            minValue={0}
            maxValue={20}
            title="Corriente"
            unit="A"
            type="default"
            colorThresholds={{ warning: 12, danger: 16, inverted: false }}
          />
        </div>
      </div>

      {/* Fila de gráficos de línea */}
      <div className="dashboard-row charts-row">
        <div className="chart-card">
          <LineChart
            data={historyData.voltaje || []}
            title="Voltaje de Batería"
            yAxisLabel="Voltaje (V)"
            color="#22c55e"
            fillColor="rgba(34, 197, 94, 0.1)"
            minY={9}
            maxY={13}
          />
        </div>
        
        <div className="chart-card">
          <LineChart
            data={historyData.temperatura || []}
            title="Temperatura"
            yAxisLabel="Temp (°C)"
            color="#f97316"
            fillColor="rgba(249, 115, 22, 0.1)"
            minY={20}
            maxY={80}
          />
        </div>
      </div>

      {/* Fila de datos de motores */}
      <div className="dashboard-row motors-row">
        <div className="motor-card">
          <h3>Motor Izquierdo</h3>
          <div className="motor-value">
            <span className="rpm-value">{rpmLeft}</span>
            <span className="rpm-unit">RPM</span>
          </div>
          <div className="motor-bar">
            <div 
              className="motor-bar-fill left"
              style={{ width: `${(rpmLeft / 3000) * 100}%` }}
            />
          </div>
        </div>
        
        <div className="motor-card">
          <h3>Motor Derecho</h3>
          <div className="motor-value">
            <span className="rpm-value">{rpmRight}</span>
            <span className="rpm-unit">RPM</span>
          </div>
          <div className="motor-bar">
            <div 
              className="motor-bar-fill right"
              style={{ width: `${(rpmRight / 3000) * 100}%` }}
            />
          </div>
        </div>

        <div className="stats-card">
          <h3>Estadísticas</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Distancia</span>
              <span className="stat-value">{parseFloat(distancia).toFixed(1)} m</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Tiempo activo</span>
              <span className="stat-value">{formatUptime(historyData.startTime)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Estado</span>
              <span className={`stat-value status-${connectionStatus}`}>
                {isSimulating ? '🔬 Simulación' : connectionStatus}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Paquetes</span>
              <span className="stat-value">{historyData.packetCount || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Función auxiliar para formatear tiempo activo
const formatUptime = (startTime) => {
  if (!startTime) return '00:00:00';
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const hours = Math.floor(elapsed / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const seconds = elapsed % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export default Dashboard;
