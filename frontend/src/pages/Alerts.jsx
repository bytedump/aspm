import { useState, useEffect } from 'react'
import SeverityBadge from '../components/SeverityBadge'
import Card from '../components/Card'
import { getAlerts, remediate, createPR, createRiskAssessment, createSLAAssessment } from '../services/api'
import { generateAlertsReport } from '../utils/pdfReport'
import { useTranslation } from 'react-i18next'
import { useDemoMode, demoDelay } from '../context/DemoContext'
import DemoSendForm from '../components/DemoSendForm'

const severities = ['TODAS', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO']
const tools = ['TODAS', 'semgrep', 'trivy']

const formatDate = (isoString) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  return date.toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

// Security Health Score — puramente frontend, derivado dos alertas em tela
const calculateHealthScore = (alerts) => {
  const critical = alerts.filter(a => a.severity_adjusted === 'CRITICAL').length
  const high = alerts.filter(a => a.severity_adjusted === 'HIGH').length
  const medium = alerts.filter(a => a.severity_adjusted === 'MEDIUM').length
  const score = Math.max(0, 100 - (critical * 25) - (high * 10) - (medium * 5))
  let grade, color, labelKey
  if (score >= 90) { grade = 'A'; color = '#22C55E'; labelKey = 'alerts.gradeExcellent' }
  else if (score >= 70) { grade = 'B'; color = '#4F8EF7'; labelKey = 'alerts.gradeAttention' }
  else { grade = 'F'; color = '#EF4444'; labelKey = 'alerts.gradeCritical' }
  return { score, grade, color, labelKey }
}

export default function Alerts() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [severityFilter, setSeverityFilter] = useState('TODAS')
  const [toolFilter, setToolFilter] = useState('TODAS')
  const [actionLoading, setActionLoading] = useState({})
  const [messages, setMessages] = useState({})
  const { isDemoMode, demoAlertList, addDemoAlert } = useDemoMode()
  const { t } = useTranslation()

  const fetchAlerts = async () => {
    // MODO DEMO: filtra os dados ficticios localmente, sem tocar na API
    

    const params = {}
    if (severityFilter !== 'TODAS') params.severity = severityFilter
    if (toolFilter !== 'TODAS') params.source_tool = toolFilter
    getAlerts(params)
      .then(res => setAlerts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchAlerts() }, [severityFilter, toolFilter, isDemoMode, demoAlertList])

  /** No Modo Demo, as acoes simulam sucesso sem chamar a API. */
  const runDemoAction = async (alertId, key, message) => {
    setActionLoading(p => ({ ...p, [`${key}_${alertId}`]: true }))
    await demoDelay(400)
    setMessages(p => ({ ...p, [alertId]: message }))
    setActionLoading(p => ({ ...p, [`${key}_${alertId}`]: false }))
  }

  const handleRemediate = async (alertId) => {
    if (isDemoMode) return runDemoAction(alertId, 'rem', '✓ Remediação gerada — patch e teste unitário prontos')
    setActionLoading(p => ({ ...p, [`rem_${alertId}`]: true }))
    try {
      await remediate(alertId)
      setMessages(p => ({ ...p, [alertId]: '✓ Remediação gerada' }))
    } catch (e) {
      const msg = e.response?.data?.detail || 'Erro ao remediar'
      setMessages(p => ({ ...p, [alertId]: `✗ ${msg}` }))
    } finally {
      setActionLoading(p => ({ ...p, [`rem_${alertId}`]: false }))
    }
  }

  const handleCreatePR = async (alertId) => {
    if (isDemoMode) return runDemoAction(alertId, 'pr', '✓ PR criado: https://github.com/acme-corp/checkout-api/pull/43')
    setActionLoading(p => ({ ...p, [`pr_${alertId}`]: true }))
    try {
      const res = await createPR(alertId)
      setMessages(p => ({ ...p, [alertId]: `✓ PR criado: ${res.data.pr_url}` }))
    } catch (e) {
      // 401 = credencial do GitHub invalida/expirada: nao e erro do usuario,
      // e configuracao pendente da equipe. Mensagem diferenciada e amigavel.
      if (e.response?.status === 401) {
        setMessages(p => ({
          ...p,
          [alertId]: '⚠ Configuração pendente — token do GitHub precisa ser atualizado (ação da equipe)',
        }))
      } else {
        const msg = e.response?.data?.detail || 'Erro ao criar PR'
        setMessages(p => ({ ...p, [alertId]: `✗ ${msg}` }))
      }
    } finally {
      setActionLoading(p => ({ ...p, [`pr_${alertId}`]: false }))
    }
  }

  const handleMapRisk = async (alertId) => {
    if (isDemoMode) return runDemoAction(alertId, 'risk', '✓ Risco mapeado — ver aba Risco Real')
    setActionLoading(p => ({ ...p, [`risk_${alertId}`]: true }))
    try {
      await createRiskAssessment(alertId)
      setMessages(p => ({ ...p, [alertId]: '✓ Risco mapeado — ver aba Risco Real' }))
    } catch (e) {
      const msg = e.response?.data?.detail || 'Erro ao mapear risco'
      setMessages(p => ({ ...p, [alertId]: `✗ ${msg}` }))
    } finally {
      setActionLoading(p => ({ ...p, [`risk_${alertId}`]: false }))
    }
  }

  const handleViewSLA = async (alertId) => {
    if (isDemoMode) return runDemoAction(alertId, 'sla', '✓ SLA calculado — ver aba Risco Real')
    setActionLoading(p => ({ ...p, [`sla_${alertId}`]: true }))
    try {
      await createSLAAssessment(alertId)
      setMessages(p => ({ ...p, [alertId]: '✓ SLA calculado — ver aba Risco Real' }))
    } catch (e) {
      const msg = e.response?.data?.detail || 'Erro ao calcular SLA'
      setMessages(p => ({ ...p, [alertId]: `✗ ${msg}` }))
    } finally {
      setActionLoading(p => ({ ...p, [`sla_${alertId}`]: false }))
    }
  }

  const filterBtnStyle = (active) => ({
    background: active ? 'rgba(79, 142, 247, 0.15)' : 'transparent',
    border: `1px solid ${active ? '#4F8EF7' : '#1E2A42'}`,
    borderRadius: '10px',
    padding: '5px 12px',
    color: active ? '#4F8EF7' : '#64748B',
    fontFamily: "'Raleway', sans-serif",
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.08em',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  })

  const health = calculateHealthScore(alerts)

  return (
    <div>
      {isDemoMode && <DemoSendForm onSend={addDemoAlert} />}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
        <div>
        <h1 style={{
          fontFamily: "'Space Grotesk', serif",
          fontSize: '24px',
          color: '#E2E8F0',
          letterSpacing: '0.05em',
          marginBottom: '4px',
        }}>{t('alerts.title')}</h1>
        <p style={{ color: '#64748B', fontFamily: 'Raleway', fontSize: '13px' }}>
          {t('alerts.found', { count: alerts.length })}
        </p>

        {/* Security Health Score — compacto, complementa o cabecalho */}
        {!loading && alerts.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: `${health.color}20`,
              border: `1px solid ${health.color}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Space Grotesk', serif", fontSize: '14px', fontWeight: '700',
              color: health.color, flexShrink: 0,
            }}>{health.grade}</div>
            <div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', color: '#E2E8F0' }}>
                {health.score}/100
              </div>
              <div style={{
                fontFamily: 'Raleway', fontSize: '9px', color: health.color,
                letterSpacing: '0.12em', textTransform: 'uppercase',
              }}>{t('alerts.healthScore')} · {t(health.labelKey)}</div>
            </div>
          </div>
        )}
        </div>

        
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ color: '#64748B', fontSize: '11px', fontFamily: 'Raleway', letterSpacing: '0.1em', marginRight: '4px' }}>{t('alerts.severity')}</span>
          {severities.map(s => (
            <button key={s} style={filterBtnStyle(severityFilter === s)} onClick={() => setSeverityFilter(s)}>
              {s === 'TODAS' ? t('alerts.all') : s}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ color: '#64748B', fontSize: '11px', fontFamily: 'Raleway', letterSpacing: '0.1em', marginRight: '4px' }}>{t('alerts.tool')}</span>
          {tools.map(tool => (
            <button key={tool} style={filterBtnStyle(toolFilter === tool)} onClick={() => setToolFilter(tool)}>
              {tool === 'TODAS' ? t('alerts.all') : tool.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <div style={{ color: '#64748B', fontFamily: 'Raleway', letterSpacing: '0.2em' }}>{t('common.loading')}</div>
      ) : alerts.length === 0 ? (
        <Card>
          <div style={{ color: '#64748B', textAlign: 'center', padding: '32px', fontFamily: 'Raleway' }}>
            {t('alerts.empty')}
          </div>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {alerts.map(alert => (
            <div key={alert.id} style={{
              background: '#0C1220',
              border: '1px solid #1E2A42',
              borderRadius: '16px',
              padding: '16px 20px',
              transition: 'all 0.2s ease',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <SeverityBadge severity={alert.severity_adjusted || alert.severity} />
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: 'Inter',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#E2E8F0',
                    marginBottom: '4px',
                  }}>{alert.title}</div>
                  <div style={{
                    fontFamily: 'JetBrains Mono',
                    fontSize: '10px',
                    color: '#64748B',
                    marginBottom: '2px',
                  }}>
                    {formatDate(alert.created_at)}
                  </div>
                  <div style={{
                    fontFamily: 'JetBrains Mono',
                    fontSize: '11px',
                    color: '#64748B',
                  }}>
                    {alert.repository}{alert.file_path ? ` · ${alert.file_path}` : ''}{alert.line_number ? `:${alert.line_number}` : ''}
                  </div>
                  {messages[alert.id] && (
                    <div style={{
                      marginTop: '8px',
                      fontSize: '11px',
                      color: messages[alert.id].startsWith('✓') ? '#22C55E' : '#EF4444',
                      fontFamily: 'Inter',
                      wordBreak: 'break-all',
                    }}>{messages[alert.id]}</div>
                  )}
                </div>
                
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


