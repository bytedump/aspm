import { useState, useEffect } from 'react'
import Card from '../components/Card'
import { getRemediations } from '../services/api'
import { useDemoMode, demoDelay } from '../context/DemoContext'
import { demoRemediations } from '../data/demoData'

export default function Remediations() {
  const [remediations, setRemediations] = useState([])
  const [loading, setLoading] = useState(true)
  const { isDemoMode } = useDemoMode()

  useEffect(() => {
    // MODO DEMO: sem chamada de API
    if (isDemoMode) {
      setLoading(true)
      demoDelay().then(() => { setRemediations(demoRemediations); setLoading(false) })
      return
    }
    setLoading(true)
    getRemediations().then(r => setRemediations(r.data)).catch(console.error).finally(() => setLoading(false))
  }, [isDemoMode])

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: "'Space Grotesk', serif", fontSize: '24px', color: '#E2E8F0', letterSpacing: '0.05em', marginBottom: '4px' }}>
          Remediações
        </h1>
        <p style={{ color: '#64748B', fontFamily: 'Raleway', fontSize: '13px' }}>
          Patches e testes gerados pela IA com DLP de borda
        </p>
      </div>

      {loading ? (
        <div style={{ color: '#64748B', fontFamily: 'Raleway', letterSpacing: '0.2em' }}>CARREGANDO...</div>
      ) : remediations.length === 0 ? (
        <Card>
          <div style={{ color: '#64748B', textAlign: 'center', padding: '32px', fontFamily: 'Raleway' }}>
            Nenhuma remediação gerada ainda. Vá para Alertas e clique em "Remediar".
          </div>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {remediations.map(rem => (
            <Card key={rem.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span style={{
                  background: 'rgba(79, 142, 247, 0.12)',
                  color: '#4F8EF7',
                  border: '1px solid #4F8EF740',
                  borderRadius: '4px',
                  padding: '2px 8px',
                  fontSize: '10px',
                  fontFamily: 'Raleway',
                  fontWeight: '700',
                  letterSpacing: '0.1em',
                }}>REMEDIAÇÃO #{rem.id}</span>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: '#64748B' }}>
                  Alert #{rem.alert_id}
                </span>
              </div>

              {rem.pr_description && (
                <div style={{
                  fontFamily: 'Inter',
                  fontSize: '13px',
                  color: '#E2E8F0',
                  marginBottom: '16px',
                  lineHeight: 1.6,
                }}>{rem.pr_description}</div>
              )}

              <div style={{
                fontFamily: "'Raleway', sans-serif",
                fontSize: '11px',
                fontWeight: '600',
                color: '#64748B',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}>Patch sugerido</div>
              <pre style={{
                background: '#060810',
                border: '1px solid #1E2A42',
                borderRadius: '10px',
                padding: '16px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '12px',
                color: '#7EB0FF',
                overflow: 'auto',
                maxHeight: '260px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}>{rem.patch_code}</pre>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
