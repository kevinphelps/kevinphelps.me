import * as chalk from 'chalk';
import * as fs from 'fs';
import * as rimraf from 'rimraf';

import { execute, executeParallel } from './helpers/shell.helpers';
import { bail, bailIf, parseFlags } from './helpers/utility.helpers';

interface Options {
  lint: boolean;
  watch: boolean;
  test: boolean;
  prod: boolean;
}

const defaultOptionsFn = (args: Options) => ({
  lint: !args.watch,
  watch: false,
  test: false,
  prod: false
});

const options = parseFlags(process.argv.slice(2), defaultOptionsFn);

bailIf(options.watch && options.prod, '--watch and --prod are mutually exclusive.');
bailIf(options.watch && options.test, '--watch and --test are mutually exclusive.');

(async () => {
  clean();

  if (options.lint) {
    await execute('ts-node ./build/lint.ts');
  }

  await build();

  if (options.test) {
    await execute('yarn run test');
  }
})();

function clean() {
  console.log(`\n${chalk.gray('cleaning...')}`);

  try {
    rimraf.sync('dist');
    fs.mkdirSync('dist');
  } catch (e) {
    bail(`Failed to clean the dist folder. ${e.message}`);
  }
}

async function build() {
  const configuration = options.prod ? 'production' : '';
  const ngOptions = ` --configuration ${configuration} ${options.watch ? '--watch' : ''}`;

  const ngBuild = collapseSpaces(`ng build --no-delete-output-path ${ngOptions}`);
  const blogBuild = 'ts-node ./build/build-blog.ts';

  if (options.watch) {
    const blogBuildWatch = `watch "${blogBuild}" ./src/blog`;

    executeParallel(ngBuild, blogBuildWatch);
  } else {
    await execute(ngBuild);
    await execute(blogBuild);
    await execute('ts-node ./build/prerender.ts');
  }
}

function collapseSpaces(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}
