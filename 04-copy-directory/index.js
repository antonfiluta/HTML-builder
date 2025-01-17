const fs = require('fs').promises;
const path = require('path');

async function copyDir() {
    const files = await fs.readdir(
        path.join(__dirname, 'files'),
        { withFileTypes: true }
    );

    await fs.mkdir(filePath2 = path.join(__dirname, 'files-copy'), { recursive: true })

    for (const file of files) {
        if (file.isFile()) {
            const filePath1 = path.join(__dirname, 'files', file.name);
            const filePath2 = path.join(__dirname, 'files-copy', file.name);
            await fs.copyFile(filePath1, filePath2);
        }
    }
}

copyDir();
