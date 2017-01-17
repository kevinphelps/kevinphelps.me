'use strict';

const uncss = require('uncss');
const glob = require('glob');
const fs = require('fs');

if (process.platform != 'win32') {
    let assetFiles = fs.readdirSync('dist/assets');
    for (let i = 0; i < assetFiles.length; i++) {
        if (/\.css$/.test(assetFiles[i])) {
            processFile(assetFiles[i]);
        }
    }
}

function processFile(cssFile) {
    glob('dist/**/*.html', (err, files) => {
        if (err) {
            throw err;
        }

        var options = {
            stylesheets: [cssFile],
            csspath: 'assets/',
            ignoreSheets: [/\/css\//],
            ignore: [
                // transitions
                '.fade',
                '.fade.in',
                '.collapse',
                '.collapse.in',
                '.collapsing',
                '.alert-danger',
                // dropdown
                '.open'
            ]
        };

        uncss(files, options, (err, output) => {
            if (err) {
                throw err;
            }

            fs.writeFileSync(`dist/assets/${cssFile}`, output);
            console.log(`uncss: processed dist/assets/${cssFile}`);
        });
    });
}