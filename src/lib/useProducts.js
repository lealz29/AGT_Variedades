import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

// Busca produtos disponíveis publicamente (RLS permite leitura pública de "available = true"
// e também os esgotados, para exibirmos com o selo "Esgotado").
export function useProducts({ category, subcategory } = {}) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    setLoading(true)

    let query = supabase
      .from('products')
      .select('*, product_variants(*)')
      .order('created_at', { ascending: false })

    if (category) query = query.eq('category', category)
    if (subcategory) query = query.eq('subcategory', subcategory)

    query.then(({ data, error }) => {
      if (!active) return
      if (error) setError(error)
      setProducts(data ?? [])
      setLoading(false)
    })

    return () => {
      active = false
    }
  }, [category, subcategory])

  return { products, loading, error }
}

export function applyFiltersAndSort(products, filters) {
  let result = [...products]

  if (filters.availability === 'disponivel') result = result.filter((p) => p.available)
  if (filters.availability === 'esgotado') result = result.filter((p) => !p.available)

  if (filters.maxPrice) {
    const max = Number(filters.maxPrice)
    result = result.filter((p) => (p.promotional_price ?? p.price) <= max)
  }

  if (filters.size) {
    result = result.filter((p) => p.product_variants?.some((v) => v.size === filters.size))
  }

  if (filters.color) {
    result = result.filter((p) => p.product_variants?.some((v) => v.color === filters.color))
  }

  switch (filters.sort) {
    case 'menor-preco':
      result.sort((a, b) => (a.promotional_price ?? a.price) - (b.promotional_price ?? b.price))
      break
    case 'maior-preco':
      result.sort((a, b) => (b.promotional_price ?? b.price) - (a.promotional_price ?? a.price))
      break
    case 'nome':
      result.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
      break
    default:
      // recentes: já vem ordenado por created_at desc da query
      break
  }

  return result
}

export function getAvailableColors(products) {
  const colors = new Set()
  products.forEach((p) => p.product_variants?.forEach((v) => v.color && colors.add(v.color)))
  return [...colors]
}
