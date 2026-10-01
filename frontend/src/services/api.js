import { demoAlerts } from '../data/demoData'

// Simula delay de rede para a interface parecer realista
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const login = async (email, password) => {
  await delay(800)
  if (email === 'admin@shieldtech.io' && password === 'admin123') {
    return { data: { access_token: 'fake-jwt-token', api_key: 'fake-api-key', company_name: 'Shield Tech' } }
  }
  throw { response: { data: { detail: 'Credenciais invalidas' } } }
}

export const signup = async (email, password, companyName) => {
  await delay(1000)
  return { data: { access_token: 'fake-jwt-token', api_key: 'fake-api-key', company_name: companyName } }
}

export const getMe = async () => {
  await delay(300)
  return { data: { email: 'admin@shieldtech.io', company_name: 'Shield Tech' } }
}

export const getAlerts = async (params = {}) => {
  await delay(600)
  let res = demoAlerts
  if (params.severity && params.severity !== 'TODAS') {
    res = res.filter(a => a.severity_adjusted === params.severity)
  }
  if (params.source_tool && params.source_tool !== 'TODAS') {
    res = res.filter(a => a.source_tool === params.source_tool)
  }
  return { data: res }
}

export const getStats = async () => {
  await delay(500)
  return {
    data: {
      total_alerts: demoAlerts.length,
      by_severity: {
        CRITICAL: demoAlerts.filter(a => a.severity_adjusted === 'CRITICAL').length,
        HIGH: demoAlerts.filter(a => a.severity_adjusted === 'HIGH').length,
        MEDIUM: demoAlerts.filter(a => a.severity_adjusted === 'MEDIUM').length,
        LOW: demoAlerts.filter(a => a.severity_adjusted === 'LOW').length,
      }
    }
  }
}

// Funções não mais utilizadas na versão simplificada, exportadas para evitar erros de import
export const createSLAAssessment = async () => {}
export const getRadar = async () => {}
export const regenerateApiKey = async () => {}
export const saveDiscordWebhook = async () => {}
export const testDiscordWebhook = async () => {}
export const sendContact = async () => { await delay(500); return { data: 'ok'} }
export const getAlert = async () => {}
export const remediate = async () => {}
export const getRemediation = async () => {}
export const getRemediations = async () => {}
export const createPR = async () => {}
export const getAnomalyAnalysis = async () => {}
export const checkIntent = async () => {}
export const getCompanyProfile = async () => {}
export const saveCompanyProfile = async () => {}
export const createRiskAssessment = async () => {}
export const getRiskAssessments = async () => {}
export const getRiskAssessment = async () => {}
export const getPRs = async () => {}
export const updatePRStatus = async () => {}
