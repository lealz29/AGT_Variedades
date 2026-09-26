import { createContext, useContext, useEffect, useState } from 'react'

const SelectionContext = createContext(null)
const STORAGE_KEY = 'agt_minha_selecao'
const FAVORITES_KEY = 'agt_favoritos'

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

// Um item é considerado "o mesmo" se tiver o mesmo produto + cor + tamanho.
function sameItem(a, b) {
  return a.productId === b.productId && a.color === b.color && a.size === b.size
}

export function SelectionProvider({ children }) {
  const [items, setItems] = useState(() => loadFromStorage(STORAGE_KEY, []))
  const [favorites, setFavorites] = useState(() => loadFromStorage(FAVORITES_KEY, []))

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
  }, [favorites])

  function addItem(newItem) {
    setItems((prev) => {
      const existing = prev.find((it) => sameItem(it, newItem))
      if (existing) {
        return prev.map((it) =>
          sameItem(it, newItem) ? { ...it, quantity: it.quantity + newItem.quantity } : it
        )
      }
      return [...prev, newItem]
    })
  }

  function removeItem(index) {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  function updateQuantity(index, quantity) {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, quantity } : it)))
  }

  function clearSelection() {
    setItems([])
  }

  function toggleFavorite(productId) {
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    )
  }

  const total = items.reduce((sum, it) => sum + (it.promotional_price ?? it.price) * it.quantity, 0)
  const count = items.reduce((sum, it) => sum + it.quantity, 0)

  return (
    <SelectionContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearSelection, total, count, favorites, toggleFavorite }}
    >
      {children}
    </SelectionContext.Provider>
  )
}

export function useSelection() {
  const ctx = useContext(SelectionContext)
  if (!ctx) throw new Error('useSelection precisa estar dentro de <SelectionProvider>')
  return ctx
}
