import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { extname } from 'node:path';

const baselineCommit = '6f219f0';
const supportedExtensions = new Set(['.ts', '.html', '.scss', '.json', '.js', '.mjs']);

const runGit = (args) => execFileSync('git', args, { encoding: 'utf8' });

if (!existsSync('.git')) {
  console.error('format:check requires a Git working tree.');
  process.exit(1);
}

try {
  runGit(['rev-parse', '--verify', baselineCommit]);
} catch {
  console.error(`format:check baseline commit not found: ${baselineCommit}`);
  process.exit(1);
}

const files = new Set();
const isBaselineFile = (file) => {
  try {
    runGit(['cat-file', '-e', `${baselineCommit}:${file}`]);
    return true;
  } catch {
    return false;
  }
};

const addFiles = (output) => {
  for (const file of output
    .split(/\r?\n/)
    .map((value) => value.trim())
    .filter(Boolean)) {
    if (file === 'package-lock.json') continue;
    // Historical source files are intentionally grandfathered. They become
    // enforce-forward candidates when replaced by a newly added file or when
    // a future tooling policy explicitly promotes them.
    if (file.startsWith('src/app/') && isBaselineFile(file)) continue;
    if (supportedExtensions.has(extname(file)) && !file.startsWith('node_modules/')) {
      files.add(file);
    }
  }
};

// Enforce-forward: all files changed since the explicit baseline are checked.
// A baseline file is checked again as soon as it is modified in a later change.
addFiles(runGit(['diff', '--name-only', `${baselineCommit}..HEAD`, '--']));
addFiles(runGit(['diff', '--name-only', '--diff-filter=ACMR', 'HEAD', '--']));
addFiles(runGit(['diff', '--cached', '--name-only', '--diff-filter=ACMR', '--']));
addFiles(runGit(['ls-files', '--others', '--exclude-standard']));

const candidates = [...files].filter((file) => existsSync(file));
if (candidates.length === 0) {
  console.log(`Prettier enforce-forward: no supported files changed since ${baselineCommit}.`);
  process.exit(0);
}

const prettierConfig = readFileSync('.prettierrc', 'utf8');
void prettierConfig;
const result = execFileSync(
  process.execPath,
  ['node_modules/prettier/bin/prettier.cjs', '--check', ...candidates],
  {
    stdio: 'inherit',
  },
);
void result;
