/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

// Helper to extract product IDs from TypeScript file
function extractProductIds(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const matches = [...content.matchAll(/id:\s*["']([^"']+)["']/g)];
  return matches.map(m => m[1]);
}

try {
  const scriptDir = __dirname;

  const productIds = extractProductIds(path.join(scriptDir, '../src/app/data/products.data.ts'));
  const enProducts = JSON.parse(fs.readFileSync(path.join(scriptDir, '../src/assets/i18n/en.json'), 'utf8')).products;
  const esProducts = JSON.parse(fs.readFileSync(path.join(scriptDir, '../src/assets/i18n/es.json'), 'utf8')).products;

  const enProductIds = Object.keys(enProducts).filter(k => k !== '_documentation').sort();
  const esProductIds = Object.keys(esProducts).filter(k => k !== '_documentation').sort();

  console.log('\n========== MISSING TRANSLATIONS ==========\n');

  const missingEN = productIds.filter(id => !enProductIds.includes(id));
  if (missingEN.length > 0) {
    console.log(`Missing EN (${missingEN.length}):`);
    missingEN.forEach(id => console.log(`   - ${id}`));
  }

  const missingES = productIds.filter(id => !esProductIds.includes(id));
  if (missingES.length > 0) {
    console.log(`\nMissing ES (${missingES.length}):`);
    missingES.forEach(id => console.log(`   - ${id}`));
  }

  console.log('\n========== INVENTED PRODUCTS ==========\n');

  const extraEN = enProductIds.filter(id => !productIds.includes(id));
  if (extraEN.length > 0) {
    console.log(`Invented in EN (${extraEN.length}):`);
    extraEN.forEach(id => console.log(`   - ${id}`));
  }

  const extraES = esProductIds.filter(id => !productIds.includes(id));
  if (extraES.length > 0) {
    console.log(`\nInvented in ES (${extraES.length}):`);
    extraES.forEach(id => console.log(`   - ${id}`));
  }

  console.log('\n========== SUMMARY ==========');
  console.log(`Products in data: ${productIds.length}`);
  console.log(`EN translations: ${enProductIds.length} (missing: ${missingEN.length})`);
  console.log(`ES translations: ${esProductIds.length} (missing: ${missingES.length})`);
  console.log(`Invented EN: ${extraEN.length}, Invented ES: ${extraES.length}`);

  const status = missingEN.length === 0 && missingES.length === 0 && extraEN.length === 0 && extraES.length === 0;
  console.log(`\nStatus: ${status ? 'CLEAN' : 'NEEDS FIX'}\n`);

  process.exit(status ? 0 : 1);
} catch (error) {
  console.error('Error validating translations:', error.message);
  process.exit(1);
}
