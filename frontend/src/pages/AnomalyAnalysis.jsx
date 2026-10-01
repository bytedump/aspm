import { useState, useEffect } from 'react'
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import Card from '../components/Card'
import { getAnomalyAnalysis, getAlerts } from '../services/api'
import { useDemoMode, demoDelay } from '../context/DemoContext'
import { demoAnomalyAnalysis, demoAlerts } from '../data/demoData'

export default function AnomalyAnalysis() {
  const [data, setData] = useState(null)
  const [alertsById, setAlertsById] = useState({})
  const [loading, setLoading] = useState(true)
  const { isDemoMode } = useDemoMode()

  const fetchAnalysis = () => {
    setLoading(true)

    // MODO DEMO: analise ficticia local, sem chamada de API
    if (isDemoMode) {
      demoDelay().then(() => {
        setData(demoAnomalyAnalysis)
        const byId = {}
        for (const a of demoAlerts) byId[a.id] = a
        setAlertsById(byId)
        setLoading(false)
      })
      return
    }

    Promise.all([getAnomalyAnalysis(), getAlerts()])
      .then(([analysisRes, alertsRes]) => {
        setData(analysisRes.data)
        const byId = {}
        for (const a of alertsRes.data) byId[a.id] = a
        setAlertsById(byId)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchAnalysis() }, [isDemoMode])

  const scores = data?.scores || {}
  const points = Object.entries(scores).map(([id, s], idx) => ({
    index: idx + 1,
    alertId: Number(id),
    score: s.anomaly_score,
    isAnomaly: s.is_anomaly,
    title: alertsById[id]?.title || `Alerta #${id}`,
  }))
  const normals = points.filter(p => !p.isAnomaly)
  const anomalies = points.filter(p => p.isAnomaly)

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
        }}>Análise de Anomalias</h1>
        <p style={{ color: '#64748B', fontFamily: 'Raleway', fontSize: '13px' }}>
          Identificação automática de comportamentos fora do padrão no seu ambiente
        </p>
      </div>

      {/* Cabeçalho explicativo — consultivo, não substitui o Módulo 3 */}
      <Card style={{ marginBottom: '24px', borderLeft: '2px solid #2563EB' }}>
        <p style={{ fontFamily: 'Inter', fontSize: '13px', color: '#E2E8F0', lineHeight: 1.7 }}>
          Esta análise aplica um algoritmo de Machine Learning não-supervisionado (Isolation Forest)
          sobre o conjunto atual de alertas, identificando quais fogem estatisticamente do padrão.
          Este é um <strong style={{ color: '#7EB0FF' }}>sinal consultivo</strong> — a priorização
          oficial de severidade continua sendo feita pelas regras determinísticas de contexto IaC.
        </p>
      </Card>

      {loading ? (
        <div style={{ color: '#64748B', fontFamily: 'Raleway', letterSpacing: '0.2em' }}>CARREGANDO...</div>
      ) : !data ? (
        <Card>
          <div style={{ color: '#EF4444', textAlign: 'center', padding: '32px', fontFamily: 'Raleway' }}>
            Não foi possível carregar a análise. Verifique se a API está no ar.
          </div>
        </Card>
      ) : !data.trained ? (
        /* Dados insuficientes — comportamento esperado, não é erro */
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 24px' }}>
            <div style={{ fontSize: '28px', marginBottom: '12px', color: '#64748B' }}>⟡</div>
            <div style={{
              fontFamily: "'Space Grotesk', serif",
              fontSize: '16px',
              color: '#7EB0FF',
              letterSpacing: '0.05em',
              marginBottom: '8px',
            }}>Volume de dados insuficiente</div>
            <p style={{ fontFamily: 'Inter', fontSize: '13px', color: '#64748B', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
              O Isolation Forest precisa de um volume mínimo de alertas (10) para gerar uma análise
              estatística confiável. {data.reason}. Conforme novos scans chegarem pelo pipeline,
              esta análise se tornará disponível automaticamente.
            </p>
          </div>
        </Card>
      ) : (
        <>
          {/* Card de status do modelo */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <Card>
              <div style={{ fontFamily: 'Raleway', fontSize: '11px', fontWeight: '500', color: '#64748B', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '10px' }}>Modelo</div>
              <div style={{ fontFamily: "'Space Grotesk', serif", fontSize: '20px', color: '#22C55E' }}>TREINADO ✓</div>
            </Card>
            <Card>
              <div style={{ fontFamily: 'Raleway', fontSize: '11px', fontWeight: '500', color: '#64748B', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '10px' }}>Alertas analisados</div>
              <div style={{ fontFamily: "'Space Grotesk', serif", fontSize: '28px', fontWeight: '700', color: '#E2E8F0' }}>{data.total_analyzed}</div>
            </Card>
            <Card style={{ background: 'linear-gradient(135deg, #131D35 0%, #0C1220 100%)', border: '1px solid #4F8EF740' }}>
              <div style={{ fontFamily: 'Raleway', fontSize: '11px', fontWeight: '500', color: '#64748B', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '10px' }}>Anomalias encontradas</div>
              <div style={{ fontFamily: "'Space Grotesk', serif", fontSize: '28px', fontWeight: '700', color: '#7EB0FF' }}>{data.anomalies_found}</div>
            </Card>
          </div>

          {/* Scatter plot */}
          <Card style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ fontFamily: 'Raleway', fontSize: '12px', fontWeight: '600', color: '#64748B', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                Dispersão de scores de anomalia
              </div>
              <div style={{ display: 'flex', gap: '16px', fontFamily: 'Raleway', fontSize: '11px' }}>
                <span style={{ color: '#64748B' }}>● dentro do padrão</span>
                <span style={{ color: '#7EB0FF' }}>● anômalo</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                <XAxis
                  type="number"
                  dataKey="index"
                  name="Alerta"
                  tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'Inter' }}
                  axisLine={{ stroke: '#1E2A42' }}
                  tickLine={false}
                  label={{ value: 'índice do alerta', position: 'insideBottom', offset: -5, fill: '#64748B', fontSize: 11, fontFamily: 'Raleway' }}
                />
                <YAxis
                  type="number"
                  dataKey="score"
                  name="Score"
                  tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'Inter' }}
                  axisLine={{ stroke: '#1E2A42' }}
                  tickLine={false}
                  label={{ value: 'anomaly score', angle: -90, position: 'insideLeft', fill: '#64748B', fontSize: 11, fontFamily: 'Raleway' }}
                />
                <ReferenceLine y={0} stroke="#2563EB" strokeDasharray="4 4" />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3', stroke: '#2563EB' }}
                  contentStyle={{
                    background: '#0C1220',
                    border: '1px solid #1E2A42',
                    borderRadius: '10px',
                    color: '#E2E8F0',
                    fontFamily: 'Inter',
                    fontSize: '12px',
                  }}
                  formatter={(value, name) => [value, name === 'score' ? 'anomaly score' : name]}
                  labelFormatter={() => ''}
                  content={({ payload }) => {
                    if (!payload || !payload.length) return null
                    const p = payload[0].payload
                    return (
                      <div style={{ background: '#0C1220', border: '1px solid #1E2A42', borderRadius: '10px', padding: '10px 12px', fontFamily: 'Inter', fontSize: '12px' }}>
                        <div style={{ color: '#E2E8F0', marginBottom: '4px', maxWidth: '260px' }}>{p.title}</div>
                        <div style={{ color: p.isAnomaly ? '#7EB0FF' : '#64748B', fontFamily: 'JetBrains Mono', fontSize: '11px' }}>
                          score: {p.score} {p.isAnomaly ? '· ANÔMALO ⟡' : ''}
                        </div>
                      </div>
                    )
                  }}
                />
                <Scatter name="Dentro do padrão" data={normals} fill="#64748B" />
                <Scatter
                  name="Anômalo"
                  data={anomalies}
                  fill="#7EB0FF"
                  shape={(props) => (
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={7}
                      fill="#7EB0FF"
                      style={{ filter: 'drop-shadow(0 0 6px rgba(234, 179, 8, 0.8))' }}
                    />
                  )}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </Card>

          {/* Lista de alertas anômalos */}
          <Card style={{ marginBottom: '24px' }}>
            <div style={{ fontFamily: 'Raleway', fontSize: '12px', fontWeight: '600', color: '#64748B', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px' }}>
              Alertas estatisticamente incomuns
            </div>
            {anomalies.length === 0 ? (
              <div style={{ color: '#64748B', fontFamily: 'Inter', fontSize: '13px' }}>
                Nenhuma anomalia detectada na base atual — todos os alertas seguem o padrão estatístico.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {anomalies.map(p => (
                  <div key={p.alertId} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '12px 16px',
                    background: '#060810',
                    border: '1px solid #4F8EF7',
                    borderRadius: '10px',
                    boxShadow: '0 0 12px rgba(79, 142, 247, 0.15)',
                  }}>
                    <span style={{ fontSize: '16px', color: '#7EB0FF', flexShrink: 0 }}>⟡</span>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ fontFamily: 'Inter', fontSize: '13px', color: '#E2E8F0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.title}
                      </div>
                      <div style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: '#64748B' }}>
                        Alerta #{p.alertId}
                      </div>
                    </div>
                    <span style={{
                      background: 'rgba(234, 179, 8, 0.12)',
                      color: '#7EB0FF',
                      border: '1px solid #7EB0FF40',
                      borderRadius: '4px',
                      padding: '3px 10px',
                      fontFamily: 'JetBrains Mono',
                      fontSize: '11px',
                      flexShrink: 0,
                    }}>score {p.score}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}

      {/* Botão de reexecutar */}
      {!loading && (
        <button
          onClick={fetchAnalysis}
          disabled={loading}
          style={{
            background: 'rgba(79, 142, 247, 0.1)',
            border: '1px solid rgba(79, 142, 247, 0.3)',
            borderRadius: '10px',
            padding: '10px 24px',
            color: '#4F8EF7',
            fontFamily: 'Raleway',
            fontSize: '12px',
            fontWeight: '600',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#4F8EF7' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(79, 142, 247, 0.3)' }}
        >
          {loading ? 'REEXECUTANDO...' : '⟳ REEXECUTAR ANÁLISE'}
        </button>
      )}
    </div>
  )
}
