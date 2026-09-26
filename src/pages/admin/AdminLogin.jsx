import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function AdminLogin() {
  const { signIn, isAdmin, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  if (!loading && isAdmin) return <Navigate to="/admin" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    const { error } = await signIn(email, password)
    setSubmitting(false)
    if (error) {
      setError('E-mail ou senha incorretos.')
      return
    }
    navigate('/admin')
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4 py-16">
      <h1 className="mb-1 font-display text-2xl text-plum">Painel AGT Variedades</h1>
      <p className="mb-6 text-sm text-ink-soft">Entre com seu e-mail e senha de administrador.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm">
          E-mail
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="focus-ring mt-1 w-full rounded-lg border border-brand-light px-3 py-2"
          />
        </label>

        <label className="block text-sm">
          Senha
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="focus-ring mt-1 w-full rounded-lg border border-brand-light px-3 py-2"
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="focus-ring w-full rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {submitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
