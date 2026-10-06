import { revalidatePath } from 'next/cache'
import type { PayloadRequest } from 'payload'

/**
 * Régénère tout le front après une écriture dans l'admin : une page, un outil ou un réglage
 * peuvent apparaître sur n'importe quelle route, dans les deux langues.
 *
 * Hors d'une requête Next (seed, `payload run`, migrations), `revalidatePath` lève une erreur :
 * il n'y a alors aucun cache à vider, l'écriture continue.
 */
function revalidateSite(req: PayloadRequest): void {
  try {
    revalidatePath('/', 'layout')
  } catch {
    req.payload.logger.debug('Régénération ignorée : écriture hors requête Next.')
  }
}

/** Convient aux collections comme aux globals. */
export function revalidateAfterChange<T>({ doc, req }: { doc: T; req: PayloadRequest }): T {
  revalidateSite(req)
  return doc
}

export function revalidateAfterDelete<T>({ doc, req }: { doc: T; req: PayloadRequest }): T {
  revalidateSite(req)
  return doc
}
