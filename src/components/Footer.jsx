import { Link } from 'react-router-dom'
import { categories, storeConfig } from '../lib/storeConfig'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-brand-light/60 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="font-display text-lg text-plum">{storeConfig.name}</p>
          <p className="mt-1 text-sm text-ink-soft">{storeConfig.tagline}</p>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-ink">Categorias</p>
          <ul className="space-y-1 text-sm text-ink-soft">
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link to={`/categoria/${cat.slug}`} className="focus-ring rounded hover:text-brand-dark">
                  {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-ink">Contato</p>
          <ul className="space-y-1 text-sm text-ink-soft">
            <li>
              <a
                href={`https://wa.me/${storeConfig.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring rounded hover:text-brand-dark"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <a
                href={storeConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring rounded hover:text-brand-dark"
              >
                Instagram {storeConfig.instagramHandle}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <p className="border-t border-brand-light/40 px-4 py-4 text-center text-xs text-ink-soft">
        Entre em contato conosco pelo WhatsApp para confirmar disponibilidade, valores e formas de pagamento.
      </p>
    </footer>
  )
}
