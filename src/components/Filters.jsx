import { clothingSizes } from '../lib/storeConfig'

export default function Filters({ filters, onChange, availableColors = [], showSizeColor }) {
  function set(key, value) {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-brand-light/50 bg-white p-4 text-sm sm:flex-row sm:flex-wrap sm:items-center">
      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-ink-soft">Ordenar por</span>
        <select
          value={filters.sort}
          onChange={(e) => set('sort', e.target.value)}
          className="focus-ring rounded-lg border border-brand-light bg-white px-2 py-1.5"
        >
          <option value="recentes">Mais recentes</option>
          <option value="menor-preco">Menor preço</option>
          <option value="maior-preco">Maior preço</option>
          <option value="nome">Nome A-Z</option>
        </select>
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-ink-soft">Disponibilidade</span>
        <select
          value={filters.availability}
          onChange={(e) => set('availability', e.target.value)}
          className="focus-ring rounded-lg border border-brand-light bg-white px-2 py-1.5"
        >
          <option value="todos">Todos</option>
          <option value="disponivel">Disponível</option>
          <option value="esgotado">Esgotado</option>
        </select>
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-ink-soft">Preço até</span>
        <input
          type="number"
          min="0"
          placeholder="R$"
          value={filters.maxPrice}
          onChange={(e) => set('maxPrice', e.target.value)}
          className="focus-ring w-28 rounded-lg border border-brand-light bg-white px-2 py-1.5"
        />
      </label>

      {showSizeColor && (
        <>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-ink-soft">Tamanho</span>
            <select
              value={filters.size}
              onChange={(e) => set('size', e.target.value)}
              className="focus-ring rounded-lg border border-brand-light bg-white px-2 py-1.5"
            >
              <option value="">Todos</option>
              {clothingSizes.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>

          {availableColors.length > 0 && (
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-ink-soft">Cor</span>
              <select
                value={filters.color}
                onChange={(e) => set('color', e.target.value)}
                className="focus-ring rounded-lg border border-brand-light bg-white px-2 py-1.5"
              >
                <option value="">Todas</option>
                {availableColors.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
          )}
        </>
      )}
    </div>
  )
}
