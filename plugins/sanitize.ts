import DOMPurify from 'isomorphic-dompurify'

export default defineNuxtPlugin(() => {
  // Ensure safe links when opening in a new tab
  try {
    DOMPurify.addHook('afterSanitizeAttributes', (node) => {
      // Add rel to anchors with target _blank
      if ('target' in node && node.getAttribute && node.getAttribute('target') === '_blank') {
        node.setAttribute('rel', 'noopener noreferrer')
      }
    })
  } catch {
    // No-op: hooks may not be available in certain SSR contexts
  }

  const sanitize = (input?: string): string => {
    if (!input || typeof input !== 'string') return ''
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [
        'b', 'strong', 'i', 'em', 'u', 'br', 'span', 'p', 'a', 'ul', 'ol', 'li'
      ],
      ALLOWED_ATTR: [
        'href', 'target', 'rel', 'class'
      ],
      FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
      ALLOW_DATA_ATTR: false
    })
  }

  return {
    provide: { sanitize }
  }
})


