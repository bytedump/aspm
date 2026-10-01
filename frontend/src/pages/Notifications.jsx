import { useState, useEffect } from 'react'
import Card from '../components/Card'
import { getMe, saveDiscordWebhook, testDiscordWebhook } from '../services/api'

const labelStyle = {
  fontFamily: 'Raleway', fontSize: '11px', fontWeight: '600', color: '#64748B',
  letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px', display: 'block',
}

const fieldStyle = {
  width: '100%', background: '#060810', border: '1px solid #1E2A42',
  borderRadius: '10px', padding: '11px 13px', color: '#E2E8F0',
  fontSize: '12px', fontFamily: "'JetBrains Mono', monospace",
  outline: 'none', transition: 'all 0.2s ease',
}

export default function Notifications() {
  const [webhookUrl, setWebhookUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    getMe()
      .then(res => setWebhookUrl(res.data.discord_webhook_url || ''))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setResult(null)
    try {
      await saveDiscordWebhook(webhookUrl)
      setResult({ ok: true, msg: '✓ Webhook salvo — novos alertas serão notificados no seu canal.' })
    } catch (e) {
      setResult({ ok: false, msg: e.response?.data?.detail || '✗ Não foi possível salvar o webhook.' })
    } finally {
      setSaving(false)
    }
  }

  const handleTest = async () => {
    setTesting(true)
    setResult(null)
    try {
      await testDiscordWebhook()
      setResult({ ok: true, msg: '✓ Notificação de teste enviada — confira o canal no Discord.' })
    } catch (e) {
      setResult({ ok: false, msg: e.response?.data?.detail || '✗ Falha ao enviar — verifique a URL.' })
    } finally {
      setTesting(false)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontFamily: "'Space Grotesk', serif", fontSize: '24px', fontWeight: '600',
          color: '#E2E8F0', letterSpacing: '0.05em', marginBottom: '4px',
        }}>Notificações</h1>
        <p style={{ color: '#64748B', fontFamily: 'Raleway', fontSize: '13px' }}>
          Receba alertas novos direto no seu canal do Discord
        </p>
      </div>

      <Card style={{ marginBottom: '24px', borderLeft: '2px solid #2563EB' }}>
        <div style={{ ...labelStyle, marginBottom: '10px' }}>Como obter a URL do webhook</div>
        <p style={{ fontFamily: 'Inter', fontSize: '13px', color: '#E2E8F0', lineHeight: 1.8 }}>
          No Discord, abra as <strong style={{ color: '#7EB0FF' }}>Configurações do Canal</strong> →{' '}
          <strong style={{ color: '#7EB0FF' }}>Integrações</strong> →{' '}
          <strong style={{ color: '#7EB0FF' }}>Webhooks</strong> →{' '}
          <strong style={{ color: '#7EB0FF' }}>Criar Webhook</strong> → copie a URL gerada e cole abaixo.
        </p>
      </Card>

      <Card>
        <label style={labelStyle}>URL do webhook</label>
        {loading ? (
          <div style={{ color: '#64748B', fontFamily: 'Raleway', letterSpacing: '0.2em' }}>CARREGANDO...</div>
        ) : (
          <>
            <input
              type="text"
              value={webhookUrl}
              onChange={e => setWebhookUrl(e.target.value)}
              placeholder="https://discord.com/api/webhooks/..."
              style={{ ...fieldStyle, marginBottom: '16px' }}
              onFocus={e => { e.currentTarget.style.borderColor = '#4F8EF7' }}
              onBlur={e => { e.currentTarget.style.borderColor = '#1E2A42' }}
            />

            {result && (
              <div style={{
                background: result.ok ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                border: `1px solid ${result.ok ? '#22C55E' : '#EF4444'}40`,
                borderRadius: '10px', padding: '10px 12px',
                color: result.ok ? '#22C55E' : '#EF4444',
                fontFamily: 'Inter', fontSize: '12px', marginBottom: '16px',
              }}>{result.msg}</div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleSave}
                disabled={saving || !webhookUrl.trim()}
                style={{
                  background: 'linear-gradient(135deg, #2563EB 0%, #4F8EF7 100%)',
                  border: 'none', borderRadius: '10px', padding: '11px 28px',
                  color: '#060810', fontFamily: 'Raleway', fontSize: '12px',
                  fontWeight: '700', letterSpacing: '0.08em', cursor: 'pointer',
                  opacity: (saving || !webhookUrl.trim()) ? 0.5 : 1,
                }}
              >
                {saving ? 'SALVANDO...' : 'SALVAR'}
              </button>
              <button
                onClick={handleTest}
                disabled={testing || !webhookUrl.trim()}
                style={{
                  background: 'transparent', border: '1px solid rgba(79, 142, 247, 0.3)',
                  borderRadius: '10px', padding: '11px 24px', color: '#4F8EF7',
                  fontFamily: 'Raleway', fontSize: '12px', fontWeight: '600',
                  letterSpacing: '0.08em', cursor: 'pointer',
                  opacity: (testing || !webhookUrl.trim()) ? 0.5 : 1,
                }}
              >
                {testing ? 'ENVIANDO...' : 'TESTAR NOTIFICAÇÃO'}
              </button>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
