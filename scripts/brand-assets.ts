/**
 * Génère les icônes et l'image de partage à partir du logo.
 * Exécuté à la main par `pnpm brand:assets`, les fichiers produits sont versionnés.
 */
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const APP = path.resolve(process.cwd(), 'src/app')

const BG = '#0B0716'
const CYAN = '#2BE5FF'
const INK = '#EAE7F4'
const DOT = '#1E1830'

const mark = (size: number, stroke = 1.3) => `
  <g transform="translate(${size / 2 - 11} ${size / 2 - 11})">
    <path d="M11 2 L19 6.5 V15.5 L11 20 L3 15.5 V6.5 Z" stroke="${CYAN}" stroke-width="${stroke}" fill="none"/>
    <circle cx="11" cy="11" r="3" fill="${CYAN}"/>
    <circle cx="11" cy="2" r="1.6" fill="${BG}" stroke="${CYAN}" stroke-width="1.2"/>
    <circle cx="19" cy="15.5" r="1.6" fill="${BG}" stroke="${CYAN}" stroke-width="1.2"/>
    <circle cx="3" cy="15.5" r="1.6" fill="${BG}" stroke="${CYAN}" stroke-width="1.2"/>
  </g>`

function icon(size: number): string {
  const scale = size / 22 / 1.6

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" rx="${size * 0.18}" fill="${BG}"/>
    <g transform="translate(${size / 2} ${size / 2}) scale(${scale}) translate(${-size / 2} ${-size / 2})">
      ${mark(size, 1.1)}
    </g>
  </svg>`
}

function openGraph(): string {
  const dots: string[] = []
  for (let row = 0; row < 25; row += 1) {
    for (let col = 0; col < 47; col += 1) {
      dots.push(`<circle cx="${20 + col * 26}" cy="${20 + row * 26}" r="1.6"/>`)
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="${BG}"/>
    <g fill="${DOT}">${dots.join('')}</g>
    <path d="M120 470 C 300 470, 260 250, 440 250" stroke="${CYAN}" stroke-opacity="0.5" stroke-width="4" fill="none"/>
    <path d="M760 250 C 940 250, 900 470, 1080 470" stroke="#FF7A2F" stroke-opacity="0.4" stroke-width="4" fill="none"/>
    <g transform="translate(600 250) scale(6) translate(-11 -11)">
      <path d="M11 2 L19 6.5 V15.5 L11 20 L3 15.5 V6.5 Z" stroke="${CYAN}" stroke-width="1.1" fill="none"/>
      <circle cx="11" cy="11" r="3" fill="${CYAN}"/>
      <circle cx="11" cy="2" r="1.6" fill="${BG}" stroke="${CYAN}" stroke-width="1"/>
      <circle cx="19" cy="15.5" r="1.6" fill="${BG}" stroke="${CYAN}" stroke-width="1"/>
      <circle cx="3" cy="15.5" r="1.6" fill="${BG}" stroke="${CYAN}" stroke-width="1"/>
    </g>
    <text x="600" y="470" fill="${INK}" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="86" font-weight="800" letter-spacing="14" text-anchor="middle">MECANODE</text>
    <text x="600" y="530" fill="#A197C0" font-family="Consolas, Courier New, monospace" font-size="28" letter-spacing="6" text-anchor="middle">UNREAL ENGINE TOOLS</text>
  </svg>`
}

async function main() {
  await sharp(Buffer.from(icon(512))).png().toFile(path.join(APP, 'icon.png'))
  await sharp(Buffer.from(icon(180))).png().toFile(path.join(APP, 'apple-icon.png'))
  await sharp(Buffer.from(openGraph())).png().toFile(path.join(APP, 'opengraph-image.png'))

  for (const file of ['icon.png', 'apple-icon.png', 'opengraph-image.png']) {
    const { size } = fs.statSync(path.join(APP, file))
    console.log(`${file} : ${Math.round(size / 1024)} Ko`)
  }
}

await main()
