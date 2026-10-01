import { useState } from 'react'
import Card from '../components/Card'
import { sendContact } from '../services/api'

const labelStyle = {
  fontFamily: 'Raleway', fontSize: '11px', fontWeight: '600', color: '#64748B',
  letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px', display: 'block',
}

const fieldStyle = {
  width: '100%', background: '#060810', border: '1px solid #1E2A42',
  borderRadius: '10px', padding: '11px 13px', color: '#E2E8F0',
  fontSize: '13px', fontFamily: 'Inter', outline: 'none', transition: 'all 0.2s ease',
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState(null)

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setResult(null)
    try {
      await sendContact(form)
      setResult({ ok: true, msg: '✓ Mensagem enviada com sucesso — responderemos no e-mail informado.' })
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      setResult({ ok: false, msg: err.response?.data?.detail || '✗ Não foi possível enviar a mensagem.' })
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontFamily: "'Space Grotesk', serif", fontSize: '24px', fontWeight: '600',
          color: '#E2E8F0', letterSpacing: '0.05em', marginBottom: '4px',
        }}>Contato</h1>
        <p style={{ color: '#64748B', fontFamily: 'Raleway', fontSize: '13px' }}>
          Fale com a equipe da Risklayer Security
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Nome</label>
              <input
                type="text" value={form.name} onChange={set('name')} required style={fieldStyle}
                onFocus={e => { e.currentTarget.style.borderColor = '#4F8EF7' }}
                onBlur={e => { e.currentTarget.style.borderColor = '#1E2A42' }}
              />
            </div>
            <div>
              <label style={labelStyle}>E-mail</label>
              <input
                type="email" value={form.email} onChange={set('email')} required style={fieldStyle}
                onFocus={e => { e.currentTarget.style.borderColor = '#4F8EF7' }}
                onBlur={e => { e.currentTarget.style.borderColor = '#1E2A42' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Assunto</label>
            <input
              type="text" value={form.subject} onChange={set('subject')} required style={fieldStyle}
              onFocus={e => { e.currentTarget.style.borderColor = '#4F8EF7' }}
              onBlur={e => { e.currentTarget.style.borderColor = '#1E2A42' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Mensagem</label>
            <textarea
              value={form.message} onChange={set('message')} required rows={6}
              style={{ ...fieldStyle, resize: 'vertical' }}
              onFocus={e => { e.currentTarget.style.borderColor = '#4F8EF7' }}
              onBlur={e => { e.currentTarget.style.borderColor = '#1E2A42' }}
            />
          </div>

          {result && (
            <div style={{
              background: result.ok ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              border: `1px solid ${result.ok ? '#22C55E' : '#EF4444'}40`,
              borderRadius: '10px', padding: '10px 12px',
              color: result.ok ? '#22C55E' : '#EF4444',
              fontFamily: 'Inter', fontSize: '12px', marginBottom: '16px',
            }}>{result.msg}</div>
          )}

          <button
            type="submit" disabled={sending}
            style={{
              background: 'linear-gradient(135deg, #2563EB 0%, #4F8EF7 100%)',
              border: 'none', borderRadius: '10px', padding: '12px 32px',
              color: '#060810', fontFamily: 'Raleway', fontSize: '13px',
              fontWeight: '700', letterSpacing: '0.1em', cursor: 'pointer',
              opacity: sending ? 0.5 : 1,
            }}
          >
            {sending ? 'ENVIANDO...' : 'ENVIAR'}
          </button>
        </form>
      </Card>
    </div>
  )
}
