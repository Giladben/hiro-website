const ALLOWED = new Set(['p', 'ul', 'ol', 'li', 'strong', 'b', 'em', 'i', 'br', 'h3', 'h4'])

/**
 * Defense in depth for job descriptions: the API promises a sanitized subset,
 * but we still strip everything except bare allowlisted tags (no attributes).
 */
export function sanitizeJobHtml(html: string) {
  return html
    .replace(/<(script|style|iframe|object|embed|template)[\s\S]*?<\/\1\s*>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\/?([a-z0-9]+)\b[^>]*>/gi, (m, tag: string) => {
      const t = tag.toLowerCase()
      if (!ALLOWED.has(t)) return ''
      const closing = m.startsWith('</')
      return t === 'br' ? '<br>' : closing ? `</${t}>` : `<${t}>`
    })
}

export function plainText(html: string, max = 300) {
  const t = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  return t.length > max ? `${t.slice(0, max - 1)}…` : t
}
