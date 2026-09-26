import { Link } from 'react-router-dom'
import Banner from '../components/Banner'
import ProductCard from '../components/ProductCard'
import { categories } from '../lib/storeConfig'
import { useProducts } from '../lib/useProducts'

export default function Home() {
  const { products, loading } = useProducts()
  const featured = products.filter((p) => p.featured).slice(0, 8)

  return (
    <div>
      <Banner />

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="mb-4 font-display text-2xl text-plum">Categorias</h2>
        <div className="grid grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/categoria/${cat.slug}`}
              className="focus-ring flex flex-col items-center gap-2 rounded-2xl border border-brand-light/50 bg-white py-6 text-center transition-colors hover:border-brand"
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="text-sm font-semibold text-ink">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <h2 className="mb-4 font-display text-2xl text-plum">Destaques</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {!loading && products.length === 0 && (
        <p className="mx-auto max-w-6xl px-4 pb-16 text-center text-ink-soft">
          Nenhum produto cadastrado ainda. Assim que forem adicionados no painel administrativo, eles aparecerão aqui.
        </p>
      )}
    </div>
  )
}
