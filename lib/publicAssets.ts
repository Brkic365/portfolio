import { existsSync } from 'fs';
import path from 'path';

/**
 * Whether a file is present in /public, checked at build time.
 *
 * Used to hide links and images whose files have not been added yet, so the
 * site never ships a 404. Drop the file in and it appears on the next build,
 * no code change needed.
 */
export function publicFileExists(relativePath: string): boolean {
  return existsSync(path.join(process.cwd(), 'public', relativePath.replace(/^\//, '')));
}
