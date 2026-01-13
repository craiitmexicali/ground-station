import React, { useState, useRef, useEffect } from 'react';
import './EventLog.css';

const EventLog = ({ logs, onClear, maxLogs = 100 }) => {
  const [filter, setFilter] = useState('ALL');
  const [autoScroll, setAutoScroll] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
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
    <div className="event-log">
      <div className="event-log-header">
        <h2>📝 Registro de Eventos</h2>
        <div className="event-log-controls">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button 
            className={`auto-scroll-btn ${autoScroll ? 'active' : ''}`}
            onClick={() => setAutoScroll(!autoScroll)}
            title="Auto-scroll"
          >
            ⬇️
          </button>
          <button 
            className="clear-btn"
            onClick={onClear}
            title="Limpiar logs"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="event-log-filters">
        {['ALL', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'].map(level => (
          <button
            key={level}
            className={`filter-btn ${filter === level ? 'active' : ''} ${level.toLowerCase()}`}
            onClick={() => setFilter(level)}
          >
            {level === 'ALL' ? '📋' : getLevelIcon(level)} {level}
            <span className="filter-count">{logCounts[level]}</span>
          </button>
        ))}
      </div>

      <div className="event-log-container" ref={logContainerRef}>
        {filteredLogs.length === 0 ? (
          <div className="no-logs">
            <span>📭</span>
            <p>No hay eventos para mostrar</p>
          </div>
        ) : (
          filteredLogs.map((log, index) => (
            <div 
              key={log.id || index} 
              className={`log-entry ${log.level.toLowerCase()}`}
            >
              <span className="log-icon">{getLevelIcon(log.level)}</span>
              <span className="log-timestamp">{log.timestamp}</span>
              <span className="log-level">[{log.level}]</span>
              {log.source && <span className="log-source">{log.source}:</span>}
              <span className="log-message">{log.message}</span>
            </div>
          ))
        )}
      </div>

      <div className="event-log-footer">
        <span>Mostrando {filteredLogs.length} de {logs.length} eventos</span>
        <span>Máximo: {maxLogs}</span>
      </div>
    </div>
  );
};

export default EventLog;
