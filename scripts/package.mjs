/*
 * Builds the Chrome Web Store upload: dist/suzgec-<version>.zip containing only the
 * files the extension loads at runtime (plus license notices required by GPLv3).
 */
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, rm } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const { version } = JSON.parse(await readFile(path.join(root, 'manifest.json'), 'utf8'));
const INCLUDE = ['manifest.json', 'LICENSE', 'NOTICE.md', 'icons', 'popup', 'build', 'rules', 'redirects', 'src'];
// Bundled into build/background.js; shipping the sources twice only adds weight.
const EXCLUDE = ['src/background.js', 'src/filter-match.js', '*.DS_Store'];

const out = path.join(root, 'dist', `suzgec-${version}.zip`);
await mkdir(path.dirname(out), { recursive: true });
await rm(out, { force: true });
execFileSync('zip', ['-r', '-X', '-q', out, ...INCLUDE, '-x', ...EXCLUDE], { cwd: root, stdio: 'inherit' });
console.log(out);
