import { getPathname } from '@/i18n/navigation'
import { engineRange, getPage, getSiteSettings, getTools } from '@/lib/content'
import { SITE_URL } from '@/lib/metadata'

export const dynamic = 'force-static'

type Href = Parameters<typeof getPathname>[0]['href']

const url = (href: Href, locale: 'en' | 'fr') => SITE_URL + getPathname({ href, locale })

/**
 * `llms.txt` : une carte du site en texte, pour les moteurs de réponse.
 * Il ne remplace pas `robots.txt` — celui-ci dit ce qui est permis, celui-là dit
 * où se trouve quoi. Le contenu vient de la base, il suit donc le catalogue.
 */
export async function GET(): Promise<Response> {
  const [settings, tools, about] = await Promise.all([
    getSiteSettings('en'),
    getTools('en'),
    getPage('about', 'en'),
  ])

  const lines: string[] = [
    `# ${settings.siteName}`,
    '',
    `> ${settings.tagline ?? ''}`,
    '',
    settings.lede ?? '',
    '',
    '## Tools',
    '',
    ...tools.map((tool) => {
      const range = engineRange(tool.engineVersions)
      const versions = range ? ` Unreal Engine ${range}.` : ''

      return `- [${tool.name}](${url({ pathname: '/tools/[slug]', params: { slug: tool.slug } }, 'en')}): ${tool.tagline}${versions} Sold on Fab: ${tool.fabUrl}`
    }),
    '',
    '## Pages',
    '',
    `- [Home](${url('/', 'en')}): the toolset, the work, the teaching.`,
    `- [Gallery](${url('/gallery', 'en')}): every screenshot from the tools.`,
    `- [About](${url('/about', 'en')}): ${about?.lede ?? 'Profile and teaching.'}`,
    `- [Contact](${url('/contact', 'en')}): contact form, no account needed.`,
    '',
    '## French',
    '',
    `The whole site exists in French under /fr, with translated paths.`,
    '',
    `- [Accueil](${url('/', 'fr')})`,
    `- [Galerie](${url('/gallery', 'fr')})`,
    `- [Profil](${url('/about', 'fr')})`,
    `- [Contact](${url('/contact', 'fr')})`,
    ...tools.map(
      (tool) =>
        `- [${tool.name}](${url({ pathname: '/tools/[slug]', params: { slug: tool.slug } }, 'fr')})`,
    ),
    '',
    '## Terms',
    '',
    '- Quoting a page with a link back is welcome.',
    '- Training a model on this content is not allowed, see /robots.txt, ai-train=no.',
    '- Prices live on Fab and are never mirrored here.',
    '',
  ]

  return new Response(lines.join('\n'), {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}
