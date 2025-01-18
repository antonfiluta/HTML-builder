const fs = require('fs');
const path = require('path');

const stream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'), { flags: 'a' });

fs.readdir(
    path.join(__dirname, 'styles'),
    { withFileTypes: true },
    (err, files) => {
        if (err) throw err;
        files.forEach(file => {
            if (file.isFile() && path.extname(file.name) === '.css') {
                const readStream = fs.createReadStream(path.join(__dirname, 'styles', file.name));
                readStream.on('data', (chunk) => {
                    stream.write(chunk.toString());
                });
            }
        });
    }
);
