// tslint:disable-next-line:import-blacklist (cannot use 'lodash-es/trimStart' in ts-node)
import { trimStart } from 'lodash';
import * as path from 'path';

import { readFile, walkDirectory } from './helpers/fs.helpers';
import { bailIfFailures, Failure } from './helpers/utility.helpers';

const nonFlagsArgs = process.argv.slice(2).filter(arg => !arg.startsWith('--'));

(() => {
  const failures: Failure[] = [];
  const filePaths = nonFlagsArgs.length > 0 ? nonFlagsArgs : getAllFilePaths();

  for (const filePath of filePaths) {
    const fileContents = readFile(filePath);
    failures.push(...checkForEmptyFiles(filePath, fileContents));
    failures.push(...checkForLeadingWhitespace(filePath, fileContents));
  }

  bailIfFailures(failures);
})();

function getAllFilePaths() {
  const filePaths: string[] = [];

  walkDirectory('.', filePath => {
    if (['dist', 'coverage', 'node_modules'].every(excluededFolder => !filePath.includes(excluededFolder))) {
      filePaths.push(filePath);
    }
  });

  return filePaths;
}

function checkForEmptyFiles(filePath: string, fileContents: string) {
  const fileIsEmpty = fileContents.trim().length === 0;
  const failures: Failure[] = fileIsEmpty && path.basename(filePath) !== '.gitkeep' ? [{ filePath, message: 'File is empty.' }] : [];
  return failures;
}

function checkForLeadingWhitespace(filePath: string, fileContents: string) {
  const fileHasLeadingWhitespace = trimStart(fileContents).length !== fileContents.length;
  const failures: Failure[] = fileHasLeadingWhitespace ? [{ filePath, message: 'File has leading whitespace.' }] : [];
  return failures;
}
