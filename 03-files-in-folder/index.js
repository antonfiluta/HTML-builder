const fs = require('fs').promises;
const path = require('path');

async function processFiles() {
  const files = await fs.readdir(
    path.join(__dirname, 'secret-folder'),
    { withFileTypes: true }
  );

  for (const file of files) {
    if (file.isFile()) {
      const name = file.name.slice(0, file.name.lastIndexOf('.'));
      const type = file.name.slice(file.name.lastIndexOf('.') + 1);
      const filePath = path.join(__dirname, 'secret-folder', file.name);
      const stats = await fs.stat(filePath);
      const size = stats.size;
      console.log(`${name} - ${type} - ${size}`);
    }
  }
}

processFiles();

