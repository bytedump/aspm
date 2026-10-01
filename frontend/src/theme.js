export const theme = {
  colors: {
    bgPrimary: '#060810',
    bgCard: '#0C1220',
    bgHover: '#131D35',
    goldPrimary: '#4F8EF7',
    goldLight: '#7EB0FF',
    goldDark: '#2563EB',
    goldMuted: '#64748B',
    textPrimary: '#E2E8F0',
    textSecondary: '#64748B',
    border: '#1E2A42',
    borderActive: '#4F8EF7',
    critical: '#EF4444',
    high: '#F97316',
    medium: '#4F8EF7',
    low: '#22C55E',
    info: '#3B82F6',
    success: '#22C55E',
  },
  gradients: {
    gold: 'linear-gradient(135deg, #2563EB 0%, #4F8EF7 50%, #7EB0FF 100%)',
    goldSubtle: 'linear-gradient(135deg, #131D35 0%, #0C1220 100%)',
    divider: 'linear-gradient(90deg, transparent, #4F8EF7, transparent)',
    header: 'linear-gradient(180deg, #0C1220 0%, #060810 100%)',
  },
  fonts: {
    display: "'Space Grotesk', serif",
    heading: "'Raleway', sans-serif",
    body: "'Inter', sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  radius: {
    card: '16px',
    element: '10px',
    badge: '20px',
  },
  shadows: {
    card: '0 4px 24px rgba(79, 142, 247, 0.08)',
    cardHover: '0 8px 32px rgba(79, 142, 247, 0.16)',
    glow: '0 0 20px rgba(79, 142, 247, 0.3)',
  },
}

export const severityConfig = {
  CRITICAL: { color: '#EF4444', bg: 'rgba(239, 68, 68, 0.12)', label: 'CRÍTICO' },
  HIGH: { color: '#F97316', bg: 'rgba(249, 115, 22, 0.12)', label: 'ALTO' },
  MEDIUM: { color: '#4F8EF7', bg: 'rgba(79, 142, 247, 0.12)', label: 'MÉDIO' },
  LOW: { color: '#22C55E', bg: 'rgba(34, 197, 94, 0.12)', label: 'BAIXO' },
  INFO: { color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.12)', label: 'INFO' },
  UNKNOWN: { color: '#64748B', bg: 'rgba(100, 116, 139, 0.12)', label: 'DESCONHECIDO' },
}
