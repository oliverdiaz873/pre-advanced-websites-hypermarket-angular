const fs = require('fs');
const path = './src/assets/i18n';
const files = ['es.json', 'en.json'];
const renameMap = { name: 'nombre', phone: 'telefono', message: 'mensaje' };

function renameKeysDeep(obj) {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) { obj.forEach(renameKeysDeep); return; }

  for (const [key, value] of Object.entries(obj)) {
    if (value && typeof value === 'object') {
      renameKeysDeep(value);
    }
    if (renameMap[key]) {
      obj[renameMap[key]] = value;
      delete obj[key];
    }
  }
}

files.forEach(file => {
  const fullPath = `${path}/${file}`;
  const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

  renameKeysDeep(data);

  const tmpPath = fullPath + '.tmp';
  fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  fs.renameSync(tmpPath, fullPath);
});
