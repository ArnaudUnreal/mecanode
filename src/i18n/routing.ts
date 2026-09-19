import { defineRouting } from 'next-intl/routing'

/**
 * Les adresses sont traduites langue par langue. Les chemins de gauche sont ceux du code,
 * ceux de droite ce que le visiteur voit. L'identifiant d'un outil ne change jamais :
 * une fiche garde la même adresse dans les deux langues.
 */
export const routing = defineRouting({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  pathnames: {
    '/': '/',
    '/tools/[slug]': {
      en: '/tools/[slug]',
      fr: '/outils/[slug]',
    },
    '/gallery': {
      en: '/gallery',
      fr: '/galerie',
    },
    '/about': {
      en: '/about',
      fr: '/profil',
    },
    '/contact': {
      en: '/contact',
      fr: '/contact',
    },
  },
})

export type Pathnames = keyof typeof routing.pathnames
