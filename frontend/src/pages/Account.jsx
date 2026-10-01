import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Card from '../components/Card'
import { getMe } from '../services/api'

const labelStyle = {
  fontFamily: 'Raleway', fontSize: '11px', fontWeight: '600', color: '#64748B',
  letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '6px',
}

export default function Account() {
  const [me, setMe] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { t } = useTranslation()

  useEffect(() => {
    getMe()
      .then(res => setMe(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('api_key')
    localStorage.removeItem('company_name')
    navigate('/login')
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontFamily: "'Space Grotesk', serif", fontSize: '24px', fontWeight: '600',
          color: '#E2E8F0', letterSpacing: '0.05em', marginBottom: '4px',
        }}>Conta</h1>
        <p style={{ color: '#64748B', fontFamily: 'Raleway', fontSize: '13px' }}>
          Dados de acesso da sua empresa
        </p>
      </div>

      <Card style={{ marginBottom: '24px' }}>
        {loading ? (
          <div style={{ color: '#64748B', fontFamily: 'Raleway', letterSpacing: '0.2em' }}>CARREGANDO...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <div style={labelStyle}>Empresa</div>
              <div style={{ fontFamily: 'Inter', fontSize: '15px', color: '#E2E8F0' }}>
                {me?.company_name || '—'}
              </div>
            </div>
            <div>
              <div style={labelStyle}>E-mail</div>
              <div style={{ fontFamily: 'Inter', fontSize: '15px', color: '#E2E8F0' }}>
                {me?.email || '—'}
              </div>
            </div>
          </div>
        )}
      </Card>

      <Card>
        <div style={{ ...labelStyle, marginBottom: '12px' }}>Sessão</div>
        <p style={{ fontFamily: 'Inter', fontSize: '13px', color: '#64748B', lineHeight: 1.7, marginBottom: '16px' }}>
          Encerrar a sessão remove o acesso deste navegador. Seus dados continuam salvos e
          voltam a aparecer no próximo login.
        </p>
        <button
          onClick={handleLogout}
          style={{
            background: 'transparent', border: '1px solid #EF4444', borderRadius: '10px',
            padding: '10px 28px', color: '#EF4444', fontFamily: 'Raleway',
            fontSize: '12px', fontWeight: '600', letterSpacing: '0.08em', cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
        >
          {t('auth.logout')}
        </button>
      </Card>
    </div>
  )
}
