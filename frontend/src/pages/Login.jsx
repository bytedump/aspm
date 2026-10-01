import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { login } from '../services/api'
import { useDemoMode } from '../context/DemoContext'

// Acesso do Modo Demo: entra sem servidor, so com dados ficticios.
const DEMO_EMAIL = 'admin@shieldtech.io'
const DEMO_PASSWORD = 'admin123'

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

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { setIsDemoMode } = useDemoMode()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Login do Modo Demo: nao chama a API, liga o Modo Demo e abre o painel
    if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
      localStorage.setItem('access_token', 'demo')
      localStorage.setItem('company_name', 'Shield Tech')
      setIsDemoMode(true)
      navigate('/alerts')
      return
    }

    setLoading(true)
    try {
      const res = await login(email, password)
      localStorage.setItem('access_token', res.data.access_token)
      localStorage.setItem('api_key', res.data.api_key)
      localStorage.setItem('company_name', res.data.company_name || '')
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || 'Não foi possível entrar. Verifique os dados.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#060810',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: '#0C1220',
        border: '1px solid #1E2A42',
        borderRadius: '16px',
        padding: '40px 32px',
        boxShadow: '0 4px 24px rgba(79, 142, 247, 0.08)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #4F8EF7, transparent)',
            marginBottom: '20px',
          }} />
          <h1 style={{
            fontFamily: "'Space Grotesk', serif",
            fontSize: '20px',
            fontWeight: '600',
            color: '#E2E8F0',
            letterSpacing: '0.05em',
          }}>{t('auth.loginTitle')}</h1>
          <p style={{ fontFamily: 'Raleway', fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
            {t('auth.loginSubtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>{t('common.email')}</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={fieldStyle}
              onFocus={e => { e.currentTarget.style.borderColor = '#4F8EF7' }}
              onBlur={e => { e.currentTarget.style.borderColor = '#1E2A42' }}
            />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>{t('common.password')}</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={fieldStyle}
              onFocus={e => { e.currentTarget.style.borderColor = '#4F8EF7' }}
              onBlur={e => { e.currentTarget.style.borderColor = '#1E2A42' }}
            />
          </div>

          <div style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#64748B',
            textAlign: 'center', marginBottom: '16px', lineHeight: 1.6,
          }}>
            Modo Demo<br />{DEMO_EMAIL} · {DEMO_PASSWORD}
          </div>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid #EF444440',
              borderRadius: '10px',
              padding: '10px 12px',
              color: '#EF4444',
              fontFamily: 'Inter',
              fontSize: '12px',
              marginBottom: '16px',
            }}>{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #2563EB 0%, #4F8EF7 100%)',
              border: 'none',
              borderRadius: '10px',
              padding: '12px',
              color: '#060810',
              fontFamily: 'Raleway',
              fontSize: '13px',
              fontWeight: '700',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              opacity: loading ? 0.5 : 1,
            }}
          >
            {loading ? t('auth.loggingIn') : t('auth.loginButton')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontFamily: 'Inter', fontSize: '12px', color: '#64748B' }}>
          {t('auth.noAccount')} <Link to="/signup" style={{ color: '#4F8EF7' }}>{t('auth.createAccount')}</Link>
        </div>
      </div>
    </div>
  )
}

