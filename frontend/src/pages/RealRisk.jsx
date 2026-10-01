import { useState, useEffect } from 'react'
import ReactFlow, { Background, Controls } from 'reactflow'
import 'reactflow/dist/style.css'
import Card from '../components/Card'
import { getCompanyProfile, saveCompanyProfile, getRiskAssessments } from '../services/api'
import { generateRiskReport } from '../utils/pdfReport'
import { useDemoMode, demoDelay } from '../context/DemoContext'
import { demoCompanyProfile, demoRiskAssessments } from '../data/demoData'

const sectors = [
  'Tecnologia / Software',
  'Financeiro',
  'Saúde',
  'Varejo / E-commerce',
  'Educação',
  'Indústria',
  'Outro',
]

const dataVolumes = [
  'Baixo — até 5 mil registros',
  'Médio — até 50 mil registros',
  'Alto — até 500 mil registros',
  'Muito alto — acima de 500 mil registros',
]

// Cores dos nós do blast radius por tipo de ativo no caminho do ataque
const nodeColors = {
  entry_point: { bg: 'rgba(239, 68, 68, 0.15)', border: '#EF4444', text: '#E2E8F0' },
  lateral: { bg: 'rgba(100, 116, 139, 0.15)', border: '#64748B', text: '#E2E8F0' },
  critical_asset: { bg: 'rgba(234, 179, 8, 0.15)', border: '#7EB0FF', text: '#7EB0FF' },
}

// Cores do nivel de risco de compliance (SLA)
const complianceColors = {
  BAIXO: '#22C55E',
  MEDIO: '#4F8EF7',
  ALTO: '#F97316',
  CRITICO: '#EF4444',
}

const labelStyle = {
  fontFamily: 'Raleway',
  fontSize: '11px',
  fontWeight: '600',
  color: '#64748B',
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  marginBottom: '8px',
  display: 'block',
}

const fieldStyle = {
  width: '100%',
  background: '#060810',
  border: '1px solid #1E2A42',
  borderRadius: '10px',
  padding: '10px 12px',
  color: '#E2E8F0',
  fontSize: '13px',
  fontFamily: 'Inter',
  outline: 'none',
  transition: 'all 0.2s ease',
}

function BlastRadius({ blastRadius }) {
  const rawNodes = blastRadius?.nodes || []
  const rawEdges = blastRadius?.edges || []

  if (rawNodes.length === 0) {
    return (
      <div style={{ color: '#64748B', fontFamily: 'Inter', fontSize: '13px' }}>
        Sem caminho de propagação mapeado para esta avaliação.
      </div>
    )
  }

  const nodes = rawNodes.map((n, i) => {
    const c = nodeColors[n.type] || nodeColors.lateral
    return {
      id: String(n.id),
      data: { label: n.label },
      position: { x: 40 + i * 210, y: 60 + (i % 2 === 0 ? 0 : 70) },
      style: {
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: '10px',
        color: c.text,
        fontFamily: 'Inter, sans-serif',
        fontSize: '12px',
        padding: '10px 12px',
        width: 170,
        boxShadow: n.type === 'critical_asset' ? '0 0 14px rgba(234, 179, 8, 0.35)' : 'none',
      },
    }
  })

  const edges = rawEdges.map((e, i) => ({
    id: `e${i}`,
    source: String(e.from),
    target: String(e.to),
    label: e.label,
    animated: true,
    style: { stroke: '#2563EB' },
    labelStyle: { fill: '#64748B', fontFamily: 'Inter', fontSize: 10 },
    labelBgStyle: { fill: '#060810' },
  }))

  return (
    <div style={{ height: '260px', background: '#060810', border: '1px solid #1E2A42', borderRadius: '10px' }}>
      <ReactFlow nodes={nodes} edges={edges} fitView proOptions={{ hideAttribution: true }}>
        <Background color="#1E2A42" gap={16} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  )
}

