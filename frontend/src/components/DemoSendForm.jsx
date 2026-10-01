import { useState } from 'react'

const fieldStyle = {
  background: '#060810',
  border: '1px solid #1E2A42',
  borderRadius: '10px',
  padding: '8px 10px',
  color: '#E2E8F0',
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '12px',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
}

const labelStyle = {
  display: 'block',
  fontFamily: 'Raleway, sans-serif',
  fontSize: '10px',
  letterSpacing: '0.12em',
  color: '#64748B',
  marginBottom: '4px',
  textTransform: 'uppercase',
}

/**
 * Painel do Modo Demo: simula o "envio" de uma vulnerabilidade.
 * Nao chama nenhuma API — o alerta entra so na lista local do Modo Demo.
 */
export default function DemoSendForm({ onSend }) {
  const [title, setTitle] = useState('Senha hardcoded no codigo')
  const [filePath, setFilePath] = useState('app/login.py')
  const [severity, setSeverity] = useState('CRITICAL')
  const [sent, setSent] = useState(false)

  const handleSend = () => {
    if (!title.trim()) return
    onSend({ title: title.trim(), file_path: filePath.trim() || 'app/main.py', severity })
    setSent(true)
    setTimeout(() => setSent(false), 3500)
  }

  return (
    <div style={{
      border: '1px solid #1E2A42',
      background: 'rgba(79, 142, 247, 0.04)',
      borderRadius: '10px',
      padding: '16px',
      marginBottom: '24px',
    }}>
      <div style={{
        fontFamily: "'Space Grotesk', serif", fontSize: '14px', color: '#4F8EF7',
        letterSpacing: '0.08em', marginBottom: '2px',
      }}>
        ENVIAR VULNERABILIDADE
      </div>
      <div style={{ fontFamily: 'Raleway, sans-serif', fontSize: '11px', color: '#64748B', marginBottom: '14px' }}>
        Simulacao do Modo Demo — o alerta aparece na lista abaixo, sem servidor.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr auto', gap: '12px', alignItems: 'end' }}>
        <div>
          <label style={labelStyle}>Vulnerabilidade</label>
          <input style={fieldStyle} value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Arquivo</label>
          <input style={fieldStyle} value={filePath} onChange={e => setFilePath(e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Gravidade</label>
          <select style={fieldStyle} value={severity} onChange={e => setSeverity(e.target.value)}>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
        </div>
        <button
          onClick={handleSend}
          style={{
            background: '#4F8EF7', color: '#060810', border: 'none', borderRadius: '10px',
            padding: '9px 16px', fontFamily: 'Raleway, sans-serif', fontSize: '11px',
            fontWeight: 700, letterSpacing: '0.1em', cursor: 'pointer', whiteSpace: 'nowrap',
          }}
        >
          ENVIAR
        </button>
      </div>

      {sent && (
        <div style={{ marginTop: '12px', fontFamily: 'Raleway, sans-serif', fontSize: '12px', color: '#22C55E' }}>
          ✓ Vulnerabilidade recebida e priorizada — veja na lista abaixo
        </div>
      )}
    </div>
  )
}
