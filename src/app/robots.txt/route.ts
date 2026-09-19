import { SITE_URL } from '@/lib/metadata'

export const dynamic = 'force-static'

/**
 * `robots.txt` écrit à la main plutôt que par la convention Next : celle-ci ne sait pas
 * produire les signaux de contenu, qui ne sont pas des règles d'exploration.
 *
 * Trois déclarations, selon la Content Signals Policy :
 *   search=yes     — indexer et afficher dans les résultats de recherche
 *   ai-input=yes   — citer la page dans une réponse générée, avec le lien
 *   ai-train=no    — interdit d'entraîner un modèle sur ce contenu
 *
 * Les signaux sont déclaratifs. Les robots dont le seul métier est de collecter du
 * corpus d'entraînement sont donc refusés explicitement, tandis que ceux qui servent
 * la recherche et la citation restent autorisés.
 */
const CONTENT_SIGNAL = 'search=yes, ai-input=yes, ai-train=no'

const TRAINING_BOTS = ['GPTBot', 'ClaudeBot', 'Google-Extended', 'Applebot-Extended', 'CCBot']

const ANSWER_BOTS = [
  'OAI-SearchBot',
  'ChatGPT-User',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
]

export function GET(): Response {
  const lines = [
    '# Mecanode',
    '#',
    '# Content Signals Policy : ce que vous avez le droit de faire de ce contenu.',
    '#   search=yes    indexation et affichage dans les résultats de recherche',
    "#   ai-input=yes  citation dans une réponse générée, avec le lien vers l'original",
    "#   ai-train=no   entraînement d'un modèle sur ce contenu : refusé",
    '',
    'User-agent: *',
    `Content-Signal: ${CONTENT_SIGNAL}`,
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /api',
    '',
    "# Robots dont le métier est de collecter du corpus d'entraînement.",
    ...TRAINING_BOTS.flatMap((bot) => [`User-agent: ${bot}`, 'Disallow: /', '']),
    '# Robots de recherche et de citation : bienvenue.',
    ...ANSWER_BOTS.flatMap((bot) => [
      `User-agent: ${bot}`,
      `Content-Signal: ${CONTENT_SIGNAL}`,
      'Allow: /',
      'Disallow: /admin',
      'Disallow: /api',
      '',
    ]),
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ]

  return new Response(lines.join('\n'), {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}
