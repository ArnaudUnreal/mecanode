import React from 'react'

/**
 * Données structurées. Le contenu vient de la base : il décrit la page telle qu'elle est
 * affichée, jamais autre chose — c'est la règle de Google comme celle du bon sens.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Le JSON est produit ici, aucune saisie libre n'y entre sans passer par JSON.stringify.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
