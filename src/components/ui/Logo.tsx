import React from 'react'

export function Logo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M11 2 L19 6.5 V15.5 L11 20 L3 15.5 V6.5 Z" stroke="var(--cyan)" strokeWidth="1.3" />
      <circle cx="11" cy="11" r="3" fill="var(--cyan)" />
      <circle cx="11" cy="2" r="1.6" fill="var(--bg)" stroke="var(--cyan)" strokeWidth="1.2" />
      <circle cx="19" cy="15.5" r="1.6" fill="var(--bg)" stroke="var(--cyan)" strokeWidth="1.2" />
      <circle cx="3" cy="15.5" r="1.6" fill="var(--bg)" stroke="var(--cyan)" strokeWidth="1.2" />
    </svg>
  )
}
