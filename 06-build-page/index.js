const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const mkdir = promisify(fs.mkdir);
const copyFile = promisify(fs.copyFile);
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

async function copyFolder(source, destination) {
    await fs.promises.mkdir(destination, { recursive: true });
    const entries = await fs.promises.readdir(source, { withFileTypes: true });

    for (let entry of entries) {
        const sourcePath = path.join(source, entry.name);
        const destinationPath = path.join(destination, entry.name);

        if (entry.isDirectory()) {
            await copyFolder(sourcePath, destinationPath);
        } else {
            await fs.promises.copyFile(sourcePath, destinationPath);
        }
    }
}

async function htmlBuild() {
    await mkdir(
        path.join(__dirname, 'project-dist'),
        { recursive: true }
    );

    await copyFile(
        path.join(__dirname, 'template.html'),
        path.join(__dirname, 'project-dist', 'template.html')
    );

    const templatePath = path.join(__dirname, 'project-dist', 'template.html');
    const files = await readdir(
        path.join(__dirname, 'components'),
        { withFileTypes: true }
    );

    for (const item of files) {
        if (path.extname(item.name) === '.html') {
            const component = path.basename(item.name, '.html');
            const searchString = `{{${component}}}`;

            let templateData = await readFile(templatePath, 'utf-8');

            if (templateData.includes(searchString)) {
                const componentData = await readFile(path.join(__dirname, 'components', item.name), 'utf-8');
                templateData = templateData.replace(searchString, componentData);

                await fs.promises.writeFile(templatePath, templateData, 'utf-8');
            }
        }
    }

    const sourceFolder = path.join(__dirname, 'assets');
    const destinationFolder = path.join(__dirname, 'project-dist', 'assets');

    await copyFolder(sourceFolder, destinationFolder);


    const css_stream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));

    fs.readdir(
        path.join(__dirname, 'styles'),
        { withFileTypes: true },
        (err, css_files) => {
            if (err) throw err;
            css_files.forEach(item => {
                if (item.isFile() && path.extname(item.name) === '.css') {
                    const readStream = fs.createReadStream(path.join(__dirname, 'styles', item.name));
                    readStream.on('data', (chunk) => {
                        css_stream.write(chunk.toString());
                    })
                }
            })
        }
    )
}

htmlBuild().catch(console.error);


