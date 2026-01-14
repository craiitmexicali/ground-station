import React, { useState, useRef, useEffect } from 'react';
import './EventLog.css';

const EventLog = ({ logs, onClear, maxLogs = 100 }) => {
  const [filter, setFilter] = useState('ALL');
  const [autoScroll, setAutoScroll] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const logContainerRef = useRef(null);

  // Auto-scroll cuando hay nuevos logs
  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  // Filtrar logs
  const filteredLogs = logs.filter(log => {
    const matchesFilter = filter === 'ALL' || log.level === filter;
    const matchesSearch = searchTerm === '' || 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.source && log.source.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  // Obtener icono según nivel
  const getLevelIcon = (level) => {
    switch (level) {
      case 'INFO': return 'ℹ️';
      case 'WARNING': return '⚠️';
      case 'ERROR': return '❌';
      case 'CRITICAL': return '🔴';
      case 'DEBUG': return '🔧';
      case 'SUCCESS': return '✅';
      default: return '📋';
    }
  };

  // Contar logs por nivel
  const logCounts = {
    ALL: logs.length,
    INFO: logs.filter(l => l.level === 'INFO').length,
    WARNING: logs.filter(l => l.level === 'WARNING').length,
    ERROR: logs.filter(l => l.level === 'ERROR').length,
    CRITICAL: logs.filter(l => l.level === 'CRITICAL').length,
  };

  return (
    <div className={`event-log ${isExpanded ? 'expanded' : ''}`}>
      <div className="event-log-header">
        <div className="header-title">
          <span className="header-icon">📝</span>
          <h2>Registro de Eventos</h2>
          <span className="log-badge">{logs.length}</span>
        </div>
        <div className="event-log-controls">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar eventos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="control-buttons">
            <button 
              className={`control-btn ${autoScroll ? 'active' : ''}`}
              onClick={() => setAutoScroll(!autoScroll)}
              title="Auto-scroll"
            >
              <span>⬇️</span>
            </button>
            <button 
              className={`control-btn ${isExpanded ? 'active' : ''}`}
              onClick={() => setIsExpanded(!isExpanded)}
              title="Expandir/Contraer"
            >
              <span>{isExpanded ? '🔽' : '🔼'}</span>
            </button>
            <button 
              className="control-btn danger"
              onClick={onClear}
              title="Limpiar logs"
            >
              <span>🗑️</span>
            </button>
          </div>
        </div>
      </div>

      <div className="event-log-filters">
        {['ALL', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'].map(level => (
          <button
            key={level}
            className={`filter-btn ${filter === level ? 'active' : ''} ${level.toLowerCase()}`}
            onClick={() => setFilter(level)}
          >
            <span className="filter-icon">{level === 'ALL' ? '📋' : getLevelIcon(level)}</span>
            <span className="filter-label">{level}</span>
            <span className="filter-count">{logCounts[level]}</span>
          </button>
        ))}
      </div>

      <div className="event-log-container" ref={logContainerRef}>
        {filteredLogs.length === 0 ? (
          <div className="no-logs">
            <div className="no-logs-icon">📭</div>
            <p>No hay eventos para mostrar</p>
            <span className="no-logs-hint">Los eventos aparecerán aquí cuando ocurran</span>
          </div>
        ) : (
          filteredLogs.map((log, index) => (
            <div 
              key={log.id || index} 
              className={`log-entry ${log.level.toLowerCase()}`}
              style={{ animationDelay: `${Math.min(index * 0.02, 0.5)}s` }}
            >
              <span className="log-icon">{getLevelIcon(log.level)}</span>
              <span className="log-timestamp">{log.timestamp}</span>
              <span className="log-level">{log.level}</span>
              {log.source && <span className="log-source">{log.source}</span>}
              <span className="log-message">{log.message}</span>
            </div>
          ))
        )}
      </div>

      <div className="event-log-footer">
        <div className="footer-stats">
          <span className="stat">
            <span className="stat-icon">📊</span>
            Mostrando {filteredLogs.length} de {logs.length}
          </span>
        </div>
        <div className="footer-info">
          <span className="max-info">Máx: {maxLogs} eventos</span>
        </div>
      </div>
    </div>
  );
};

export default EventLog;
