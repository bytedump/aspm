import { useState } from 'react'
import Card from '../components/Card'
import { getRadar } from '../services/api'
import { useDemoMode, demoDelay } from '../context/DemoContext'
import { demoRadarReport } from '../data/demoData'

export default function Radar() {
  const [report, setReport] = useState(null)
  const [generatedAt, setGeneratedAt] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { isDemoMode } = useDemoMode()

  const fetchRadar = async () => {
    setLoading(true)
    setError('')

    // MODO DEMO: relatorio ficticio local, sem chamada de API
    if (isDemoMode) {
      await demoDelay(500)
      setReport(demoRadarReport)
      setGeneratedAt(new Date().toISOString())
      setLoading(false)
      return
    }

    try {
      const res = await getRadar()
      setReport(res.data.report)
      setGeneratedAt(res.data.generated_at)
    } catch (e) {
      setError(e.response?.data?.detail || 'Não foi possível gerar o panorama.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Título */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontFamily: "'Space Grotesk', serif",
          fontSize: '24px',
          fontWeight: '600',
          color: '#E2E8F0',
          letterSpacing: '0.05em',
          marginBottom: '4px',
        }}>Radar</h1>
        <p style={{ color: '#64748B', fontFamily: 'Raleway', fontSize: '13px' }}>
          Panorama de ameaças relevantes para o seu setor
        </p>
      </div>

      {/* Aviso de honestidade técnica — obrigatório */}
      <Card style={{ marginBottom: '24px', borderLeft: '2px solid #2563EB' }}>
        <p style={{ fontFamily: 'Inter', fontSize: '13px', color: '#E2E8F0', lineHeight: 1.7 }}>
          Panorama analítico de ameaças relevantes para o seu setor, baseado no perfil da sua
          empresa. Esta análise é gerada a partir do{' '}
          <strong style={{ color: '#7EB0FF' }}>conhecimento do modelo de IA</strong> — não é uma
          busca ao vivo na internet, mas uma síntese estruturada de padrões de ameaça consistentes
          com seu contexto.
        </p>
      </Card>

      {/* Ação */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button
          onClick={fetchRadar}
          disabled={loading}
          style={{
            background: 'linear-gradient(135deg, #2563EB 0%, #4F8EF7 100%)',
            border: 'none',
            borderRadius: '10px',
            padding: '12px 32px',
            color: '#060810',
            fontFamily: 'Raleway',
            fontSize: '13px',
            fontWeight: '700',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            opacity: loading ? 0.5 : 1,
          }}
        >
          {loading ? 'ANALISANDO...' : report ? '⟳ ATUALIZAR' : 'GERAR PANORAMA'}
        </button>
        {generatedAt && (
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: '#64748B' }}>
            última atualização: {new Date(generatedAt).toLocaleString('pt-BR')}
          </span>
        )}
      </div>

      {error && (
        <Card style={{ marginBottom: '16px' }}>
          <div style={{ color: '#EF4444', fontFamily: 'Inter', fontSize: '13px' }}>{error}</div>
        </Card>
      )}

      {/* Relatório */}
      {report ? (
        <Card>
          <div style={{
            fontFamily: 'Raleway', fontSize: '11px', fontWeight: '600', color: '#64748B',
            letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px',
          }}>Panorama executivo</div>
          <div style={{
            fontFamily: 'Inter',
            fontSize: '13px',
            color: '#E2E8F0',
            lineHeight: 1.8,
            whiteSpace: 'pre-wrap',
          }}>{report}</div>
        </Card>
      ) : !loading && (
        <Card>
          <div style={{ color: '#64748B', textAlign: 'center', padding: '32px', fontFamily: 'Raleway' }}>
            Clique em "Gerar Panorama" para produzir a análise com base no perfil da sua empresa
            (configurável na aba <strong style={{ color: '#4F8EF7' }}>Risco Real</strong>).
          </div>
        </Card>
      )}
    </div>
  )
}
