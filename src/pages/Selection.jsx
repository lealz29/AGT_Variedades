import { Link } from 'react-router-dom'
import { useSelection } from '../contexts/SelectionContext'
import { openWhatsAppWithSelection } from '../lib/whatsapp'

function formatBRL(value) {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function Selection() {
  const { items, removeItem, updateQuantity, total, clearSelection } = useSelection()

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-5xl">🛍️</p>
        <h1 className="mt-4 font-display text-2xl text-plum">Sua seleção está vazia</h1>
        <p className="mt-2 text-ink-soft">Explore o catálogo e adicione produtos que você gostou.</p>
        <Link to="/" className="focus-ring mt-6 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark">
          Ver produtos
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 font-display text-3xl text-plum">Minha seleção</h1>

      <ul className="divide-y divide-brand-light/50 rounded-2xl border border-brand-light/50 bg-white">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-3 p-4">
            <div className="flex-1">
              <p className="font-medium text-ink">{item.name}</p>
              <p className="text-xs text-ink-soft">
                {[item.color, item.size, item.volume].filter(Boolean).join(' / ')}
              </p>
              <p className="mt-1 text-sm font-semibold text-brand-dark">
                {formatBRL(item.promotional_price ?? item.price)}
              </p>
            </div>

            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => updateQuantity(index, Math.max(1, Number(e.target.value)))}
              className="focus-ring w-14 rounded-lg border border-brand-light px-2 py-1 text-center text-sm"
            />

            <button
              onClick={() => removeItem(index)}
              aria-label={`Remover ${item.name}`}
              className="focus-ring rounded p-1 text-ink-soft hover:text-ink"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between text-lg">
        <span className="text-ink-soft">Total estimado</span>
        <span className="font-display text-2xl text-plum">{formatBRL(total)}</span>
      </div>

      <button
        onClick={() => openWhatsAppWithSelection(items)}
        className="focus-ring mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
      >
        Enviar pelo WhatsApp
      </button>

      <button onClick={clearSelection} className="focus-ring mt-3 w-full rounded-full py-2 text-xs text-ink-soft hover:text-ink">
        Esvaziar seleção
      </button>
    </div>
  )
}
