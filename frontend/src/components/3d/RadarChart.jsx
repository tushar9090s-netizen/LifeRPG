import React from 'react';
import { useGame } from '../../state/GameContext.jsx';

export const RadarChart = ({ stats, size = 220 }) => {
  const { theme } = useGame();
  const isDivine = theme === 'divine';

  // Normalize stats to [0, 100] max scale
  const maxStat = 80;
  const axes = [
    { label: 'STR', key: 'str', value: stats.str || 20, color: 'var(--attr-str)', angle: -Math.PI / 2 },
    { label: 'INT', key: 'int', value: stats.int || 20, color: 'var(--attr-int)', angle: 0 },
    { label: 'VIT', key: 'vit', value: stats.vit || 20, color: 'var(--attr-vit)', angle: Math.PI / 2 },
    { label: 'AGI', key: 'agi', value: stats.agi || 20, color: 'var(--attr-agi)', angle: Math.PI }
  ];

  const center = size / 2;
  const radius = size * 0.36;

  // Grid concentric rings (25%, 50%, 75%, 100%)
  const rings = [0.25, 0.5, 0.75, 1.0];

  // Polygon points for stats
  const statPoints = axes.map(axis => {
    const r = (Math.min(axis.value, maxStat) / maxStat) * radius;
    const x = center + r * Math.cos(axis.angle);
    const y = center + r * Math.sin(axis.angle);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div style={{ width: size, height: size, position: 'relative', margin: '0 auto' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background webs / rings */}
        {rings.map((factor, idx) => {
          const r = radius * factor;
          const pts = axes.map(axis => {
            const x = center + r * Math.cos(axis.angle);
            const y = center + r * Math.sin(axis.angle);
            return `${x},${y}`;
          }).join(' ');

          return (
            <polygon
              key={idx}
              points={pts}
              fill={idx === rings.length - 1 ? (isDivine ? 'rgba(216, 202, 160, 0.12)' : 'rgba(23, 24, 38, 0.6)') : 'none'}
              stroke="var(--border)"
              strokeWidth={idx === rings.length - 1 ? 1.5 : 0.8}
              strokeDasharray={idx < rings.length - 1 ? '2 2' : 'none'}
            />
          );
        })}

        {/* Axis spoke lines */}
        {axes.map((axis, idx) => {
          const x2 = center + radius * Math.cos(axis.angle);
          const y2 = center + radius * Math.sin(axis.angle);
          return (
            <line
              key={idx}
              x1={center}
              y1={center}
              x2={x2}
              y2={y2}
              stroke="var(--border)"
              strokeWidth={1}
            />
          );
        })}

        {/* User Build Polygon */}
        <polygon
          points={statPoints}
          fill="var(--accent-glow)"
          stroke="var(--accent)"
          strokeWidth={2}
          style={{
            filter: 'drop-shadow(0 0 6px var(--accent))',
            transition: 'all 0.4s ease'
          }}
        />

        {/* Vertex nodes */}
        {axes.map((axis, idx) => {
          const r = (Math.min(axis.value, maxStat) / maxStat) * radius;
          const x = center + r * Math.cos(axis.angle);
          const y = center + r * Math.sin(axis.angle);
          return (
            <circle
              key={idx}
              cx={x}
              cy={y}
              r={4}
              fill={axis.color}
              stroke="var(--surface)"
              strokeWidth={1.5}
            />
          );
        })}

        {/* Axis Labels */}
        {axes.map((axis, idx) => {
          const labelDist = radius + 22;
          const lx = center + labelDist * Math.cos(axis.angle);
          const ly = center + labelDist * Math.sin(axis.angle);
          return (
            <text
              key={idx}
              x={lx}
              y={ly + 4}
              textAnchor="middle"
              fill={axis.color}
              fontSize="11"
              fontWeight="700"
              fontFamily="var(--font-display)"
              letterSpacing="0.05em"
            >
              {axis.label} ({axis.value})
            </text>
          );
        })}
      </svg>
    </div>
  );
};

