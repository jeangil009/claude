#!/usr/bin/env node
// Scraper genérico con Playwright.
// Uso:
//   node scrape.cjs <url> <selector-item> '<campos-json>' [--pages N] [--next "selector-siguiente"] [--out archivo.json]
// Ejemplo:
//   node scrape.cjs https://quotes.toscrape.com ".quote" '{"texto":".text","autor":".author"}' --pages 3 --next "li.next a"
//
// "campos-json": mapa nombre -> selector CSS relativo a cada item.
// Para extraer un atributo use "selector@atributo", p. ej. {"link":"a@href"}.

const { chromium } = require('playwright');
const fs = require('fs');

function parseArgs(argv) {
  const [url, itemSel, fieldsJson, ...rest] = argv;
  if (!url || !itemSel || !fieldsJson) {
    console.error('Uso: node scrape.cjs <url> <selector-item> \'<campos-json>\' [--pages N] [--next sel] [--out archivo]');
    process.exit(1);
  }
  const opts = { pages: 1, next: null, out: null };
  for (let i = 0; i < rest.length; i += 2) {
    const k = rest[i].replace(/^--/, '');
    opts[k] = k === 'pages' ? parseInt(rest[i + 1], 10) : rest[i + 1];
  }
  return { url, itemSel, fields: JSON.parse(fieldsJson), ...opts };
}

async function extractPage(page, itemSel, fields) {
  return page.$$eval(itemSel, (nodes, fields) => nodes.map((n) => {
    const row = {};
    for (const [name, spec] of Object.entries(fields)) {
      const [sel, attr] = spec.split('@');
      const el = sel ? n.querySelector(sel) : n;
      row[name] = el ? (attr ? el.getAttribute(attr) : el.textContent.trim()) : null;
    }
    return row;
  }), fields);
}

(async () => {
  const { url, itemSel, fields, pages, next, out } = parseArgs(process.argv.slice(2));
  const browser = await chromium.launch();
  const context = await browser.newContext({ userAgent: 'Mozilla/5.0 (compatible; scraper-personal/1.0)' });
  const page = await context.newPage();
  const results = [];

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    for (let p = 1; p <= pages; p++) {
      await page.waitForSelector(itemSel, { timeout: 15000 });
      const rows = await extractPage(page, itemSel, fields);
      results.push(...rows);
      console.error(`Página ${p}: ${rows.length} items (total ${results.length})`);
      if (p === pages || !next) break;
      const link = await page.$(next);
      if (!link) break;
      await Promise.all([page.waitForLoadState('domcontentloaded'), link.click()]);
      await page.waitForTimeout(1000); // pausa cortés entre páginas
    }
  } finally {
    await browser.close();
  }

  const json = JSON.stringify(results, null, 2);
  if (out) { fs.writeFileSync(out, json); console.error(`Guardado en ${out}`); }
  else console.log(json);
})().catch((e) => { console.error('Error:', e.message); process.exit(1); });
