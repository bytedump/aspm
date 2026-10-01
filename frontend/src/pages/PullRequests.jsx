import { useState, useEffect } from 'react'
import Card from '../components/Card'
import { getPRs } from '../services/api'
import { useDemoMode, demoDelay } from '../context/DemoContext'
import { demoPullRequests } from '../data/demoData'

const statusConfig = {
  open: { color: '#4F8EF7', label: 'ABERTO' },
  merged: { color: '#22C55E', label: 'MERGED' },
  closed: { color: '#EF4444', label: 'FECHADO' },
}

export default function PullRequests() {
  const [prs, setPRs] = useState([])
  const [loading, setLoading] = useState(true)
  const { isDemoMode } = useDemoMode()

  useEffect(() => {
    // MODO DEMO: sem chamada de API
    if (isDemoMode) {
      setLoading(true)
      demoDelay().then(() => { setPRs(demoPullRequests); setLoading(false) })
      return
    }
    setLoading(true)
    getPRs().then(r => setPRs(r.data)).catch(console.error).finally(() => setLoading(false))
  }, [isDemoMode])

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: "'Space Grotesk', serif", fontSize: '24px', color: '#E2E8F0', letterSpacing: '0.05em', marginBottom: '4px' }}>
          Pull Requests
        </h1>
        <p style={{ color: '#64748B', fontFamily: 'Raleway', fontSize: '13px' }}>
          Correções automáticas aguardando revisão humana
        </p>
      </div>

      {loading ? (
        <div style={{ color: '#64748B', fontFamily: 'Raleway', letterSpacing: '0.2em' }}>CARREGANDO...</div>
      ) : prs.length === 0 ? (
        <Card>
          <div style={{ color: '#64748B', textAlign: 'center', padding: '32px', fontFamily: 'Raleway' }}>
            Nenhum Pull Request criado ainda. Vá para Alertas e clique em "Criar PR".
          </div>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {prs.map(pr => {
            const status = statusConfig[pr.status] || statusConfig.open
            return (
              <div key={pr.id} style={{
                background: '#0C1220',
                border: '1px solid #1E2A42',
                borderRadius: '16px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}>
                <span style={{
                  background: `${status.color}20`,
                  color: status.color,
                  border: `1px solid ${status.color}40`,
                  borderRadius: '4px',
                  padding: '2px 8px',
                  fontSize: '10px',
                  fontFamily: 'Raleway',
                  fontWeight: '700',
                  letterSpacing: '0.1em',
                  flexShrink: 0,
                }}>{status.label}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Inter', fontSize: '13px', color: '#E2E8F0', marginBottom: '2px' }}>
                    PR #{pr.pr_number} — Alert #{pr.alert_id}
                  </div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: '#64748B' }}>
                    {pr.branch_name}
                  </div>
                </div>
                {pr.pr_url && (
                  <a
                    href={pr.pr_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: 'rgba(79, 142, 247, 0.1)',
                      border: '1px solid rgba(79, 142, 247, 0.3)',
                      borderRadius: '10px',
                      padding: '6px 14px',
                      color: '#4F8EF7',
                      fontFamily: 'Raleway',
                      fontSize: '11px',
                      fontWeight: '600',
                      letterSpacing: '0.08em',
                      textDecoration: 'none',
                    }}
                  >
                    VER NO GITHUB →
                  </a>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
