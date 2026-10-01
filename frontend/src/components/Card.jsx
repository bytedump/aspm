import { useState } from 'react'

export default function Card({ children, style = {}, onClick, hoverable = false }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => hoverable && setHovered(true)}
      onMouseLeave={() => hoverable && setHovered(false)}
      style={{
        background: '#0C1220',
        border: `1px solid ${hovered && hoverable ? '#4F8EF7' : '#1E2A42'}`,
        borderRadius: '16px',
        padding: '24px',
        boxShadow: hovered && hoverable
          ? '0 8px 32px rgba(79, 142, 247, 0.16)'
          : '0 4px 24px rgba(79, 142, 247, 0.08)',
        transition: 'all 0.2s ease',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
