import { storeConfig } from './storeConfig'

function formatBRL(value) {
  return Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

// Monta a mensagem pronta com os itens da "Minha seleção" e abre o WhatsApp.
export function buildWhatsAppMessage(items) {
  const lines = [
    `Olá! Vi o catálogo da ${storeConfig.name} e tenho interesse nestes produtos:`,
    '',
  ]

  let total = 0

  items.forEach((item, index) => {
    const unitPrice = item.promotional_price ?? item.price
    const lineTotal = unitPrice * item.quantity
    total += lineTotal

    lines.push(`${index + 1}. ${item.name}`)
    if (item.color) lines.push(`   Cor: ${item.color}`)
    if (item.size) lines.push(`   Tamanho: ${item.size}`)
    if (item.volume) lines.push(`   Volume: ${item.volume}`)
    lines.push(`   Quantidade: ${item.quantity}`)
    lines.push(`   Valor: ${formatBRL(unitPrice)}`)
    lines.push('')
  })

  lines.push(`Total estimado: ${formatBRL(total)}`)
  lines.push('')
  lines.push('Gostaria de confirmar a disponibilidade. 😊')

  return lines.join('\n')
}

export function openWhatsAppWithSelection(items) {
  const message = buildWhatsAppMessage(items)
  const url = `https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent(message)}`
  window.open(url, '_blank', 'noopener,noreferrer')
}
