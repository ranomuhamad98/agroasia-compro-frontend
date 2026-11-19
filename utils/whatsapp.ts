export function whatsAppOrderLink(phone?: string | null, message?: string | null) {
  const number = (phone || '').replace(/\D/g, '')
  if (!number) return '#'

  const text = (message || '').trim()
  if (!text) return `https://wa.me/${number}`
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
}

export function productOrderMessage(productName: string, productText?: string | null, template?: string | null) {
  const custom = productText?.trim()
  if (custom && !/^https?:\/\//i.test(custom)) return custom

  if (template) {
    const match = template.match(/(?:^|[?&])text=([^&]*)/)
    const raw = match ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : template
    return raw.split('[1]').join(productName)
  }

  return `Hello, I'm interested in ${productName}.`
}
