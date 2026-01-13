// WebSocketService.js - Servicio de comunicación WebSocket
// Maneja la conexión en tiempo real con el hardware (ESP32, Arduino, etc.)
// ============================================================

class WebSocketService {
  constructor() {
    this.ws = null;
    this.url = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000; // 3 segundos
    this.listeners = new Map();
    this.isConnecting = false;
  }

  /**
   * Conecta al servidor WebSocket
   * @param {string} url - URL del servidor WebSocket (ej: ws://192.168.1.100:81)
   * @returns {Promise} - Promesa que se resuelve cuando se conecta
   */
  connect(url) {
    return new Promise((resolve, reject) => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        resolve(this.ws);
        return;
      }

      this.url = url;
      this.isConnecting = true;

      try {
        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
          console.log('[WebSocket] Conectado a:', url);
          this.reconnectAttempts = 0;
          this.isConnecting = false;
          this.emit('connected', { url });
          resolve(this.ws);
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.emit('data', data);
          } catch (e) {
            // Si no es JSON, emitir como texto plano
            this.emit('data', { raw: event.data });
          }
        };

        this.ws.onerror = (error) => {
          console.error('[WebSocket] Error:', error);
          this.emit('error', error);
          if (this.isConnecting) {
            reject(error);
          }
        };

        this.ws.onclose = (event) => {
          console.log('[WebSocket] Conexión cerrada:', event.code, event.reason);
          this.isConnecting = false;
          this.emit('disconnected', { code: event.code, reason: event.reason });
          
          // Intentar reconectar si no fue un cierre intencional
          if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect();
          }
        };

      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  /**
   * Programa un intento de reconexión
   */
  scheduleReconnect() {
    this.reconnectAttempts++;
    console.log(`[WebSocket] Reconectando en ${this.reconnectDelay/1000}s... (intento ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    this.emit('reconnecting', {
      attempt: this.reconnectAttempts,
      maxAttempts: this.maxReconnectAttempts
    });

    setTimeout(() => {
      if (this.url) {
        this.connect(this.url).catch(() => {
          // El error ya se maneja en connect()
        });
      }
    }, this.reconnectDelay);
  }

  /**
   * Desconecta del servidor WebSocket
   */
  disconnect() {
    if (this.ws) {
      this.ws.close(1000, 'Desconexión intencional');
      this.ws = null;
    }
    this.reconnectAttempts = this.maxReconnectAttempts; // Prevenir reconexión
  }

  /**
   * Envía datos al servidor WebSocket
   * @param {Object|string} data - Datos a enviar
   */
  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = typeof data === 'string' ? data : JSON.stringify(data);
      this.ws.send(message);
      return true;
    }
    console.warn('[WebSocket] No conectado, no se puede enviar:', data);
    return false;
  }

  /**
   * Envía un comando al robot
   * @param {string} command - Nombre del comando
   * @param {Object} params - Parámetros del comando
   */
  sendCommand(command, params = {}) {
    return this.send({
      type: 'command',
      command,
      params,
      timestamp: Date.now()
    });
  }

  /**
   * Registra un listener para un evento
   * @param {string} event - Nombre del evento
   * @param {Function} callback - Función a ejecutar
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  /**
   * Elimina un listener
   * @param {string} event - Nombre del evento
   * @param {Function} callback - Función a eliminar
   */
  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * Emite un evento a todos los listeners
   * @param {string} event - Nombre del evento
   * @param {any} data - Datos del evento
   */
  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (e) {
          console.error('[WebSocket] Error en listener:', e);
        }
      });
    }
  }

  /**
   * Obtiene el estado actual de la conexión
   * @returns {string} - Estado de la conexión
   */
  getState() {
    if (!this.ws) return 'DISCONNECTED';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'CONNECTING';
      case WebSocket.OPEN:
        return 'CONNECTED';
      case WebSocket.CLOSING:
        return 'CLOSING';
      case WebSocket.CLOSED:
        return 'DISCONNECTED';
      default:
        return 'UNKNOWN';
    }
  }

  /**
   * Verifica si está conectado
   * @returns {boolean}
   */
  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }
}

// Instancia singleton
const webSocketService = new WebSocketService();

export default webSocketService;
export { WebSocketService };
