import { html as formatHtml } from 'js-beautify';
import * as os from 'os';

import { readFile, walkDirectory, writeFile } from './helpers/fs.helpers';
import { bailIf, bailIfFailures, parseFlags, Failure } from './helpers/utility.helpers';

const beautifyOptions = {
  indent_size: 2,
  indent_char: ' ',
  indent_with_tabs: false,
  indent_handlebars: true,
  eol: os.EOL,
  end_with_newline: true,
  preserve_newlines: true,
  max_preserve_newlines: 1,
  indent_inner_html: true,
  wrap_line_length: 120,
  wrap_attributes_indent_size: 2,
  unformatted: ['wbr'],
  content_unformatted: ['pre', 'code', 'textarea'],
  extra_liners: ['head', 'body', '/html']
};

const defaultOptionsFn = () => ({
  fix: false,
  list: false
});

const flagsArgs = process.argv.slice(2).filter(arg => arg.startsWith('--'));
const nonFlagsArgs = process.argv.slice(2).filter(arg => !arg.startsWith('--'));

const options = parseFlags(flagsArgs, defaultOptionsFn);

bailIf(options.fix === options.list, 'exactly one of --fix or --list must be given.');

(() => {
  const failures: Failure[] = [];
  const filePaths = nonFlagsArgs.length > 0 ? nonFlagsArgs : getAllFilePaths();

  for (const filePath of filePaths) {
    const fileContents = readFile(filePath);
    const formattedFileContents = fixSelfClosingSlashes(formatHtml(fileContents, beautifyOptions));

    if (fileContents !== formattedFileContents) {
      if (options.fix) {
        writeFile(filePath, formattedFileContents);
      } else {
        failures.push({ filePath, message: 'html formatting' });
      }
    }
  }

  bailIfFailures(failures);
})();

function getAllFilePaths() {
  const filePaths: string[] = [];

  walkDirectory('./src/app', filePath => {
    if (filePath.endsWith('.html')) {
      filePaths.push(filePath);
    }
  });

  return filePaths;
}

function fixSelfClosingSlashes(html: string) {
  const selfClosingElements = [
    'area',
    'base',
    'br',
    'col',
    'command',
    'embed',
    'hr',
    'img',
    'input',
    'keygen',
    'link',
    'menuitem',
    'meta',
    'param',
    'source',
    'track',
    'wbr'
  ];

  for (const selfClosingElement of selfClosingElements) {
    html = html.replace(new RegExp(`<${selfClosingElement}>`, 'ig'), `<${selfClosingElement} />`);
  }

  html = html.replace(/\r?\n +\/>/g, ' />');

  return html;
}
