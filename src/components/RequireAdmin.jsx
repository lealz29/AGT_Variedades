import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function RequireAdmin({ children }) {
  const { isAdmin, loading } = useAuth()

  if (loading) return <p className="p-8 text-center text-ink-soft">Carregando...</p>
  if (!isAdmin) return <Navigate to="/admin/login" replace />

  return children
}
