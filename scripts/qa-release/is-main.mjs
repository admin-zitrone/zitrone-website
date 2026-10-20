/**
 * True when the module is the process entry point. Compares real paths:
 * macOS TMPDIR (/var/folders -> /private/var/folders) and symlinked checkouts
 * make a plain URL comparison silently false, and the CLI would exit 0
 * without doing anything.
 */
import { realpathSync } from "node:fs"
import { fileURLToPath } from "node:url"

export function isMain(moduleUrl) {
  if (!process.argv[1]) return false
  try {
    return realpathSync(process.argv[1]) === realpathSync(fileURLToPath(moduleUrl))
  } catch {
    return false
  }
}
