import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { productImageUrl, supabase } from '../lib/supabaseClient'
import { useSelection } from '../contexts/SelectionContext'

function formatBRL(value) {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function ProductDetail() {
  const { slug } = useParams()
  const { addItem } = useSelection()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [color, setColor] = useState('')
  const [size, setSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    setLoading(true)
    supabase
      .from('products')
      .select('*, product_variants(*)')
      .eq('slug', slug)
      .single()
      .then(({ data }) => {
        setProduct(data)
        setLoading(false)
      })
  }, [slug])

  if (loading) return <p className="mx-auto max-w-4xl px-4 py-16 text-center text-ink-soft">Carregando...</p>
  if (!product) return <p className="mx-auto max-w-4xl px-4 py-16 text-center text-ink-soft">Produto não encontrado.</p>

  const isClothing = product.category === 'feminino' || product.category === 'masculino'
  const variants = product.product_variants ?? []
  const colors = [...new Set(variants.map((v) => v.color).filter(Boolean))]
  const sizesForColor = variants.filter((v) => !color || v.color === color).map((v) => v.size).filter(Boolean)
  const selectedVariant = variants.find((v) => v.color === color && v.size === size)
  const stock = selectedVariant?.stock ?? null

  const needsSelection = isClothing && variants.length > 0
  const canAdd = product.available && (!needsSelection || (color && size && stock > 0))
  const images = product.images?.length ? product.images : [product.main_image].filter(Boolean)
  const unitPrice = product.promotional_price ?? product.price

  function handleAdd() {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      promotional_price: product.promotional_price,
      color: color || null,
      size: size || null,
      volume: product.volume || null,
      quantity,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link to={`/categoria/${product.category}`} className="focus-ring mb-4 inline-block rounded text-sm text-brand-dark">
        ← Voltar
      </Link>

      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <div className="aspect-square w-full overflow-hidden rounded-2xl bg-brand-pale">
            {images[activeImage] ? (
              <img src={productImageUrl(images[activeImage])} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-5xl">🛍️</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {images.map((img, i) => (
                <button
                  key={img + i}
                  onClick={() => setActiveImage(i)}
                  className={`focus-ring h-16 w-16 overflow-hidden rounded-lg border-2 ${i === activeImage ? 'border-brand' : 'border-transparent'}`}
                  aria-label={`Ver foto ${i + 1}`}
                >
                  <img src={productImageUrl(img)} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-dark">{product.subcategory || product.category}</p>
          <h1 className="mt-1 font-display text-2xl text-ink">{product.name}</h1>

          <div className="mt-3 flex items-baseline gap-2">
            {product.promotion && product.promotional_price ? (
              <>
                <span className="text-ink-soft line-through">{formatBRL(product.price)}</span>
                <span className="text-2xl font-semibold text-brand-dark">{formatBRL(product.promotional_price)}</span>
              </>
            ) : (
              <span className="text-2xl font-semibold text-ink">{formatBRL(product.price)}</span>
            )}
          </div>

          {product.description && <p className="mt-4 text-sm leading-relaxed text-ink-soft">{product.description}</p>}

          {(product.brand || product.volume || product.fragrance || product.type) && (
            <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {product.brand && (<><dt className="text-ink-soft">Marca</dt><dd>{product.brand}</dd></>)}
              {product.type && (<><dt className="text-ink-soft">Tipo</dt><dd>{product.type}</dd></>)}
              {product.volume && (<><dt className="text-ink-soft">Volume</dt><dd>{product.volume}</dd></>)}
              {product.fragrance && (<><dt className="text-ink-soft">Fragrância</dt><dd>{product.fragrance}</dd></>)}
            </dl>
          )}

          {!product.available && (
            <p className="mt-4 rounded-lg bg-ink/5 px-3 py-2 text-sm font-semibold text-ink">Produto esgotado no momento.</p>
          )}

          {needsSelection && product.available && (
            <div className="mt-5 space-y-4">
              {colors.length > 0 && (
                <div>
                  <p className="mb-1 text-xs font-semibold text-ink-soft">Cor</p>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => { setColor(c); setSize('') }}
                        className={`focus-ring rounded-full border px-3 py-1.5 text-sm ${color === c ? 'border-brand bg-brand-light text-plum' : 'border-brand-light text-ink'}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="mb-1 text-xs font-semibold text-ink-soft">Tamanho</p>
                <div className="flex flex-wrap gap-2">
                  {[...new Set(sizesForColor)].map((s) => {
                    const variant = variants.find((v) => v.color === color && v.size === s)
                    const disabled = !color || (variant && variant.stock <= 0)
                    return (
                      <button
                        key={s}
                        disabled={disabled}
                        onClick={() => setSize(s)}
                        className={`focus-ring rounded-full border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40 ${size === s ? 'border-brand bg-brand-light text-plum' : 'border-brand-light text-ink'}`}
                      >
                        {s}
                      </button>
                    )
                  })}
                </div>
              </div>

              {selectedVariant && (
                <p className="text-xs text-ink-soft">
                  {stock <= 0 ? 'Esgotado nessa combinação.' : stock <= 3 ? `Últimas unidades (${stock} em estoque)` : 'Em estoque'}
                </p>
              )}
            </div>
          )}

          {product.available && (
            <div className="mt-5 flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm">
                Quantidade
                <input
                  type="number"
                  min="1"
                  max={stock ?? 99}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(Number(e.target.value), stock ?? 99)))}
                  className="focus-ring w-16 rounded-lg border border-brand-light px-2 py-1"
                />
              </label>
            </div>
          )}

          <button
            onClick={handleAdd}
            disabled={!canAdd}
            className="focus-ring mt-5 w-full rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-ink/20"
          >
            {added ? 'Adicionado! ✓' : 'Adicionar à minha seleção'}
          </button>

          {unitPrice > 0 && (
            <p className="mt-2 text-center text-xs text-ink-soft">Valor unitário: {formatBRL(unitPrice)}</p>
          )}
        </div>
      </div>
    </div>
  )
}
