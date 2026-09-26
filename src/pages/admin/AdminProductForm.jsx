import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { productImageUrl, supabase } from '../../lib/supabaseClient'
import { categories } from '../../lib/storeConfig'

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const emptyProduct = {
  name: '', category: 'feminino', subcategory: '', description: '',
  price: '', promotional_price: '', promotion: false, featured: false, available: true,
  brand: '', type: '', volume: '', fragrance: '',
}

export default function AdminProductForm() {
  const { id } = useParams()
  const isEditing = !!id && id !== 'novo'
  const navigate = useNavigate()

  const [product, setProduct] = useState(emptyProduct)
  const [mainImagePath, setMainImagePath] = useState('')
  const [imagePaths, setImagePaths] = useState([])
  const [variants, setVariants] = useState([]) // { color, size, stock }
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const isClothing = product.category === 'feminino' || product.category === 'masculino'
  const activeCategory = categories.find((c) => c.slug === product.category)

  useEffect(() => {
    if (!isEditing) return
    supabase.from('products').select('*, product_variants(*)').eq('id', id).single().then(({ data }) => {
      if (!data) return
      setProduct({ ...emptyProduct, ...data })
      setMainImagePath(data.main_image || '')
      setImagePaths(data.images || [])
      setVariants(
        (data.product_variants || []).map((v) => ({
          ...v,
          color: v.color ?? '',
          size: v.size ?? '',
          stock: v.stock ?? 0,
        }))
      )
    })
  }, [id, isEditing])

  function update(field, value) {
    setProduct((p) => ({ ...p, [field]: value }))
  }

  async function handleUpload(e, isMain) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const path = `${Date.now()}-${slugify(file.name)}`
    const { error } = await supabase.storage.from('product-images').upload(path, file)
    setUploading(false)
    if (error) {
      setError('Erro ao enviar imagem: ' + error.message)
      return
    }
    if (isMain) setMainImagePath(path)
    else setImagePaths((prev) => [...prev, path])
  }

  function removeImage(path) {
    setImagePaths((prev) => prev.filter((p) => p !== path))
  }

  function addVariant() {
    setVariants((prev) => [...prev, { color: '', size: '', stock: 0 }])
  }

  function updateVariant(index, field, value) {
    setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)))
  }

  function removeVariant(index) {
    setVariants((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      name: product.name,
      slug: isEditing ? product.slug : `${slugify(product.name)}-${Date.now().toString().slice(-5)}`,
      category: product.category,
      subcategory: product.subcategory || null,
      description: product.description || null,
      price: Number(product.price) || 0,
      promotional_price: product.promotional_price ? Number(product.promotional_price) : null,
      promotion: !!product.promotion,
      featured: !!product.featured,
      available: !!product.available,
      main_image: mainImagePath || null,
      images: imagePaths,
      brand: product.brand || null,
      type: product.type || null,
      volume: product.volume || null,
      fragrance: product.fragrance || null,
    }

    let productId = id
    if (isEditing) {
      const { error } = await supabase.from('products').update(payload).eq('id', id)
      if (error) { setError(error.message); setSaving(false); return }
    } else {
      const { data, error } = await supabase.from('products').insert(payload).select('id').single()
      if (error) { setError(error.message); setSaving(false); return }
      productId = data.id
    }

    if (isClothing) {
      await supabase.from('product_variants').delete().eq('product_id', productId)
      const rows = variants
        .filter((v) => v.color || v.size)
        .map((v) => ({ product_id: productId, color: v.color || null, size: v.size || null, stock: Number(v.stock) || 0 }))
      if (rows.length > 0) await supabase.from('product_variants').insert(rows)
    }

    setSaving(false)
    navigate('/admin')
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 font-display text-2xl text-plum">{isEditing ? 'Editar produto' : 'Adicionar produto'}</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Nome">
          <input required value={product.name} onChange={(e) => update('name', e.target.value)} className="input" />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Categoria">
            <select value={product.category} onChange={(e) => update('category', e.target.value)} className="input">
              {categories.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
            </select>
          </Field>
          <Field label="Subcategoria">
            <select value={product.subcategory} onChange={(e) => update('subcategory', e.target.value)} className="input">
              <option value="">Selecione</option>
              {activeCategory?.subcategories.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
        </div>

        <Field label="Descrição">
          <textarea value={product.description} onChange={(e) => update('description', e.target.value)} rows={3} className="input" />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Preço (R$)">
            <input required type="number" step="0.01" min="0" value={product.price} onChange={(e) => update('price', e.target.value)} className="input" />
          </Field>
          <Field label="Preço promocional (R$)">
            <input type="number" step="0.01" min="0" value={product.promotional_price} onChange={(e) => update('promotional_price', e.target.value)} className="input" />
          </Field>
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <Checkbox label="Produto em promoção" checked={product.promotion} onChange={(v) => update('promotion', v)} />
          <Checkbox label="Produto em destaque" checked={product.featured} onChange={(v) => update('featured', v)} />
          <Checkbox label="Disponível" checked={product.available} onChange={(v) => update('available', v)} />
        </div>

        {!isClothing && (
          <div className="grid grid-cols-2 gap-4">
            <Field label="Marca (opcional)"><input value={product.brand} onChange={(e) => update('brand', e.target.value)} className="input" /></Field>
            <Field label="Tipo (opcional)"><input value={product.type} onChange={(e) => update('type', e.target.value)} className="input" /></Field>
            <Field label="Volume (opcional)"><input value={product.volume} onChange={(e) => update('volume', e.target.value)} placeholder="Ex: 100ml" className="input" /></Field>
            <Field label="Fragrância (opcional)"><input value={product.fragrance} onChange={(e) => update('fragrance', e.target.value)} className="input" /></Field>
          </div>
        )}

        <Field label="Foto principal">
          <input type="file" accept="image/*" onChange={(e) => handleUpload(e, true)} className="text-sm" />
          {mainImagePath && <img src={productImageUrl(mainImagePath)} alt="" className="mt-2 h-24 w-24 rounded-lg object-cover" />}
        </Field>

        <Field label="Outras fotos">
          <input type="file" accept="image/*" onChange={(e) => handleUpload(e, false)} className="text-sm" />
          <div className="mt-2 flex flex-wrap gap-2">
            {imagePaths.map((path) => (
              <div key={path} className="relative">
                <img src={productImageUrl(path)} alt="" className="h-20 w-20 rounded-lg object-cover" />
                <button type="button" onClick={() => removeImage(path)} className="focus-ring absolute -right-1 -top-1 rounded-full bg-white px-1.5 text-xs shadow">✕</button>
              </div>
            ))}
          </div>
        </Field>
        {uploading && <p className="text-xs text-ink-soft">Enviando imagem...</p>}

        {isClothing && (
          <div>
            <p className="mb-1 text-sm font-semibold text-ink">Cores, tamanhos e estoque</p>
            <p className="mb-2 text-xs text-ink-soft">
              O tamanho aceita letras (P, M, G) ou números (36, 38, 40...). Se a peça não tiver
              cor específica (ex: jeans), deixe o campo "Cor" em branco.
            </p>
            <div className="space-y-2">
              {variants.map((v, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    placeholder="Cor (ex: Preto) — deixe em branco se não houver cor"
                    value={v.color || ''}
                    onChange={(e) => updateVariant(i, 'color', e.target.value)}
                    className="input flex-1"
                  />
                  <input
                    placeholder="Tamanho (ex: M ou 40)"
                    value={v.size || ''}
                    onChange={(e) => updateVariant(i, 'size', e.target.value)}
                    className="input w-28"
                  />
                  <input
                    type="number" min="0" placeholder="Estoque"
                    value={v.stock ?? 0}
                    onChange={(e) => updateVariant(i, 'stock', e.target.value)}
                    className="input w-24"
                  />
                  <button type="button" onClick={() => removeVariant(i)} className="focus-ring rounded p-1 text-ink-soft hover:text-ink">✕</button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addVariant} className="focus-ring mt-2 rounded-full border border-brand-light px-4 py-1.5 text-xs font-semibold text-brand-dark hover:bg-brand-pale">
              + Adicionar cor/tamanho
            </button>
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="focus-ring rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60">
            {saving ? 'Salvando...' : 'Salvar produto'}
          </button>
          <button type="button" onClick={() => navigate('/admin')} className="focus-ring rounded-full border border-brand-light px-6 py-2.5 text-sm text-ink hover:bg-brand-pale">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-ink">{label}</span>
      {children}
    </label>
  )
}
