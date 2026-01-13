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
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <span className="logo-icon">🛰️</span>
          <div className="logo-text">
            <h1>Ground Station</h1>
            <span className="logo-subtitle">Telemetría de Vehículos Autónomos</span>
          </div>
        </div>
      </div>

      <div className="header-center">
        <div className="connection-panel">
          <div className={`status-indicator ${connectionStatus}`}>
            <span className="status-dot"></span>
            <span className="status-text">
              {connectionStatus === 'connected' && 'Conectado'}
              {connectionStatus === 'disconnected' && 'Desconectado'}
              {connectionStatus === 'connecting' && 'Conectando...'}
              {connectionStatus === 'simulating' && 'Simulación Activa'}
            </span>
          </div>
          
          {!isSimulating && (
            <div className="ws-input-group">
              <input
                type="text"
                placeholder="ws://192.168.1.100:81"
                value={wsUrl}
                onChange={(e) => onWsUrlChange(e.target.value)}
                className="ws-input"
                disabled={connectionStatus === 'connected'}
              />
              {connectionStatus === 'connected' ? (
                <button className="btn btn-disconnect" onClick={onDisconnect}>
                  Desconectar
                </button>
              ) : (
                <button 
                  className="btn btn-connect" 
                  onClick={onConnect}
                  disabled={connectionStatus === 'connecting'}
                >
                  Conectar
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
          {isSimulating ? (
            <>
              <span className="btn-icon">⏹️</span>
              Detener Simulación
            </>
          ) : (
            <>
              <span className="btn-icon">🔬</span>
              Iniciar Simulación
            </>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
