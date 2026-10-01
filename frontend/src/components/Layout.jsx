import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Sidebar from './Sidebar'
import { useDemoMode } from '../context/DemoContext'

const navItems = [
  { path: '/', key: 'dashboard', icon: '◈' },
  { path: '/alerts', key: 'alerts', icon: '⚠' },
  { path: '/repositories', key: 'repositories', icon: '◉' },
]

export default function Layout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const companyName = localStorage.getItem('company_name')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isDemoMode, setIsDemoMode } = useDemoMode()
  const { t } = useTranslation()

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: '#060810',
    }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* Header */}
      <header style={{
        background: 'linear-gradient(180deg, #0C1220 0%, #060810 100%)',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '68px',
        flexShrink: 0,
        position: 'relative',
      }}>
        {/* Menu + logo + modo demo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label={t('nav.openMenu')}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 4px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{ display: 'block', width: '18px', height: '1.5px', background: '#64748B' }} />
            ))}
          </button>

          <span style={{ fontFamily: "'Space Grotesk', serif", fontSize: '20px', fontWeight: 600, letterSpacing: '0.12em', color: '#4F8EF7' }}>RISKLAYER</span>

          <button
            onClick={() => setIsDemoMode(!isDemoMode)}
            style={{
              fontSize: '10px',
              fontFamily: "'Raleway', sans-serif",
              fontWeight: '600',
              letterSpacing: '0.05em',
              color: isDemoMode ? '#060810' : '#64748B',
              background: isDemoMode ? '#4F8EF7' : 'transparent',
              border: `1px solid ${isDemoMode ? '#4F8EF7' : '#1E2A42'}`,
              borderRadius: '4px',
              padding: '3px 8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {t('nav.demoMode')}: {isDemoMode ? t('nav.on') : t('nav.off')}
          </button>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          {navItems.map((item, idx) => {
            const isActive = location.pathname === item.path
            const isFirstAdvanced = item.advanced && !navItems[idx - 1]?.advanced
            return (
              <span key={item.path} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {isFirstAdvanced && (
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    margin: '0 6px 0 8px',
                  }}>
                    <span style={{ width: '1px', height: '20px', background: '#1E2A42' }} />
                    <span style={{
                      fontFamily: "'Raleway', sans-serif",
                      fontSize: '8px',
                      color: '#2563EB',
                      letterSpacing: '0.2em',
                      writingMode: 'horizontal-tb',
                      whiteSpace: 'nowrap',
                    }}>{t('nav.advanced')}</span>
                  </span>
                )}
              <button
                onClick={() => navigate(item.path)}
                style={{
                  background: isActive ? 'rgba(79, 142, 247, 0.1)' : 'transparent',
                  border: isActive ? '1px solid rgba(79, 142, 247, 0.3)' : '1px solid transparent',
                  borderRadius: '10px',
                  padding: '8px 16px',
                  color: isActive ? '#4F8EF7' : '#64748B',
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: '13px',
                  fontWeight: isActive ? '600' : '400',
                  letterSpacing: '0.05em',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#4F8EF7'
                    e.currentTarget.style.background = 'rgba(79, 142, 247, 0.05)'
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#64748B'
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                <span style={{ fontSize: '12px', opacity: 0.7 }}>{item.icon}</span>
                {t(`nav.${item.key}`)}
              </button>
              </span>
            )
          })}
        </nav>

        {/* Status + conta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#22C55E',
              boxShadow: '0 0 6px rgba(34, 197, 94, 0.8)',
            }} />
            <span style={{
              fontFamily: "'Raleway', sans-serif",
              fontSize: '11px',
              color: '#64748B',
              letterSpacing: '0.1em',
            }}>{companyName || 'SISTEMA ATIVO'}</span>
          </div>
        </div>

        {/* Linha dourada embaixo do header */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #4F8EF7, transparent)',
        }} />
      </header>

      {/* Conteúdo */}
      <main style={{
        flex: 1,
        overflow: 'auto',
        padding: '32px',
      }}>
        {children}
      </main>
    </div>
  )
}


