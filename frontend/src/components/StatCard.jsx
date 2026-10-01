export default function StatCard({ label, value, sub, accent = false }) {
  return (
    <div style={{
      background: accent
        ? 'linear-gradient(135deg, #131D35 0%, #0C1220 100%)'
        : '#0C1220',
      border: `1px solid ${accent ? '#4F8EF740' : '#1E2A42'}`,
      borderRadius: '16px',
      padding: '24px',
      boxShadow: accent
        ? '0 4px 24px rgba(79, 142, 247, 0.12)'
        : '0 4px 24px rgba(79, 142, 247, 0.06)',
    }}>
      <div style={{
        fontFamily: "'Raleway', sans-serif",
        fontSize: '11px',
        fontWeight: '500',
        color: '#64748B',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        marginBottom: '12px',
      }}>{label}</div>
      <div style={{
        fontFamily: "'Space Grotesk', serif",
        fontSize: '36px',
        fontWeight: '700',
        color: accent ? '#4F8EF7' : '#E2E8F0',
        lineHeight: 1,
        marginBottom: '6px',
        background: accent
          ? 'linear-gradient(135deg, #2563EB, #7EB0FF)'
          : 'none',
        WebkitBackgroundClip: accent ? 'text' : 'unset',
        WebkitTextFillColor: accent ? 'transparent' : 'unset',
      }}>{value}</div>
      {sub && (
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '12px',
          color: '#64748B',
        }}>{sub}</div>
      )}
    </div>
  )
}
