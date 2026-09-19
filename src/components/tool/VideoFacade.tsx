'use client'

import Image from 'next/image'
import React from 'react'

/** Transforme une URL YouTube ou Vimeo en URL d'intégration, sans cookie tiers pour YouTube. */
function embedUrl(url: string): string | null {
  const youtube = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{6,})/)
  if (youtube) return `https://www.youtube-nocookie.com/embed/${youtube[1]}?autoplay=1&rel=0`

  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1`

  return null
}

/**
 * Façade de lecteur vidéo : rien n'est demandé à YouTube ou Vimeo avant le clic.
 * Tant que le visiteur n'a pas cliqué, la page ne contient qu'une image et un bouton.
 */
export function VideoFacade({
  url,
  poster,
  posterAlt,
  label,
  className = 'relative aspect-video overflow-hidden rounded-xl border border-line bg-[#0C0914]',
}: {
  url: string
  poster?: string | null
  posterAlt?: string
  label: string
  className?: string
}) {
  const [playing, setPlaying] = React.useState(false)
  const embed = embedUrl(url)

  if (!embed) return null

  return (
    <div className={className}>
      {playing ? (
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
          src={embed}
          title={label}
        />
      ) : (
        <button
          className="group absolute inset-0 h-full w-full cursor-pointer"
          onClick={() => setPlaying(true)}
          type="button"
        >
          {poster ? (
            <Image
              alt={posterAlt ?? ''}
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              fill
              sizes="(max-width: 1024px) 100vw, 760px"
              src={poster}
            />
          ) : null}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-linear-to-b from-[rgba(6,8,12,0.35)] to-[rgba(6,8,12,0.75)]"
          />
          <span className="relative z-2 flex h-full w-full items-center justify-center">
            <span className="clip-node flex items-center gap-2.5 border border-line bg-[rgba(11,7,22,0.82)] px-[18px] py-2.5 text-[13.5px] font-semibold backdrop-blur-[6px]">
              <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true">
                <path d="M1 1 L11 7 L1 13 Z" fill="var(--cyan)" />
              </svg>
              {label}
            </span>
          </span>
        </button>
      )}
    </div>
  )
}
