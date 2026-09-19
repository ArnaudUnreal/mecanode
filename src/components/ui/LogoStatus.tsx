import React from 'react'

const tones = {
  success: { stroke: '#3FD98B', glow: 'rgba(63,217,139,0.45)' },
  error: { stroke: '#FF5964', glow: 'rgba(255,89,100,0.45)' },
} as const

/**
 * Déclinaison du logo Mecanode en état : le même hexagone, avec une coche verte
 * ou une croix rouge à la place du nœud central.
 */
export function LogoStatus({
  variant,
  size = 40,
}: {
  variant: keyof typeof tones
  size?: number
}) {
  const tone = tones[variant]

  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path
        d="M11 2 L19 6.5 V15.5 L11 20 L3 15.5 V6.5 Z"
        stroke={tone.stroke}
        strokeWidth="1.3"
        style={{ filter: `drop-shadow(0 0 6px ${tone.glow})` }}
      />
      <circle cx="11" cy="2" r="1.6" fill="var(--bg)" stroke={tone.stroke} strokeWidth="1.2" />
      <circle cx="19" cy="15.5" r="1.6" fill="var(--bg)" stroke={tone.stroke} strokeWidth="1.2" />
      <circle cx="3" cy="15.5" r="1.6" fill="var(--bg)" stroke={tone.stroke} strokeWidth="1.2" />
      {variant === 'success' ? (
        <path
          d="M7.2 11.2 L9.9 13.9 L15 8.4"
          stroke={tone.stroke}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M8 8 L14 14 M14 8 L8 14"
          stroke={tone.stroke}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      )}
    </svg>
  )
}
