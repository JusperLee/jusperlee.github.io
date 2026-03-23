import React from 'react'

/**
 * Syntax-highlight data points in prose text (rainbow code-like coloring).
 *
 * Patterns highlighted:
 *  - Numbers with optional units/suffix  → `num` color (gold)
 *  - ALL-CAPS acronyms (2+ chars)        → `kw`  color (blue)
 *  - Quoted strings ("…" / '…')          → `str` color (green)
 */
export function highlightData(
  text: string,
  c: { num: string; kw: string; str: string },
): React.ReactNode {
  if (!text) return null

  // numbers (incl. decimals, %, x, +) | quoted strings | CAPS acronyms
  const rx =
    /(\b\d+(?:[.,]\d+)*\s*(?:%|x|\+|K|M|k|GB|MB|TB|ms|s|px)?\b)|("[^"]+"|'[^']+')|(\b[A-Z][A-Z0-9_]{1,}(?:[-/][A-Z0-9]+)*\b)/g

  const parts: React.ReactNode[] = []
  let last = 0
  let key = 0
  let m: RegExpExecArray | null

  while ((m = rx.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index))

    const color = m[1] ? c.num : m[2] ? c.str : c.kw
    const fw = m[1] ? 600 : 500
    parts.push(
      <span key={key++} style={{ color, fontWeight: fw }}>
        {m[0]}
      </span>,
    )
    last = m.index + m[0].length
  }

  if (last < text.length) parts.push(text.slice(last))
  return <>{parts}</>
}
