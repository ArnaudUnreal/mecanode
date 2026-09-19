import React from 'react'

export type SocialItem = { label: string; url: string; aria: string }

/**
 * Marque Fab, reprise du logo officiel servi par fab.com.
 * Rendue en monochrome pour tenir dans le thème, comme le reste de l'en-tête.
 */
function FabIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.9685 10.3752H10.7483L10.5046 11.6247H19.2217L18.8713 13.4111C21.7765 9.36029 22.6495 5.21198 20.7187 3.28117C18.5048 1.06732 13.3757 2.53957 8.82086 6.53462H20.7001L19.9685 10.3752Z" />
      <path d="M9.39216 17.4159H3.29625L4.39709 11.678C2.08938 15.3651 1.52326 18.961 3.28101 20.7187C5.68866 23.1264 11.5439 21.1745 16.3592 16.3593C16.8659 15.8526 17.3409 15.3343 17.7824 14.8096H9.8952L9.39216 17.4159Z" />
      <path d="M5.38429 6.53492L8.82086 6.53462C8.42233 6.88441 8.02838 7.25338 7.64081 7.64094C6.34131 8.94043 5.25022 10.3152 4.39709 11.678L5.38429 6.53492Z" />
    </svg>
  )
}

/** Marque LinkedIn, reprise du logo officiel servi par static.licdn.com. */
function LinkedInIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 64 64" fill="currentColor" aria-hidden="true">
      <path d="M55.92,4H8.08A4.08,4.08,0,0,0,4,8.08V55.92A4.08,4.08,0,0,0,8.08,60H55.92A4.08,4.08,0,0,0,60,55.92V8.08A4.08,4.08,0,0,0,55.92,4ZM20,52H12V25h8ZM16,20.7a4.7,4.7,0,0,1,0-9.4h0a4.7,4.7,0,0,1,0,9.4ZM52,52H44V37.81c0-4.31-2.73-6.11-5-6.11a5.82,5.82,0,0,0-6,6.21V52H25V25h7.53v3.79h.11c.8-1.64,4.44-4.37,9.13-4.37S52,27.59,52,35.76Z" />
    </svg>
  )
}

const icons: Record<string, React.ReactNode> = {
  fab: <FabIcon />,
  linkedin: <LinkedInIcon />,
}

/**
 * Raccourcis vers les profils extérieurs, dans l'en-tête. Les mêmes liens restent
 * listés en toutes lettres dans le pied de page.
 */
export function SocialLinks({
  items,
  className = '',
}: {
  items: SocialItem[]
  className?: string
}) {
  const known = items.filter((item) => icons[item.label.toLowerCase()])
  if (known.length === 0) return null

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {known.map((item) => (
        <a
          aria-label={item.aria}
          className="clip-node flex h-9 w-9 items-center justify-center border border-line-strong bg-panel text-ink-2 transition-colors hover:border-cyan hover:text-cyan"
          href={item.url}
          key={item.label}
          rel="noopener noreferrer"
          target="_blank"
          title={item.label}
        >
          {icons[item.label.toLowerCase()]}
        </a>
      ))}
    </div>
  )
}
