import React from 'react'

/** Étiquette technique en mono : versions, identifiants, catégories. */
export function Pin({
  children,
  accent = false,
}: {
  children: React.ReactNode
  accent?: boolean
}) {
  const tone = accent
    ? 'text-cyan border-[rgba(43,229,255,0.28)] bg-[rgba(43,229,255,0.06)]'
    : 'text-ink-2 border-line bg-[#100D1A]'

  return (
    <span
      className={`font-mono text-[11px] tracking-[0.04em] border px-2 py-[3px] ${tone}`}
    >
      {children}
    </span>
  )
}
