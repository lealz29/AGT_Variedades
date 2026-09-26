import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { categories, storeConfig } from '../lib/storeConfig'
import { useSelection } from '../contexts/SelectionContext'

export default function Header() {
  const { count } = useSelection()
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  function handleSearch(e) {
    e.preventDefault()
    if (!query.trim()) return
    navigate(`/buscar?q=${encodeURIComponent(query.trim())}`)
    setMenuOpen(false)
  }

  const navLinkClass = ({ isActive }) =>
    `focus-ring rounded px-1 transition-colors ${isActive ? 'text-brand-dark font-semibold' : 'text-ink hover:text-brand-dark'}`

  return (
    <header className="sticky top-0 z-40 border-b border-brand-light/60 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="focus-ring flex items-center gap-2 rounded">
          <img
            src="/logo.png"
            alt={storeConfig.name}
            className="h-9 w-auto sm:h-10"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
          <span className="font-display text-xl text-plum">{storeConfig.name}</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          <NavLink to="/" end className={navLinkClass}>Início</NavLink>
          {categories.map((cat) => (
            <NavLink key={cat.slug} to={`/categoria/${cat.slug}`} className={navLinkClass}>
              {cat.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <form onSubmit={handleSearch} className="hidden items-center rounded-full border border-brand-light bg-brand-pale px-3 py-1.5 sm:flex">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar produtos"
              aria-label="Buscar produtos"
              className="w-40 bg-transparent text-sm text-ink placeholder:text-ink-soft focus:outline-none"
            />
            <button type="submit" aria-label="Buscar" className="focus-ring rounded text-brand-dark">
              🔍
            </button>
          </form>

          <Link to="/selecao" aria-label="Minha seleção" className="focus-ring relative rounded p-1 text-xl">
            🛍️
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[11px] font-semibold text-white">
                {count}
              </span>
            )}
          </Link>

          <button
            className="focus-ring rounded p-1 text-xl md:hidden"
            aria-label="Abrir menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            ☰
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-brand-light/60 bg-white px-4 py-3 md:hidden">
          <form onSubmit={handleSearch} className="mb-3 flex items-center rounded-full border border-brand-light bg-brand-pale px-3 py-2">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar produtos"
              aria-label="Buscar produtos"
              className="w-full bg-transparent text-sm focus:outline-none"
            />
            <button type="submit" aria-label="Buscar">🔍</button>
          </form>
          <nav className="flex flex-col gap-3 text-sm">
            <NavLink to="/" end className={navLinkClass} onClick={() => setMenuOpen(false)}>Início</NavLink>
            {categories.map((cat) => (
              <NavLink
                key={cat.slug}
                to={`/categoria/${cat.slug}`}
                className={navLinkClass}
                onClick={() => setMenuOpen(false)}
              >
                {cat.icon} {cat.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
