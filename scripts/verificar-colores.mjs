
import fs from 'node:fs';
import path from 'node:path';

const allowed = new Set(['src/tema', 'src/theme']);
const errors = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return;

  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    const normalized = f.replaceAll('\\', '/');

    if (e.isDirectory()) {
      walk(f);
      continue;
    }

    if (!/\.[jt]sx?$/.test(f)) continue;

    if ([...allowed].some(d => normalized.startsWith(d + '/'))) {
      continue;
    }

    const content = fs.readFileSync(f, 'utf8');

    if (/#[0-9a-f]{3,8}\b/i.test(content)) {
      errors.push(f);
    }
  }
}

walk('src');

if (errors.length) {
  console.error('Colores hexadecimales fuera del tema:', errors.join(', '));
  process.exitCode = 1;
} else {
  console.log('Sin colores hexadecimales fuera del tema');
}
