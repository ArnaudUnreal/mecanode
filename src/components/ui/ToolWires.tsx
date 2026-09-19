import React from 'react'

/**
 * Fils de Bézier reliant les cartes d'outils, comme les nœuds d'un graphe.
 * Décoratif : masqué sous 1024 px, où les cartes s'empilent.
 */
export function ToolWires() {
  return (
    <svg
      className="pointer-events-none absolute inset-x-0 top-[84px] hidden h-16 w-full lg:block"
      viewBox="0 0 100 10"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M31 3 C 34 3, 34 7, 37 7"
        stroke="var(--cyan)"
        strokeOpacity="0.35"
        strokeWidth="0.25"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M64 7 C 67 7, 67 3, 70 3"
        stroke="#7C5CFF"
        strokeOpacity="0.35"
        strokeWidth="0.25"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx="31" cy="3" r="0.5" fill="var(--cyan)" fillOpacity="0.6" />
      <circle cx="37" cy="7" r="0.5" fill="var(--cyan)" fillOpacity="0.6" />
      <circle cx="64" cy="7" r="0.5" fill="#7C5CFF" fillOpacity="0.6" />
      <circle cx="70" cy="3" r="0.5" fill="#7C5CFF" fillOpacity="0.6" />
    </svg>
  )
}
