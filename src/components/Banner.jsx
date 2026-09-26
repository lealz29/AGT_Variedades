import { Link } from 'react-router-dom'
import { storeConfig } from '../lib/storeConfig'

export default function Banner() {
  return (
    <section className="bg-gradient-to-br from-brand-pale via-white to-brand-light/50">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-16 sm:py-20">
        <p className="font-display text-4xl text-plum sm:text-5xl">{storeConfig.name}</p>
        <p className="max-w-md text-base text-ink-soft sm:text-lg">{storeConfig.tagline}</p>
        <Link
          to="/categoria/feminino"
          className="focus-ring mt-2 inline-flex items-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          Ver produtos
        </Link>
      </div>
    </section>
  )
}
