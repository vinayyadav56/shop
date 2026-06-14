#!/usr/bin/env node
/**
 * PlantAtHome — AI locale generator.
 *
 * Translates an i18next/next-i18next English locale folder into every target language using
 * Claude, preserving keys, interpolation placeholders ({{x}}, {x}, $t(...)), HTML tags, URLs and
 * the brand name. Safe to re-run: existing <lang>/<file>.json are skipped unless --force.
 *
 * Reusable for shop, admin and (with --src pointed at the app's strings) the mobile app.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-... node scripts/translate-locales.mjs \
 *     --src public/locales/en --out public/locales \
 *     --langs hi,bn,ta,te,mr,gu,kn,ml,pa,or,as,ur,sa,ne,kok,mai,doi,ks,sd,sat,mni,brx \
 *     [--files common,banner,faq,policy,terms] [--force] [--model claude-sonnet-4-6] [--concurrency 4]
 *
 * Cost note: for very large catalogs prefer the Batches API (50% cheaper). This tool is sync with
 * limited concurrency — fine for UI strings (~tens of calls).
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { join, basename } from 'node:path';

const API_URL = 'https://api.anthropic.com/v1/messages';
const API_KEY = process.env.ANTHROPIC_API_KEY;

const LANG_NAMES = {
  hi: 'Hindi', bn: 'Bengali', ta: 'Tamil', te: 'Telugu', mr: 'Marathi', gu: 'Gujarati',
  kn: 'Kannada', ml: 'Malayalam', pa: 'Punjabi', or: 'Odia', as: 'Assamese', ur: 'Urdu',
  sa: 'Sanskrit', ne: 'Nepali', kok: 'Konkani', mai: 'Maithili', doi: 'Dogri', ks: 'Kashmiri',
  sd: 'Sindhi', sat: 'Santali', mni: 'Manipuri (Meitei)', brx: 'Bodo', en: 'English',
};

function arg(name, fallback = undefined) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const v = process.argv[i + 1];
  return v && !v.startsWith('--') ? v : true;
}

const SRC = arg('src', 'public/locales/en');
const OUT = arg('out', 'public/locales');
const FORCE = !!arg('force', false);
const MODEL = arg('model', 'claude-sonnet-4-6');
const CONCURRENCY = Number(arg('concurrency', 4));
const CHUNK = Number(arg('chunk', 80)); // keys per Claude call (keeps output within token limits)
const LANGS = String(arg('langs', Object.keys(LANG_NAMES).filter((l) => l !== 'en').join(',')))
  .split(',').map((s) => s.trim()).filter(Boolean);
const FILES = arg('files')
  ? String(arg('files')).split(',').map((s) => s.trim())
  : readdirSync(SRC).filter((f) => f.endsWith('.json')).map((f) => basename(f, '.json'));

if (!API_KEY) {
  console.error('ERROR: set ANTHROPIC_API_KEY in the environment.');
  process.exit(1);
}

// Flatten / unflatten nested JSON so we can chunk + translate leaf strings only.
// Path separator is a control char so real keys (which may contain '.') are preserved.
const SEP = String.fromCharCode(1);
function flatten(obj, prefix, out) {
  out = out || {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? prefix + SEP + k : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) flatten(v, key, out);
    else out[key] = v;
  }
  return out;
}
function unflatten(flat) {
  const out = {};
  for (const [key, v] of Object.entries(flat)) {
    const parts = key.split(SEP);
    let node = out;
    parts.forEach((p, i) => {
      if (i === parts.length - 1) node[p] = v;
      else node = node[p] = node[p] || {};
    });
  }
  return out;
}

function chunkEntries(entries, size) {
  const chunks = [];
  for (let i = 0; i < entries.length; i += size) chunks.push(entries.slice(i, i + size));
  return chunks;
}

async function translateChunk(pairs, langName) {
  const source = Object.fromEntries(pairs);
  const system =
    'You are a professional ' + langName + ' localizer for an Indian plant e-commerce app (PlantAtHome). ' +
    'Translate the VALUES of the given JSON object into natural, idiomatic ' + langName + ' for shoppers. ' +
    'Rules: (1) Return ONLY a JSON object with the SAME keys. (2) NEVER translate keys. ' +
    '(3) Preserve EXACTLY all interpolation placeholders ({{var}}, {var}, %s, %d, :name, $t(...)), ' +
    'HTML tags, markdown, URLs and emoji. (4) Keep the brand "PlantAtHome" and product/botanical ' +
    'proper nouns as-is. (5) If a value is empty or purely a placeholder/number, return it unchanged. ' +
    '(6) Keep it concise and UI-appropriate.';
  const body = {
    model: MODEL,
    max_tokens: 16000,
    system,
    messages: [{ role: 'user', content: 'Translate this JSON:\n' + JSON.stringify(source) }],
    output_config: {
      format: {
        type: 'json_schema',
        schema: {
          type: 'object',
          properties: Object.fromEntries(pairs.map(([k]) => [k, { type: 'string' }])),
          required: pairs.map(([k]) => k),
          additionalProperties: false,
        },
      },
    },
  };

  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(body),
      });
      if (res.status === 429 || res.status >= 500) throw new Error('retryable ' + res.status);
      if (!res.ok) throw new Error('API ' + res.status + ': ' + (await res.text()).slice(0, 300));
      const data = await res.json();
      const text = (data.content || []).find((b) => b.type === 'text')?.text ?? '';
      return JSON.parse(text);
    } catch (e) {
      if (attempt === 3) throw e;
      await new Promise((r) => setTimeout(r, 1500 * 2 ** attempt));
    }
  }
}

async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx], idx);
      }
    }),
  );
  return out;
}

async function translateFile(fileBase, lang) {
  const langName = LANG_NAMES[lang] || lang;
  const srcPath = join(SRC, fileBase + '.json');
  const outDir = join(OUT, lang);
  const outPath = join(outDir, fileBase + '.json');
  if (!existsSync(srcPath)) return;
  if (existsSync(outPath) && !FORCE) {
    console.log('  skip ' + lang + '/' + fileBase + '.json (exists)');
    return;
  }
  const flat = flatten(JSON.parse(readFileSync(srcPath, 'utf8')));
  const entries = Object.entries(flat);
  const chunks = chunkEntries(entries, CHUNK);
  const merged = {};
  for (let c = 0; c < chunks.length; c++) {
    const translated = await translateChunk(chunks[c], langName);
    Object.assign(merged, translated);
    process.stdout.write('  ' + lang + '/' + fileBase + ': chunk ' + (c + 1) + '/' + chunks.length + '\r');
  }
  mkdirSync(outDir, { recursive: true });
  writeFileSync(outPath, JSON.stringify(unflatten(merged), null, 2) + '\n');
  console.log('  wrote ' + lang + '/' + fileBase + '.json (' + entries.length + ' keys)        ');
}

(async () => {
  console.log('Translating ' + FILES.join(', ') + ' to ' + LANGS.length + ' languages with ' + MODEL);
  for (const lang of LANGS) {
    console.log('\n[' + lang + '] ' + (LANG_NAMES[lang] || lang));
    await mapLimit(FILES, CONCURRENCY, (f) => translateFile(f, lang));
  }
  console.log('\nDone. Review machine translations with native speakers before production.');
})();
