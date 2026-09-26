import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { supabase } from '../lib/supabaseClient'

export default function Search() {
  const [params] = useSearchParams()
  const q = params.get('q') ?? ''
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!q) {
      setResults([])
      setLoading(false)
      return
    }
    setLoading(true)
    supabase
      .from('products')
      .select('*, product_variants(*)')
      .or(`name.ilike.%${q}%,category.ilike.%${q}%,subcategory.ilike.%${q}%,description.ilike.%${q}%,brand.ilike.%${q}%`)
      .then(({ data }) => {
        setResults(data ?? [])
        setLoading(false)
      })
  }, [q])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-1 font-display text-3xl text-plum">Resultados para "{q}"</h1>
      <p className="mb-6 text-sm text-ink-soft">{results.length} produto(s) encontrado(s)</p>

      {loading ? (
        <p className="text-ink-soft">Buscando...</p>
      ) : results.length === 0 ? (
        <p className="text-ink-soft">Nenhum produto encontrado.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
