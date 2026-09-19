/**
 * Vérifie le contraste des couples de couleurs du thème, règle WCAG 2.1 niveau AA :
 * 4,5:1 pour le texte courant, 3:1 pour le grand texte et les bordures d'interface.
 * `pnpm check:contrast`
 */

const TOKENS: Record<string, string> = {
  bg: '#0B0716',
  'bg-2': '#120C22',
  panel: '#191030',
  'panel-2': '#20163B',
  line: '#33224F',
  'line-strong': '#6F5F99',
  champ: '#0C0914',
  'line-soft': '#281A40',
  ink: '#EAE7F4',
  'ink-2': '#A197C0',
  'ink-3': '#8677B3',
  cyan: '#2BE5FF',
  'cyan-dim': '#1391A6',
  orange: '#FF7A2F',
  violet: '#6D4AEF',
  'violet-soft': '#A594FF',
  'orange-ink': '#1A0D04',
  'orange-button': '#F4661A',
  success: '#3FD98B',
  error: '#FF5964',
  'error-text': '#FF8A93',
}

type Check = { texte: string; fond: string; seuil: number; usage: string }

const CHECKS: Check[] = [
  { texte: 'ink', fond: 'bg', seuil: 4.5, usage: 'texte courant sur le fond' },
  { texte: 'ink-2', fond: 'bg', seuil: 4.5, usage: 'texte secondaire sur le fond' },
  { texte: 'ink-2', fond: 'panel', seuil: 4.5, usage: 'texte secondaire sur une carte' },
  { texte: 'ink-3', fond: 'bg', seuil: 4.5, usage: 'mentions mono sur le fond' },
  { texte: 'ink-3', fond: 'bg-2', seuil: 4.5, usage: 'libellés du bandeau de chiffres' },
  { texte: 'ink-3', fond: 'panel', seuil: 4.5, usage: 'identifiant sur une carte' },
  { texte: 'cyan', fond: 'bg', seuil: 4.5, usage: 'accents et liens actifs' },
  { texte: 'cyan-dim', fond: 'bg', seuil: 4.5, usage: 'étiquettes de section' },
  { texte: 'orange', fond: 'bg', seuil: 4.5, usage: 'lien Fab sur le fond' },
  { texte: 'orange', fond: 'panel', seuil: 4.5, usage: 'lien Fab sur une carte' },
  { texte: 'violet-soft', fond: 'bg', seuil: 4.5, usage: 'petites étiquettes' },
  { texte: 'orange-ink', fond: 'orange-button', seuil: 4.5, usage: 'texte du bouton Fab' },
  { texte: 'success', fond: 'bg', seuil: 4.5, usage: 'confirmation du formulaire' },
  { texte: 'error-text', fond: 'bg', seuil: 4.5, usage: "message d'erreur" },
  { texte: 'line-strong', fond: 'champ', seuil: 3, usage: 'bordure des champs de saisie' },
  { texte: 'line-strong', fond: 'panel', seuil: 3, usage: 'bordure des boutons sans libellé' },
  { texte: 'line-strong', fond: 'bg', seuil: 3, usage: 'bordure de contrôle sur le fond' },
  { texte: 'cyan', fond: 'panel', seuil: 3, usage: 'contour de focus sur un panneau' },
]

function channel(value: number): number {
  const v = value / 255

  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
}

function luminance(hex: string): number {
  const n = parseInt(hex.replace('#', ''), 16)
  const r = channel((n >> 16) & 255)
  const g = channel((n >> 8) & 255)
  const b = channel(n & 255)

  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function ratio(a: string, b: string): number {
  const l1 = luminance(a)
  const l2 = luminance(b)

  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
}

let echecs = 0

for (const check of CHECKS) {
  const value = ratio(TOKENS[check.texte], TOKENS[check.fond])
  const ok = value >= check.seuil
  if (!ok) echecs += 1

  const verdict = ok ? 'OK  ' : 'ECHEC'
  const couple = `${check.texte} sur ${check.fond}`.padEnd(28)
  console.log(
    `${verdict} ${couple} ${value.toFixed(2)}:1 (seuil ${check.seuil}) — ${check.usage}`,
  )
}

console.log(`\n${CHECKS.length - echecs} couples conformes, ${echecs} en échec.`)
process.exit(echecs > 0 ? 1 : 0)
