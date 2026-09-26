import { Link } from 'react-router-dom'
import { productImageUrl } from '../lib/supabaseClient'
import { useSelection } from '../contexts/SelectionContext'

function formatBRL(value) {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function ProductCard({ product }) {
  const { favorites, toggleFavorite } = useSelection()
  const isFavorite = favorites.includes(product.id)
  const isSoldOut = !product.available
  const hasPromo = product.promotion && product.promotional_price

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-brand-light/50 bg-white transition-shadow hover:shadow-lg">
      <Link to={`/produto/${product.slug}`} className="focus-ring block">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-brand-pale">
          {product.main_image ? (
            <img
              src={productImageUrl(product.main_image)}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-4xl">🛍️</div>
          )}

          {isSoldOut && (
            <span className="absolute left-2 top-2 rounded-full bg-ink/80 px-2 py-1 text-[11px] font-semibold uppercase text-white">
              Esgotado
            </span>
          )}
          {!isSoldOut && hasPromo && (
            <span className="absolute left-2 top-2 rounded-full bg-brand px-2 py-1 text-[11px] font-semibold text-white">
              Promoção
            </span>
          )}
        </div>
      </Link>

      <button
        onClick={() => toggleFavorite(product.id)}
        aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        aria-pressed={isFavorite}
        className="focus-ring absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-lg shadow-sm"
      >
        {isFavorite ? '❤️' : '🤍'}
      </button>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <Link to={`/produto/${product.slug}`} className="focus-ring rounded text-sm font-medium text-ink line-clamp-2">
          {product.name}
        </Link>

        <div className="mt-auto flex items-baseline gap-2">
          {hasPromo ? (
            <>
              <span className="text-sm text-ink-soft line-through">{formatBRL(product.price)}</span>
              <span className="font-semibold text-brand-dark">{formatBRL(product.promotional_price)}</span>
            </>
          ) : (
            <span className="font-semibold text-ink">{formatBRL(product.price)}</span>
          )}
        </div>

        <Link
          to={`/produto/${product.slug}`}
          className="focus-ring mt-2 inline-flex items-center justify-center rounded-full border border-brand-dark px-3 py-1.5 text-xs font-semibold text-brand-dark transition-colors hover:bg-brand-dark hover:text-white"
        >
          Ver produto
        </Link>
      </div>
    </div>
  )
}
