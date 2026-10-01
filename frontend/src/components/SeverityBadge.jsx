const config = {
  CRITICAL: { color: '#EF4444', bg: 'rgba(239, 68, 68, 0.15)', label: 'CRÍTICO' },
  HIGH: { color: '#F97316', bg: 'rgba(249, 115, 22, 0.15)', label: 'ALTO' },
  MEDIUM: { color: '#4F8EF7', bg: 'rgba(79, 142, 247, 0.15)', label: 'MÉDIO' },
  LOW: { color: '#22C55E', bg: 'rgba(34, 197, 94, 0.15)', label: 'BAIXO' },
  INFO: { color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.15)', label: 'INFO' },
  UNKNOWN: { color: '#64748B', bg: 'rgba(100, 116, 139, 0.15)', label: '?' },
}

export default function SeverityBadge({ severity }) {
  const s = config[severity?.toUpperCase()] || config.UNKNOWN
  return (
    <span style={{
      background: s.bg,
      color: s.color,
      border: `1px solid ${s.color}40`,
      borderRadius: '20px',
      padding: '2px 8px',
      fontSize: '11px',
      fontFamily: "'Raleway', sans-serif",
      fontWeight: '600',
      letterSpacing: '0.08em',
    }}>
      {s.label}
    </span>
  )
}
