import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Filters from '../components/Filters'
import ProductCard from '../components/ProductCard'
import { categories } from '../lib/storeConfig'
import { applyFiltersAndSort, getAvailableColors, useProducts } from '../lib/useProducts'

const defaultFilters = { sort: 'recentes', availability: 'todos', maxPrice: '', size: '', color: '' }

export default function Category() {
  const { slug } = useParams()
  const category = categories.find((c) => c.slug === slug)
  const { products, loading } = useProducts({ category: slug })
  const [filters, setFilters] = useState(defaultFilters)

  const filtered = applyFiltersAndSort(products, filters)
  const availableColors = getAvailableColors(products)
  const showSizeColor = slug !== 'cosmeticos'

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-1 font-display text-3xl text-plum">
        {category ? `${category.icon} ${category.label}` : 'Produtos'}
      </h1>
      <p className="mb-6 text-sm text-ink-soft">{filtered.length} produto(s) encontrado(s)</p>

      <div className="mb-6">
        <Filters filters={filters} onChange={setFilters} availableColors={availableColors} showSizeColor={showSizeColor} />
      </div>

      {loading ? (
        <p className="text-ink-soft">Carregando produtos...</p>
      ) : filtered.length === 0 ? (
        <p className="text-ink-soft">Nenhum produto encontrado com esses filtros.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
