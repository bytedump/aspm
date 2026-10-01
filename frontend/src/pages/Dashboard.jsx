import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import StatCard from '../components/StatCard'
import Card from '../components/Card'
import { getStats, getAlerts } from '../services/api'
import { useTranslation } from 'react-i18next'
import { useDemoMode, demoDelay } from '../context/DemoContext'

const severityColors = {
  CRITICAL: '#EF4444',
  HIGH: '#F97316',
  MEDIUM: '#4F8EF7',
  LOW: '#22C55E',
  INFO: '#3B82F6',
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [recentAlerts, setRecentAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { isDemoMode, demoAlertList } = useDemoMode()
  const { t } = useTranslation()

  useEffect(() => {
    // MODO DEMO: dados ficticios locais, sem chamada de API
    

    setLoading(true)
    Promise.all([getStats(), getAlerts()])
      .then(([statsRes, alertsRes]) => {
        setStats(statsRes.data)
        setRecentAlerts(alertsRes.data.slice(0, 5))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [isDemoMode, demoAlertList])

  const chartData = stats?.by_severity
    ? Object.entries(stats.by_severity).map(([k, v]) => ({ name: k, value: v }))
    : []

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ color: '#64748B', fontFamily: "'Raleway', sans-serif", letterSpacing: '0.2em' }}>
        {t('common.loading')}
      </div>
    </div>
  )

  return (
    <div>
      {/* Título */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontFamily: "'Space Grotesk', serif",
          fontSize: '24px',
          fontWeight: '600',
          color: '#E2E8F0',
          letterSpacing: '0.05em',
          marginBottom: '4px',
        }}>{t('dashboard.title')}</h1>
        <p style={{
          fontFamily: "'Raleway', sans-serif",
          fontSize: '13px',
          color: '#64748B',
        }}>{t('dashboard.subtitle')}</p>
      </div>

      {/* Stat cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '32px',
      }}>
        <StatCard
          label={t('dashboard.totalAlerts')}
          value={stats?.total_alerts ?? 0}
          sub={t('dashboard.totalAlertsSub')}
          accent={true}
        />
        <StatCard
          label={t('dashboard.critical')}
          value={stats?.by_severity?.CRITICAL ?? 0}
          sub={t('dashboard.criticalSub')}
        />
        <StatCard
          label={t('dashboard.highSeverity')}
          value={stats?.by_severity?.HIGH ?? 0}
          sub={t('dashboard.highSeveritySub')}
        />
        <StatCard
          label={t('dashboard.resolved')}
          value={stats?.by_severity?.LOW ?? 0}
          sub={t('dashboard.resolvedSub')}
        />
      </div>

      {/* Gráfico + alertas recentes */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '16px',
      }}>
        {/* Alertas recentes */}
        <Card>
          <div style={{
            fontFamily: "'Raleway', sans-serif",
            fontSize: '12px',
            fontWeight: '600',
            color: '#64748B',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}>{t('dashboard.recentAlerts')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recentAlerts.length === 0 ? (
              <div style={{ color: '#64748B', fontSize: '13px' }}>{t('dashboard.noAlerts')}</div>
            ) : recentAlerts.map(alert => (
              <div
                key={alert.id}
                onClick={() => navigate(`/alerts`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  background: '#060810',
                  borderRadius: '10px',
                  border: '1px solid #1E2A42',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#4F8EF740'
                  e.currentTarget.style.background = '#131D35'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#1E2A42'
                  e.currentTarget.style.background = '#060810'
                }}
              >
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: severityColors[alert.severity_adjusted] || '#64748B',
                  flexShrink: 0,
                }} />
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{
                    fontSize: '12px',
                    color: '#E2E8F0',
                    fontFamily: 'Inter',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>{alert.title}</div>
                  <div style={{
                    fontSize: '11px',
                    color: '#64748B',
                    fontFamily: 'Inter',
                  }}>{alert.repository}</div>
                </div>
                <div style={{
                  fontSize: '10px',
                  color: severityColors[alert.severity_adjusted] || '#64748B',
                  fontFamily: 'Raleway',
                  fontWeight: '600',
                  letterSpacing: '0.08em',
                  flexShrink: 0,
                }}>{alert.severity_adjusted}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}


