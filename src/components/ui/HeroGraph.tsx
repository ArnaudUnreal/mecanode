'use client'

import { motion, useReducedMotion } from 'motion/react'
import React from 'react'

const wires = [
  { d: 'M148 96 C 210 96, 200 168, 262 168', stroke: 'url(#wire-cyan)', width: 2 },
  { d: 'M148 128 C 214 128, 206 214, 262 214', stroke: 'url(#wire-violet)', width: 1.8 },
  { d: 'M404 190 C 452 190, 448 268, 498 268', stroke: 'url(#wire-orange)', width: 2 },
  { d: 'M148 290 C 208 290, 206 244, 262 244', stroke: 'url(#wire-cyan)', width: 1.6 },
]

/**
 * Carte de graphe du héros, reprise de `02-Maquettes/node-graph/index.html`.
 * Les fils se tracent à l'affichage, sauf sous `prefers-reduced-motion`.
 */
export function HeroGraph({ title }: { title: string }) {
  const reduced = useReducedMotion()

  return (
    <div className="clip-node-lg relative border border-line bg-linear-to-br from-[#1B1136] to-[#0B0716] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]">
      <div className="flex items-center gap-2.5 border-b border-line-soft bg-white/[0.012] px-4 py-3 text-ink-3">
        <span className="mr-1.5 flex gap-1.5" aria-hidden="true">
          <i className="block h-2.5 w-2.5 rounded-full bg-[#2A2340]" />
          <i className="block h-2.5 w-2.5 rounded-full bg-[#2A2340]" />
          <i className="block h-2.5 w-2.5 rounded-full bg-[#2A2340]" />
        </span>
        <span className="font-mono text-[11px] tracking-[0.08em] uppercase">{title}</span>
      </div>

      <div className="graph-dots relative h-[300px] sm:h-[392px]">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 560 392"
          fill="none"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="wire-cyan" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#2BE5FF" stopOpacity="0.25" />
              <stop offset="1" stopColor="#2BE5FF" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="wire-violet" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#7C5CFF" stopOpacity="0.2" />
              <stop offset="1" stopColor="#7C5CFF" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="wire-orange" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#FF7A2F" stopOpacity="0.2" />
              <stop offset="1" stopColor="#FF7A2F" stopOpacity="0.85" />
            </linearGradient>
          </defs>

          {wires.map((wire, index) =>
            reduced ? (
              <path key={wire.d} d={wire.d} stroke={wire.stroke} strokeWidth={wire.width} />
            ) : (
              <motion.path
                key={wire.d}
                d={wire.d}
                stroke={wire.stroke}
                strokeWidth={wire.width}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.15 + index * 0.12, ease: 'easeOut' }}
              />
            ),
          )}

          <g>
            <rect x="26" y="70" width="122" height="80" rx="6" fill="#171227" stroke="#2A2340" />
            <rect x="26" y="70" width="122" height="20" rx="6" fill="#C0392B" fillOpacity="0.85" />
            <rect x="26" y="84" width="122" height="6" fill="#171227" />
            <text x="38" y="77" dominantBaseline="central" fill="#F4E4E2" fontFamily="JetBrains Mono, monospace" fontSize="9.5">
              Event BeginPlay
            </text>
            <circle cx="148" cy="96" r="4" fill="#2BE5FF" />
            <circle cx="148" cy="128" r="4" fill="#7C5CFF" />
            <text x="38" y="112" fill="#7D8798" fontFamily="JetBrains Mono, monospace" fontSize="8.5">
              Exec
            </text>
            <text x="38" y="132" fill="#7D8798" fontFamily="JetBrains Mono, monospace" fontSize="8.5">
              Context
            </text>
          </g>

          <g>
            <rect x="262" y="146" width="142" height="104" rx="6" fill="#171227" stroke="#33294A" />
            <rect x="262" y="146" width="142" height="20" rx="6" fill="#1F6E8C" fillOpacity="0.9" />
            <rect x="262" y="160" width="142" height="6" fill="#171227" />
            <text x="274" y="153" dominantBaseline="central" fill="#DCF3F8" fontFamily="JetBrains Mono, monospace" fontSize="9.5">
              Mecanode Spawn
            </text>
            <circle cx="262" cy="168" r="4" fill="#2BE5FF" />
            <circle cx="262" cy="214" r="4" fill="#7C5CFF" />
            <circle cx="262" cy="244" r="4" fill="#2BE5FF" fillOpacity="0.7" />
            <circle cx="404" cy="190" r="4" fill="#FF7A2F" />
            <text x="274" y="192" fill="#7D8798" fontFamily="JetBrains Mono, monospace" fontSize="8.5">
              Grid Size
            </text>
            <text x="274" y="212" fill="#7D8798" fontFamily="JetBrains Mono, monospace" fontSize="8.5">
              Seed
            </text>
            <text x="274" y="232" fill="#7D8798" fontFamily="JetBrains Mono, monospace" fontSize="8.5">
              Collision
            </text>
          </g>

          <g>
            <rect x="26" y="262" width="122" height="62" rx="6" fill="#171227" stroke="#2A2340" />
            <rect x="26" y="262" width="122" height="18" rx="6" fill="#3B2A7A" fillOpacity="0.9" />
            <rect x="26" y="274" width="122" height="6" fill="#171227" />
            <text x="38" y="268" dominantBaseline="central" fill="#DDD6F6" fontFamily="JetBrains Mono, monospace" fontSize="9">
              Get Profile
            </text>
            <circle cx="148" cy="290" r="4" fill="#2BE5FF" fillOpacity="0.7" />
          </g>

          <g>
            <rect x="498" y="240" width="46" height="56" rx="6" fill="#171227" stroke="#3A2A1E" />
            <rect x="498" y="240" width="46" height="16" rx="6" fill="#B85C1E" fillOpacity="0.85" />
            <rect x="498" y="251" width="46" height="5" fill="#171227" />
            <circle cx="498" cy="268" r="4" fill="#FF7A2F" />
            <text x="508" y="245.5" dominantBaseline="central" fill="#F6E2D4" fontFamily="JetBrains Mono, monospace" fontSize="8">
              Add
            </text>
          </g>

          <circle cx="262" cy="168" r="8" fill="#2BE5FF" fillOpacity="0.14" />
          <circle cx="404" cy="190" r="8" fill="#FF7A2F" fillOpacity="0.14" />
        </svg>
      </div>
    </div>
  )
}
