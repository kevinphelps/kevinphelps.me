import chalk from 'chalk';

import { fileExists } from './helpers/fs.helpers';
import { execute } from './helpers/shell.helpers';
import { parseFlags } from './helpers/utility.helpers';

interface Options {
  prelint: boolean;
  prettier: boolean;
  sasslint: boolean;
  htmllint: boolean;
  tslint: boolean;
  fix: boolean;
  changed: boolean;
  lastCommit: boolean;
}

const defaultOptionsFn = (args: Options) => ({
  prelint: true,
  prettier: true,
  sasslint: true,
  htmllint: true,
  tslint: true,
  fix: false,
  changed: args.lastCommit,
  lastCommit: false
});

const options = parseFlags(process.argv.slice(2), defaultOptionsFn);

// tslint:disable-next-line:cyclomatic-complexity
(async () => {
  const changedFiles = options.changed ? await getChangedFiles() : undefined;
  const changedJsonFiles = options.changed ? changedFiles.filter(file => file.endsWith('.json')) : undefined;
  const changedYmlFiles = options.changed ? changedFiles.filter(file => file.endsWith('.yml')) : undefined;
  const changedTsFiles = options.changed ? changedFiles.filter(file => file.endsWith('.ts')) : undefined;
  const changedJsFiles = options.changed ? changedFiles.filter(file => file.endsWith('.js')) : undefined;
  const changedScssFiles = options.changed ? changedFiles.filter(file => file.endsWith('.scss')) : undefined;
  const changedHtmlFiles = options.changed
    ? changedFiles.filter(file => file.endsWith('.html') && !file.endsWith('index.html'))
    : undefined;

  if (options.changed) {
    console.log();
    console.log(chalk.yellow(options.lastCommit ? 'Linting changed files including the last commit:' : 'Linting changed files:'));
    console.log(chalk.yellow(changedFiles.map(file => `  ${file}`).join('\n')));

    if (changedFiles.join(' ').length > 8000) {
      console.log();
      console.log(chalk.red('There are too many changed files. Please run the linter on all files instead.'));

      process.exit(1);
      return;
    }
  }

  if (options.prelint && (!options.changed || changedFiles.length > 0)) {
    const filesArg = options.changed ? changedFiles.join(' ') : '';
    await execute(`ts-node ./build/prelint.ts ${filesArg}`);
  }

  if (options.prettier && (!options.changed || changedHtmlFiles.length > 0)) {
    const filesArg = options.changed ? changedHtmlFiles.join(' ') : '';
    await runFormatter(`ts-node ./build/format-html.ts ${filesArg}`, '--fix', '--list', options.fix);
  }

  if (options.prettier && (!options.changed || changedJsonFiles.length > 0)) {
    const filesArg = options.changed ? changedJsonFiles.join(' ') : '"./**/*.json"';
    await runFormatter(`prettier --config ./prettier.json ${filesArg}`, '--write', '--list-different', options.fix);
  }

  if (options.prettier && (!options.changed || changedYmlFiles.length > 0)) {
    const filesArg = options.changed ? changedYmlFiles.join(' ') : '"./**/*.yml"';
    await runFormatter(`prettier --config ./prettier.json ${filesArg}`, '--write', '--list-different', options.fix);
  }

  if (options.prettier && (!options.changed || changedScssFiles.length > 0)) {
    const filesArg = options.changed ? changedScssFiles.join(' ') : '"./src/**/*.scss"';
    await runFormatter(`prettier --config ./prettier.json ${filesArg}`, '--write', '--list-different', options.fix);
  }

  if (options.prettier && (!options.changed || changedTsFiles.length > 0)) {
    const filesArg = options.changed ? changedTsFiles.join(' ') : './**/*.ts';
    await runFormatter(`prettier --config ./prettier.json ${filesArg}`, '--write', '--list-different', options.fix);
  }

  if (options.prettier && (!options.changed || changedJsFiles.length > 0)) {
    const filesArg = options.changed ? changedJsFiles.join(' ') : './**/*.js';
    await runFormatter(`prettier --config ./prettier.json ${filesArg}`, '--write', '--list-different', options.fix);
  }

  if (options.sasslint && (!options.changed || changedScssFiles.length > 0)) {
    const filesArg = options.changed ? changedScssFiles.join(' ') : '';
    await execute(`sass-lint ${filesArg} -v -q --max-warnings 0`);
  }

  if (options.tslint && (!options.changed || changedTsFiles.length > 0)) {
    const filesArg = options.changed ? changedTsFiles.join(' ') : '';
    await execute(`tslint --project ./tsconfig.json ${options.fix ? '--fix' : ''} ${filesArg}`);
  }
})();

async function getChangedFiles() {
  const renameIndicator = ' -> ';

  const status = await execute('git status --porcelain', { stdio: undefined });
  console.log(status.stdout.trimRight());

  const changes = splitLines(status.stdout).map(line =>
    line.includes(renameIndicator) ? line.substr(line.indexOf(renameIndicator) + renameIndicator.length) : line.substr(3)
  );

  if (options.lastCommit) {
    const committed = await execute('git diff --name-only head~1...', { stdio: undefined });
    console.log(committed.stdout.trimRight());

    changes.push(...splitLines(committed.stdout));
  }

  return changes.filter(file => fileExists(file));
}

function splitLines(value: string) {
  return value.split(/\r?\n/).filter(line => line.length > 0);
}

async function runFormatter(command: string, writeArg: string, listDifferentArg: string, fix: boolean) {
  if (fix) {
    do {
      await execute(`${command} ${writeArg}`);
    } while ((await execute(`${command} ${listDifferentArg}`, {}, false)).code !== 0);
  } else {
    await execute(`${command} ${listDifferentArg}`);
  }
}
