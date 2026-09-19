import React from 'react'

type Variant = 'default' | 'fab' | 'ghost'

const base =
  'clip-node inline-flex items-center gap-2.5 border px-[18px] py-2.5 text-[13.5px] font-semibold transition-colors'

const variants: Record<Variant, string> = {
  default: 'border-line bg-panel text-ink hover:border-[#3A2F55] hover:bg-panel-2',
  // L'orange est réservé aux actions qui mènent à Fab.
  fab: 'border-[#FF9A5E] bg-linear-to-b from-[#FF8B45] to-[#F4661A] text-[#1A0D04] hover:from-[#FF9A5E] hover:to-[#FF7A2F]',
  ghost: 'border-line bg-transparent text-ink hover:border-[#3A2F55] hover:bg-panel-2',
}

export type ButtonProps = {
  variant?: Variant
  className?: string
  children: React.ReactNode
} & React.AnchorHTMLAttributes<HTMLAnchorElement>

/** Bouton-lien aux angles coupés, repris des maquettes Node Graph. */
export function ButtonLink({ variant = 'default', className = '', children, ...props }: ButtonProps) {
  return (
    <a className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </a>
  )
}

export function ArrowRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M2 6 H10 M6.5 2.5 L10 6 L6.5 9.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  )
}

export function ArrowUpRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M2.5 9.5 L9.5 2.5 M4.5 2.5 H9.5 V7.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="square"
      />
    </svg>
  )
}
