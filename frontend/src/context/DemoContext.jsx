import { createContext, useContext, useState } from 'react'
import { demoAlerts } from '../data/demoData'

const DemoContext = createContext({
  isDemoMode: false,
  setIsDemoMode: () => {},
  demoAlertList: demoAlerts,
  addDemoAlert: () => {},
})

export function DemoProvider({ children }) {
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [demoAlertList, setDemoAlertList] = useState(demoAlerts)

  /** Simula o recebimento de uma vulnerabilidade nova (so em memoria, sem API). */
  const addDemoAlert = ({ title, file_path, severity }) => {
    setDemoAlertList(prev => [{
      id: 9100 + prev.length,
      source_tool: 'semgrep',
      repository: 'acme-corp/checkout-api',
      severity,
      severity_adjusted: severity,
      title,
      file_path,
      line_number: 1,
      created_at: new Date().toISOString(),
    }, ...prev])
  }

  return (
    <DemoContext.Provider value={{ isDemoMode, setIsDemoMode, demoAlertList, addDemoAlert }}>
      {children}
    </DemoContext.Provider>
  )
}

export const useDemoMode = () => useContext(DemoContext)

/** Pequeno atraso artificial para o Modo Demo nao parecer instantaneo demais. */
export const demoDelay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms))
