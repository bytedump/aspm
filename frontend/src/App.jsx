import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Alerts from './pages/Alerts'
import Repositories from './pages/Repositories'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Account from './pages/Account'
import Contact from './pages/Contact'

export default function App() {
  return (
    <Routes>
      {/* Rotas publicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Painel — exige sessao ativa */}
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/repositories" element={<Repositories />} />
                <Route path="/account" element={<Account />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}


