const fs = require('fs');
const readline = require('readline');
const path = require('path');

const fileStream = fs.createWriteStream(path.join(__dirname, 'text.txt'), { flags: 'a' });

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
});

console.log('Hello! Please enter some text:');

rl.on('line', (inputText) => {
    fileStream.write(inputText + '\n', (err) => {
        if (err) {
            console.error('An error occurred:', err);
        } else {
            console.log('Your text has been saved to text.txt, write somthing more');
        }
    });
});

rl.on('close', () => {
    console.log('Goodbuyyyyy');
    fileStream.end();
})
