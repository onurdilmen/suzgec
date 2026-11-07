/*
 * 1. Chrome injects a given script file only once per frame, even across worlds:
 *    the MAIN world gets its own copy of heuristics.js.
 * 2. The service worker imports npm packages (AdGuard Scriptlets): bundle it.
 */
import { copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const at = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));

copyFileSync(at('src/heuristics.js'), at('src/heuristics.main.js'));

await build({
  entryPoints: [at('src/background.js')],
  outfile: at('build/background.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'chrome118',
  legalComments: 'eof',
  logLevel: 'warning',
});
process.stdout.write('src/heuristics.main.js + build/background.js updated\n');
