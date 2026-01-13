import React from 'react';
import { calculateBatteryPercentage, percentageToColor } from '../../utils/helpers';
import './GaugeChart.css';

const GaugeChart = ({ 
  value, 
  maxValue, 
  minValue = 0,
  title, 
  unit, 
  colorThresholds,
  type = 'default' // 'default', 'battery', 'temperature', 'rpm'
}) => {
  // Calcular porcentaje
  const percentage = ((value - minValue) / (maxValue - minValue)) * 100;
  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  
  // Determinar color basado en tipo y umbrales
  const getColor = () => {
    if (colorThresholds) {
      const { warning, danger, inverted } = colorThresholds;
      if (inverted) {
        // Para batería: alto es bueno
        if (value >= danger) return '#22c55e'; // verde
        if (value >= warning) return '#eab308'; // amarillo
        return '#ef4444'; // rojo
      } else {
        // Para temperatura: bajo es bueno
        if (value >= danger) return '#ef4444'; // rojo
        if (value >= warning) return '#eab308'; // amarillo
        return '#22c55e'; // verde
      }
    }
    return percentageToColor(clampedPercentage);
  };

  const color = getColor();
  
  // Calcular el ángulo para el arco del gauge (180 grados = semicírculo)
  const angle = (clampedPercentage / 100) * 180;
  
  // SVG path para el arco
  const describeArc = (x, y, radius, startAngle, endAngle) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
  };

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 180) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  // Para batería, mostrar también el porcentaje
  const showBatteryPercentage = type === 'battery';
  const batteryPercentage = showBatteryPercentage 
    ? calculateBatteryPercentage(value, minValue, maxValue) 
    : null;

  return (
    <div className="gauge-container">
      <div className="gauge-title">{title}</div>
      <div className="gauge-svg-container">
        <svg viewBox="0 0 200 120" className="gauge-svg">
          {/* Arco de fondo */}
          <path
            d={describeArc(100, 100, 80, 0, 180)}
            fill="none"
            stroke="rgba(148, 163, 184, 0.2)"
            strokeWidth="16"
            strokeLinecap="round"
          />
          {/* Arco de valor */}
          <path
            d={describeArc(100, 100, 80, 0, angle)}
            fill="none"
            stroke={color}
            strokeWidth="16"
            strokeLinecap="round"
            style={{ 
              transition: 'stroke-dashoffset 0.3s ease, stroke 0.3s ease',
              filter: `drop-shadow(0 0 6px ${color})`
            }}
          />
          {/* Indicador de aguja */}
          <circle
            cx={polarToCartesian(100, 100, 80, angle).x}
            cy={polarToCartesian(100, 100, 80, angle).y}
            r="8"
            fill={color}
            style={{ filter: `drop-shadow(0 0 4px ${color})` }}
          />
        </svg>
      </div>
      <div className="gauge-value" style={{ color }}>
        {typeof value === 'number' ? value.toFixed(1) : value}
        <span className="gauge-unit">{unit}</span>
      </div>
      {showBatteryPercentage && (
        <div className="gauge-percentage" style={{ color }}>
          {batteryPercentage.toFixed(0)}%
        </div>
      )}
      <div className="gauge-range">
        <span>{minValue}</span>
        <span>{maxValue}</span>
      </div>
    </div>
  );
};

export default GaugeChart;