export default function RealRisk() {
  const [profile, setProfile] = useState({
    sector: '',
    annual_revenue: '',
    sensitive_data_volume: '',
    regulations: '',
    operational_context: '',
  })
  const [assessments, setAssessments] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState('')
  const { isDemoMode } = useDemoMode()

  useEffect(() => {
    // MODO DEMO: perfil e avaliacoes ficticios, sem chamada de API
    if (isDemoMode) {
      setLoading(true)
      demoDelay().then(() => {
        setProfile(demoCompanyProfile)
        setAssessments(demoRiskAssessments)
        setLoading(false)
      })
      return
    }

    setLoading(true)
    Promise.all([getCompanyProfile(), getRiskAssessments()])
      .then(([profRes, assessRes]) => {
        setProfile(profRes.data)
        setAssessments(assessRes.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [isDemoMode])

  const handleSave = async () => {
    if (isDemoMode) {
      setSaving(true)
      await demoDelay(400)
      setSavedMsg('✓ Perfil salvo — as próximas estimativas usarão estes dados')
      setSaving(false)
      return
    }
    setSaving(true)
    setSavedMsg('')
    try {
      await saveCompanyProfile(profile)
      setSavedMsg('✓ Perfil salvo — as próximas estimativas usarão estes dados')
    } catch (e) {
      setSavedMsg('✗ Erro ao salvar o perfil')
    } finally {
      setSaving(false)
    }
  }

  const set = (field) => (e) => setProfile(p => ({ ...p, [field]: e.target.value }))

  return (
    <div>
      {/* Título */}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <h1 style={{
            fontFamily: "'Space Grotesk', serif",
            fontSize: '24px',
            fontWeight: '600',
            color: '#E2E8F0',
            letterSpacing: '0.05em',
            marginBottom: '4px',
          }}>Risco Real</h1>
          <p style={{ color: '#64748B', fontFamily: 'Raleway', fontSize: '13px' }}>
            Quanto uma vulnerabilidade pode custar ao seu negócio
          </p>
        </div>
        <button
          onClick={() => generateRiskReport(assessments, localStorage.getItem('company_name'))}
          disabled={assessments.length === 0}
          style={{
            background: 'transparent',
            border: '1px solid #1E2A42',
            borderRadius: '10px',
            padding: '7px 14px',
            color: '#64748B',
            fontFamily: 'Raleway',
            fontSize: '11px',
            fontWeight: '600',
            letterSpacing: '0.08em',
            cursor: assessments.length === 0 ? 'default' : 'pointer',
            opacity: assessments.length === 0 ? 0.4 : 1,
            flexShrink: 0,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => { if (assessments.length) { e.currentTarget.style.borderColor = '#4F8EF7'; e.currentTarget.style.color = '#4F8EF7' } }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#1E2A42'; e.currentTarget.style.color = '#64748B' }}
        >
          ▤ EXPORTAR PDF
        </button>
      </div>

      {/* Cabeçalho explicativo */}
      <Card style={{ marginBottom: '24px', borderLeft: '2px solid #2563EB' }}>
        <p style={{ fontFamily: 'Inter', fontSize: '13px', color: '#E2E8F0', lineHeight: 1.7 }}>
          Estime o impacto financeiro real de cada vulnerabilidade para o seu negócio, com base em
          multas LGPD, custo de inatividade e a movimentação simulada do ataque pelos seus sistemas.
          Quanto mais informações você fornecer sobre sua empresa, mais precisa será a estimativa.
        </p>
        <p style={{ fontFamily: 'Inter', fontSize: '12px', color: '#64748B', lineHeight: 1.7, marginTop: '10px' }}>
          <strong style={{ color: '#7EB0FF' }}>Importante:</strong> os valores exibidos são{' '}
          <strong style={{ color: '#7EB0FF' }}>estimativas analíticas de apoio à decisão</strong>,
          geradas por IA a partir do modelo FAIR e da legislação aplicável — não são números
          contábeis oficiais nem substituem uma avaliação financeira formal.
        </p>
      </Card>

      {loading ? (
        <div style={{ color: '#64748B', fontFamily: 'Raleway', letterSpacing: '0.2em' }}>CARREGANDO...</div>
      ) : (
        <>
          {/* Perfil da empresa */}
          <Card style={{ marginBottom: '24px' }}>
            <div style={{
              fontFamily: 'Raleway', fontSize: '12px', fontWeight: '600', color: '#64748B',
              letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '20px',
            }}>Perfil da empresa</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>Setor de atuação</label>
                <select value={profile.sector || ''} onChange={set('sector')} style={fieldStyle}>
                  {sectors.map(s => <option key={s} value={s} style={{ background: '#0C1220' }}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Faturamento anual</label>
                <input
                  type="text"
                  value={profile.annual_revenue || ''}
                  onChange={set('annual_revenue')}
                  placeholder="R$ 5.000.000,00"
                  style={fieldStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Volume de dados sensíveis / PII</label>
                <select value={profile.sensitive_data_volume || ''} onChange={set('sensitive_data_volume')} style={fieldStyle}>
                  {dataVolumes.map(v => <option key={v} value={v} style={{ background: '#0C1220' }}>{v}</option>)}
                  {profile.sensitive_data_volume && !dataVolumes.includes(profile.sensitive_data_volume) && (
                    <option value={profile.sensitive_data_volume} style={{ background: '#0C1220' }}>
                      {profile.sensitive_data_volume}
                    </option>
                  )}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Regulamentações aplicáveis</label>
                <input
                  type="text"
                  value={profile.regulations || ''}
                  onChange={set('regulations')}
                  placeholder="LGPD"
                  style={fieldStyle}
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Contexto operacional adicional</label>
              <textarea
                value={profile.operational_context || ''}
                onChange={set('operational_context')}
                rows={3}
                placeholder="Ex: processamos pagamentos com cartão, temos 3 mil clientes ativos, banco isolado da internet. Quanto mais detalhes, mais precisa a estimativa."
                style={{ ...fieldStyle, resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  background: 'linear-gradient(135deg, #2563EB 0%, #4F8EF7 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 28px',
                  color: '#060810',
                  fontFamily: 'Raleway',
                  fontSize: '12px',
                  fontWeight: '700',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  opacity: saving ? 0.5 : 1,
                }}
              >
                {saving ? 'SALVANDO...' : 'SALVAR PERFIL'}
              </button>
              {savedMsg && (
                <span style={{
                  fontFamily: 'Inter',
                  fontSize: '12px',
                  color: savedMsg.startsWith('✓') ? '#22C55E' : '#EF4444',
                }}>{savedMsg}</span>
              )}
            </div>
          </Card>

          {/* Avaliações de risco */}
          <div style={{
            fontFamily: 'Raleway', fontSize: '12px', fontWeight: '600', color: '#64748B',
            letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px',
          }}>Avaliações de risco geradas</div>

          {assessments.length === 0 ? (
            <Card>
              <div style={{ color: '#64748B', textAlign: 'center', padding: '32px', fontFamily: 'Raleway' }}>
                Nenhuma avaliação ainda. Vá para <strong style={{ color: '#4F8EF7' }}>Alertas</strong> e
                clique em "Mapear Risco" em qualquer alerta para gerar a primeira estimativa.
              </div>
            </Card>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {assessments.map(a => (
                <Card key={a.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
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
                    }}>ALERTA #{a.alert_id}</span>
                  </div>

                  {/* Impacto financeiro em destaque (so quando o risco foi mapeado) */}
                  {a.financial_impact_min ? (
                    <div style={{
                      background: 'linear-gradient(135deg, #131D35 0%, #0C1220 100%)',
                      border: '1px solid #4F8EF740',
                      borderRadius: '16px',
                      padding: '20px 24px',
                      marginBottom: '20px',
                    }}>
                      <div style={{
                        fontFamily: 'Raleway', fontSize: '11px', color: '#64748B',
                        letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '10px',
                      }}>Impacto financeiro estimado</div>
                      <div style={{
                        fontFamily: "'Space Grotesk', serif",
                        fontSize: '26px',
                        fontWeight: '700',
                        color: '#7EB0FF',
                        lineHeight: 1.3,
                      }}>
                        {a.financial_impact_min} — {a.financial_impact_max}
                      </div>
                    </div>
                  ) : (
                    <div style={{
                      background: '#060810', border: '1px solid #1E2A42', borderRadius: '10px',
                      padding: '14px 16px', marginBottom: '20px',
                      fontFamily: 'Inter', fontSize: '12px', color: '#64748B',
                    }}>
                      Estimativa financeira ainda não gerada — clique em "Mapear Risco" na aba Alertas.
                    </div>
                  )}

                  {/* LGPD + downtime */}
                  {a.financial_impact_min && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                    <div style={{ background: '#060810', border: '1px solid #1E2A42', borderRadius: '10px', padding: '14px 16px' }}>
                      <div style={{ fontFamily: 'Raleway', fontSize: '10px', color: '#64748B', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '6px' }}>Multa LGPD estimada</div>
                      <div style={{ fontFamily: 'JetBrains Mono', fontSize: '14px', color: '#E2E8F0' }}>{a.lgpd_fine_estimate || '—'}</div>
                    </div>
                    <div style={{ background: '#060810', border: '1px solid #1E2A42', borderRadius: '10px', padding: '14px 16px' }}>
                      <div style={{ fontFamily: 'Raleway', fontSize: '10px', color: '#64748B', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '6px' }}>Custo de inatividade</div>
                      <div style={{ fontFamily: 'JetBrains Mono', fontSize: '14px', color: '#E2E8F0' }}>{a.downtime_cost_estimate || '—'}</div>
                    </div>
                  </div>
                  )}

                  {/* SLA de Compliance — só aparece depois de calculado */}
                  {a.sla_deadline && (
                    <div style={{
                      background: '#060810',
                      border: `1px solid ${(complianceColors[a.compliance_risk_level] || '#1E2A42')}40`,
                      borderRadius: '10px',
                      padding: '16px 18px',
                      marginBottom: '20px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
                        <div style={{
                          fontFamily: 'Raleway', fontSize: '10px', color: '#64748B',
                          letterSpacing: '0.15em', textTransform: 'uppercase',
                        }}>Prazo de correção (SLA)</div>
                        {a.compliance_risk_level && (
                          <span style={{
                            background: `${complianceColors[a.compliance_risk_level] || '#64748B'}20`,
                            color: complianceColors[a.compliance_risk_level] || '#64748B',
                            border: `1px solid ${complianceColors[a.compliance_risk_level] || '#64748B'}40`,
                            borderRadius: '4px',
                            padding: '2px 8px',
                            fontSize: '10px',
                            fontFamily: 'Raleway',
                            fontWeight: '700',
                            letterSpacing: '0.1em',
                          }}>RISCO DE COMPLIANCE: {a.compliance_risk_level}</span>
                        )}
                      </div>
                      <div style={{
                        fontFamily: "'Space Grotesk', serif",
                        fontSize: '20px',
                        fontWeight: '700',
                        color: '#7EB0FF',
                        marginBottom: '10px',
                      }}>{a.sla_deadline}</div>
                      {a.sla_reasoning && (
                        <p style={{ fontFamily: 'Inter', fontSize: '12px', color: '#64748B', lineHeight: 1.7 }}>
                          {a.sla_reasoning}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Raciocínio FAIR */}
                  {a.fair_reasoning && (
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ fontFamily: 'Raleway', fontSize: '11px', fontWeight: '600', color: '#64748B', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>
                        Raciocínio da estimativa (FAIR)
                      </div>
                      <p style={{ fontFamily: 'Inter', fontSize: '13px', color: '#E2E8F0', lineHeight: 1.7 }}>
                        {a.fair_reasoning}
                      </p>
                    </div>
                  )}

                  {/* Blast radius */}
                  {a.blast_radius?.nodes?.length > 0 && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <div style={{ fontFamily: 'Raleway', fontSize: '11px', fontWeight: '600', color: '#64748B', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                        Blast radius — propagação simulada
                      </div>
                      <div style={{ display: 'flex', gap: '14px', fontFamily: 'Raleway', fontSize: '10px' }}>
                        <span style={{ color: '#EF4444' }}>● ponto de entrada</span>
                        <span style={{ color: '#64748B' }}>● movimento lateral</span>
                        <span style={{ color: '#7EB0FF' }}>● ativo crítico</span>
                      </div>
                    </div>
                    <BlastRadius blastRadius={a.blast_radius} />
                  </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
