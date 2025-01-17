const fs = require('fs');
const path = require('path');

fs.readdir(
    path.join(__dirname, 'secret-folder'), 
    { withFileTypes: true },
    (err, files) => {
      if (err) throw err;

      files.forEach(file => {
        if (file.isFile()) {
            const name = file.name.slice(0, file.name.lastIndexOf('.'));
            const type = file.name.slice(file.name.lastIndexOf('.') + 1);
            const filePath = path.join(__dirname, 'secret-folder', file.name);
            const stats = fs.statSync(filePath);
            const size = stats.size;
            console.log(`${name} - ${type} - ${size}`);
        }
      });
    }  
);
