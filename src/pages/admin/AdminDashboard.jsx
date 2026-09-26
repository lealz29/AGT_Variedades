import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../contexts/AuthContext'

function formatBRL(value) {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function AdminDashboard() {
  const { signOut } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  async function loadProducts() {
    setLoading(true)
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProducts(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    loadProducts()
  }, [])

  async function toggleAvailable(product) {
    await supabase.from('products').update({ available: !product.available }).eq('id', product.id)
    loadProducts()
  }

  async function deleteProduct(product) {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) return
    await supabase.from('products').delete().eq('id', product.id)
    loadProducts()
  }

  const available = products.filter((p) => p.available).length
  const soldOut = products.length - available
  const inPromo = products.filter((p) => p.promotion).length

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl text-plum">AGT Variedades — Painel</h1>
        <button onClick={signOut} className="focus-ring rounded-full border border-brand-light px-4 py-1.5 text-sm text-ink hover:bg-brand-pale">
          Sair
        </button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Produtos" value={products.length} />
        <Stat label="Disponíveis" value={available} />
        <Stat label="Esgotados" value={soldOut} />
        <Stat label="Em promoção" value={inPromo} />
      </div>

      <Link
        to="/admin/produtos/novo"
        className="focus-ring mb-6 inline-flex items-center rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
      >
        + Adicionar produto
      </Link>

      {loading ? (
        <p className="text-ink-soft">Carregando...</p>
      ) : (
        <ul className="divide-y divide-brand-light/50 rounded-2xl border border-brand-light/50 bg-white">
          {products.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-3 p-4">
              <div className="flex-1">
                <p className="font-medium text-ink">{p.name}</p>
                <p className="text-sm text-ink-soft">
                  {formatBRL(p.price)} · {p.available ? 'Disponível' : 'Esgotado'}
                </p>
              </div>
              <Link
                to={`/admin/produtos/${p.id}`}
                className="focus-ring rounded-full border border-brand-light px-3 py-1.5 text-xs font-semibold text-ink hover:bg-brand-pale"
              >
                Editar
              </Link>
              <button
                onClick={() => toggleAvailable(p)}
                className="focus-ring rounded-full border border-brand-light px-3 py-1.5 text-xs font-semibold text-ink hover:bg-brand-pale"
              >
                {p.available ? 'Desativar' : 'Reativar'}
              </button>
              <button
                onClick={() => deleteProduct(p)}
                className="focus-ring rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
              >
                Excluir
              </button>
            </li>
          ))}
          {products.length === 0 && <li className="p-6 text-center text-ink-soft">Nenhum produto cadastrado ainda.</li>}
        </ul>
      )}
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-brand-light/50 bg-white p-4 text-center">
      <p className="font-display text-2xl text-plum">{value}</p>
      <p className="text-xs text-ink-soft">{label}</p>
    </div>
  )
}
