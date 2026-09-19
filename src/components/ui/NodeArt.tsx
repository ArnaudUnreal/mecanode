import React from 'react'

const accents = {
  cyan: { wire: 'var(--cyan)', head: '#1F6E8C' },
  violet: { wire: '#7C5CFF', head: '#3B2A7A' },
  orange: { wire: 'var(--orange)', head: '#8C4A1C' },
} as const

/** Vignette de nœud Blueprint : deux nœuds reliés par un fil de Bézier. */
export function NodeArt({ accent = 'cyan' }: { accent?: keyof typeof accents }) {
  const tone = accents[accent]

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 320 168"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect width="320" height="168" fill="var(--bg)" />
      <path
        d="M96 60 C 140 60, 132 108, 176 108"
        stroke={tone.wire}
        strokeWidth="2"
        strokeOpacity="0.85"
      />
      <g>
        <rect x="24" y="42" width="72" height="44" rx="5" fill="#171227" stroke="#2A2340" />
        <rect x="24" y="42" width="72" height="13" rx="5" fill={tone.head} fillOpacity="0.9" />
        <rect x="24" y="51" width="72" height="4" fill="#171227" />
        <circle cx="96" cy="60" r="3.4" fill={tone.wire} />
      </g>
      <g>
        <rect x="176" y="86" width="86" height="52" rx="5" fill="#171227" stroke="#33294A" />
        <rect x="176" y="86" width="86" height="13" rx="5" fill={tone.head} fillOpacity="0.7" />
        <rect x="176" y="95" width="86" height="4" fill="#171227" />
        <circle cx="176" cy="108" r="3.4" fill={tone.wire} />
      </g>
    </svg>
  )
}
