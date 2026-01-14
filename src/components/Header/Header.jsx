import React from 'react';
import './Header.css';

const Header = ({ 
  isSimulating, 
  onToggleSimulation, 
  connectionStatus,
  onConnect,
  onDisconnect,
  wsUrl,
  onWsUrlChange
}) => {
  const getStatusInfo = () => {
    if (isSimulating) return { text: 'Simulación Activa', class: 'simulating' };
    switch(connectionStatus) {
      case 'connected': return { text: 'Sistema En Línea', class: 'connected' };
      case 'connecting': return { text: 'Estableciendo Conexión...', class: 'connecting' };
      default: return { text: 'Sistema Offline', class: 'disconnected' };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <header className="header">
      <div className="header-backdrop"></div>
      
      <div className="header-content">
        <div className="header-left">
          <div className="logo">
            <div className="logo-icon-wrapper">
              <span className="logo-icon">🛰️</span>
              <div className="logo-pulse"></div>
            </div>
            <div className="logo-text">
              <h1>Ground Station</h1>
              <span className="logo-subtitle">CRAI • Telemetría Autónoma</span>
            </div>
          </div>
        </div>

        <div className="header-center">
          <div className="connection-panel">
            <div className={`status-badge ${statusInfo.class}`}>
              <div className="status-indicator-dot"></div>
              <span className="status-text">{statusInfo.text}</span>
            </div>
            
            {!isSimulating && (
              <div className="ws-controls">
                <div className="ws-input-wrapper">
                  <span className="ws-input-icon">🔗</span>
                  <input
                    type="text"
                    placeholder="ws://192.168.1.100:81"
                    value={wsUrl}
                    onChange={(e) => onWsUrlChange(e.target.value)}
                    className="ws-input"
                    disabled={connectionStatus === 'connected'}
                  />
                </div>
                {connectionStatus === 'connected' ? (
                  <button className="btn btn-disconnect" onClick={onDisconnect}>
                    <span className="btn-icon">⛔</span>
                    <span>Desconectar</span>
                  </button>
                ) : (
                  <button 
                    className="btn btn-connect" 
                    onClick={onConnect}
                    disabled={connectionStatus === 'connecting'}
                  >
                    <span className="btn-icon">🔌</span>
                    <span>Conectar</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="header-right">
          <button 
            className={`btn btn-simulation ${isSimulating ? 'active' : ''}`}
            onClick={onToggleSimulation}
          >
            <span className="btn-icon">{isSimulating ? '⏹️' : '🔬'}</span>
            <span className="btn-text">{isSimulating ? 'Detener Simulación' : 'Modo Simulación'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
