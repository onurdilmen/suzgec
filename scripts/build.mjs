/*
 * Chrome injects a given script file only once per frame, even across worlds.
 * The MAIN world therefore needs its own copy of heuristics.js.
 */
import { copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const src = fileURLToPath(new URL('../src/heuristics.js', import.meta.url));
const dest = fileURLToPath(new URL('../src/heuristics.main.js', import.meta.url));
copyFileSync(src, dest);
process.stdout.write('src/heuristics.main.js updated\n');
