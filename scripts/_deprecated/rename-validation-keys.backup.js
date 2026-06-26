const fs = require('fs');
const path = require('path');
const i18nDir = path.resolve(__dirname, '../src/assets/i18n');
const files = ['es.json', 'en.json'];
const renameMap = { name: 'nombre', phone: 'telefono', message: 'mensaje' };

files.forEach(file => {
  const fullPath = path.join(i18nDir, file);
  const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

  const validation = data?.contact?.validation;
  if (!validation) {
    console.log(file + ': no contact.validation found');
    return;
  }

  for (const [oldKey, newKey] of Object.entries(renameMap)) {
    if (validation[oldKey]) {
      validation[newKey] = validation[oldKey];
      delete validation[oldKey];
      console.log(file + ': contact.validation.' + oldKey + ' -> ' + newKey);
    }
  }

  const tmpPath = fullPath + '.tmp';
  fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  fs.renameSync(tmpPath, fullPath);
  console.log(file + ': written');
});
