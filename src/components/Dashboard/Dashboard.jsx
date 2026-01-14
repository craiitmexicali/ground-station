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

  const getStatusClass = () => {
    if (isSimulating) return 'simulating';
    return connectionStatus;
  };

  return (
    <div className="dashboard">
      {/* Header de sección con indicadores */}
      <div className="section-header">
        <div className="section-title">
          <span className="title-icon">📊</span>
          <h2>Telemetría en Tiempo Real</h2>
        </div>
        <div className={`status-pill ${getStatusClass()}`}>
          <span className="status-dot"></span>
          {isSimulating ? 'Modo Simulación' : connectionStatus === 'connected' ? 'En Línea' : 'Desconectado'}
        </div>
      </div>

      {/* Fila de Gauges principales */}
      <div className="dashboard-row gauges-row">
        <div className="gauge-card">
          <div className="card-glow battery"></div>
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
          <div className="card-glow temperature"></div>
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
          <div className="card-glow speed"></div>
          <GaugeChart
            value={parseFloat(velocidad)}
            minValue={0}
            maxValue={3}
            title="Velocidad"
            unit="m/s"
            type="speed"
          />
        </div>

        <div className="gauge-card">
          <div className="card-glow current"></div>
          <GaugeChart
            value={parseFloat(corriente)}
            minValue={0}
            maxValue={20}
            title="Corriente"
            unit="A"
            type="current"
            colorThresholds={{ warning: 12, danger: 16, inverted: false }}
          />
        </div>
      </div>

      {/* Fila de gráficos de línea */}
      <div className="dashboard-row charts-row">
        <div className="chart-card">
          <div className="chart-header">
            <span className="chart-icon">⚡</span>
            <span>Voltaje de Batería</span>
          </div>
          <div className="chart-content">
            <LineChart
              data={historyData.voltaje || []}
              yAxisLabel="Voltaje (V)"
              color="#10b981"
              fillColor="rgba(16, 185, 129, 0.15)"
              minY={9}
              maxY={13}
            />
          </div>
        </div>
        
        <div className="chart-card">
          <div className="chart-header">
            <span className="chart-icon">🌡️</span>
            <span>Temperatura</span>
          </div>
          <div className="chart-content">
            <LineChart
              data={historyData.temperatura || []}
              yAxisLabel="Temp (°C)"
              color="#f97316"
              fillColor="rgba(249, 115, 22, 0.15)"
              minY={20}
              maxY={80}
            />
          </div>
        </div>
      </div>

      {/* Fila de datos de motores */}
      <div className="dashboard-row motors-row">
        <div className="motor-card">
          <div className="motor-header">
            <span className="motor-icon">⚙️</span>
            <h3>Motor Izquierdo</h3>
          </div>
          <div className="motor-value">
            <span className="rpm-value">{rpmLeft}</span>
            <span className="rpm-unit">RPM</span>
          </div>
          <div className="motor-bar">
            <div 
              className="motor-bar-fill left"
              style={{ width: `${Math.min((rpmLeft / 3000) * 100, 100)}%` }}
            />
          </div>
          <div className="motor-percentage">{((rpmLeft / 3000) * 100).toFixed(0)}%</div>
        </div>
        
        <div className="motor-card">
          <div className="motor-header">
            <span className="motor-icon">⚙️</span>
            <h3>Motor Derecho</h3>
          </div>
          <div className="motor-value">
            <span className="rpm-value">{rpmRight}</span>
            <span className="rpm-unit">RPM</span>
          </div>
          <div className="motor-bar">
            <div 
              className="motor-bar-fill right"
              style={{ width: `${Math.min((rpmRight / 3000) * 100, 100)}%` }}
            />
          </div>
          <div className="motor-percentage">{((rpmRight / 3000) * 100).toFixed(0)}%</div>
        </div>

        <div className="stats-card">
          <div className="stats-header">
            <span className="stats-icon">📈</span>
            <h3>Estadísticas</h3>
          </div>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">📍</div>
              <div className="stat-content">
                <span className="stat-label">Distancia</span>
                <span className="stat-value">{parseFloat(distancia).toFixed(2)} m</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">⏱️</div>
              <div className="stat-content">
                <span className="stat-label">Tiempo activo</span>
                <span className="stat-value">{formatUptime(historyData.startTime)}</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🔗</div>
              <div className="stat-content">
                <span className="stat-label">Estado</span>
                <span className={`stat-value status-${connectionStatus}`}>
                  {isSimulating ? '🔬 Simulación' : connectionStatus === 'connected' ? '✓ Conectado' : '✗ Offline'}
                </span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">📦</div>
              <div className="stat-content">
                <span className="stat-label">Paquetes</span>
                <span className="stat-value">{historyData.packetCount || 0}</span>
              </div>
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
