import React from 'react'

export function SectionHead({
  label,
  title,
  lede,
  action,
}: {
  label?: string
  title: string
  lede?: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-11 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
      <div>
        {label ? (
          <span className="mb-3.5 block font-mono text-xs tracking-[0.08em] uppercase text-cyan-dim">
            {label}
          </span>
        ) : null}
        <h2 className="m-0 mb-2 text-[34px] font-bold tracking-[-0.025em]">{title}</h2>
        {lede ? <p className="m-0 max-w-[44ch] text-ink-2">{lede}</p> : null}
      </div>
      {action}
    </div>
  )
}
