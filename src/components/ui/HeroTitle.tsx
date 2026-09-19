import React from 'react'

/**
 * Titre du héros venu du back-office : les retours à la ligne sont respectés,
 * la portion encadrée par des astérisques passe en cyan.
 */
export function HeroTitle({ value }: { value: string }) {
  const lines = value.split('\n')

  return (
    <h1 className="m-0 mb-5 text-[34px] leading-[1.04] font-extrabold tracking-[-0.033em] sm:text-[42px] lg:text-6xl">
      {lines.map((line, lineIndex) => (
        <React.Fragment key={lineIndex}>
          {lineIndex > 0 ? <br /> : null}
          {line.split(/(\*[^*]+\*)/).map((part, partIndex) =>
            part.startsWith('*') && part.endsWith('*') ? (
              <em
                key={partIndex}
                className="text-cyan not-italic drop-shadow-[0_0_34px_rgba(43,229,255,0.35)]"
              >
                {part.slice(1, -1)}
              </em>
            ) : (
              <React.Fragment key={partIndex}>{part}</React.Fragment>
            ),
          )}
        </React.Fragment>
      ))}
    </h1>
  )
}
