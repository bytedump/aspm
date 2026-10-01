import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signup } from '../services/api'

const fieldStyle = {
  width: '100%',
  background: '#060810',
  border: '1px solid #1E2A42',
  borderRadius: '10px',
  padding: '12px 14px',
  color: '#E2E8F0',
  fontSize: '13px',
  fontFamily: 'Inter',
  outline: 'none',
  transition: 'all 0.2s ease',
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

export default function Signup() {
  const [companyName, setCompanyName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiKey, setApiKey] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await signup(email, password, companyName)
      localStorage.setItem('access_token', res.data.access_token)
      localStorage.setItem('api_key', res.data.api_key)
      localStorage.setItem('company_name', res.data.company_name || '')
      setApiKey(res.data.api_key)
    } catch (err) {
      setError(err.response?.data?.detail || 'Não foi possível criar a conta.')
    } finally {
      setLoading(false)
    }
  }

  // Depois do signup: mostra a api_key em destaque antes de entrar no painel
  if (apiKey) {
    return (
      <div style={{
        minHeight: '100vh', background: '#060810', display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: '24px',
      }}>
        <div style={{
          width: '100%', maxWidth: '560px', background: '#0C1220',
          border: '1px solid #1E2A42', borderRadius: '16px', padding: '40px 32px',
          boxShadow: '0 4px 24px rgba(79, 142, 247, 0.08)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #4F8EF7, transparent)', marginBottom: '20px' }} />
            <h1 style={{ fontFamily: "'Space Grotesk', serif", fontSize: '20px', color: '#E2E8F0', letterSpacing: '0.05em' }}>
              Conta criada
            </h1>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #131D35 0%, #0C1220 100%)',
            border: '1px solid #4F8EF740',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '20px',
          }}>
            <div style={{ ...labelStyle, marginBottom: '10px' }}>Sua chave de API</div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '12px',
              color: '#7EB0FF',
              wordBreak: 'break-all',
              background: '#060810',
              border: '1px solid #1E2A42',
              borderRadius: '10px',
              padding: '12px',
            }}>{apiKey}</div>
          </div>

          <p style={{ fontFamily: 'Inter', fontSize: '13px', color: '#E2E8F0', lineHeight: 1.7, marginBottom: '24px' }}>
            <strong style={{ color: '#7EB0FF' }}>Guarde esta chave</strong> — você vai precisar dela para
            conectar seu repositório GitHub. Adicione-a como secret{' '}
            <code style={{ fontFamily: "'JetBrains Mono', monospace", color: '#4F8EF7' }}>RISKLAYER_USER_API_KEY</code>{' '}
            nas configurações do seu repositório (Settings → Secrets and variables → Actions).
          </p>

          <button
            onClick={() => navigate('/')}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #2563EB 0%, #4F8EF7 100%)',
              border: 'none', borderRadius: '10px', padding: '12px',
              color: '#060810', fontFamily: 'Raleway', fontSize: '13px',
              fontWeight: '700', letterSpacing: '0.1em', cursor: 'pointer',
            }}
          >
            IR PARA O PAINEL
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#060810', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '24px',
    }}>
      <div style={{
        width: '100%', maxWidth: '420px', background: '#0C1220',
        border: '1px solid #1E2A42', borderRadius: '16px', padding: '40px 32px',
        boxShadow: '0 4px 24px rgba(79, 142, 247, 0.08)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #4F8EF7, transparent)', marginBottom: '20px' }} />
          <h1 style={{ fontFamily: "'Space Grotesk', serif", fontSize: '20px', fontWeight: '600', color: '#E2E8F0', letterSpacing: '0.05em' }}>
            Criar conta
          </h1>
          <p style={{ fontFamily: 'Raleway', fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
            Cada empresa vê apenas os próprios dados
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Nome da empresa</label>
            <input
              type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} required
              style={fieldStyle}
              onFocus={e => { e.currentTarget.style.borderColor = '#4F8EF7' }}
              onBlur={e => { e.currentTarget.style.borderColor = '#1E2A42' }}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>E-mail</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required
              style={fieldStyle}
              onFocus={e => { e.currentTarget.style.borderColor = '#4F8EF7' }}
              onBlur={e => { e.currentTarget.style.borderColor = '#1E2A42' }}
            />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Senha</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
              style={fieldStyle}
              onFocus={e => { e.currentTarget.style.borderColor = '#4F8EF7' }}
              onBlur={e => { e.currentTarget.style.borderColor = '#1E2A42' }}
            />
          </div>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.12)', border: '1px solid #EF444440',
              borderRadius: '10px', padding: '10px 12px', color: '#EF4444',
              fontFamily: 'Inter', fontSize: '12px', marginBottom: '16px',
            }}>{error}</div>
          )}

          <button
            type="submit" disabled={loading}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #2563EB 0%, #4F8EF7 100%)',
              border: 'none', borderRadius: '10px', padding: '12px',
              color: '#060810', fontFamily: 'Raleway', fontSize: '13px',
              fontWeight: '700', letterSpacing: '0.1em', cursor: 'pointer',
              opacity: loading ? 0.5 : 1,
            }}
          >
            {loading ? 'CRIANDO...' : 'CRIAR CONTA'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontFamily: 'Inter', fontSize: '12px', color: '#64748B' }}>
          Já tem conta? <Link to="/login" style={{ color: '#4F8EF7' }}>Entrar</Link>
        </div>
      </div>
    </div>
  )
}
